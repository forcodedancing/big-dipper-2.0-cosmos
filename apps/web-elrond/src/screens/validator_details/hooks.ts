import { IDENTITY, PROVIDERS, PROVIDER_DETAILS, STAKE } from '@/api';
import chainConfig from '@/chainConfig';
import type { ValidatorDetailsState } from '@/screens/validator_details/types';
import { isBech32 } from '@/utils/bech32';
import { formatNumber, formatToken } from '@/utils/format_token';
import axios from 'axios';
import Big from 'big.js';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import { useCallback, useEffect, useState } from 'react';

const { primaryTokenUnit } = chainConfig();

const defaultTokenUnit: TokenUnit = {
  value: '0',
  baseDenom: '',
  displayDenom: '',
  exponent: 0,
};

export const useValidatorDetails = () => {
  const router = useRouter();
  const [state, setState] = useState<ValidatorDetailsState>({
    loading: true,
    exists: true,
    isProvider: false,
    contract: null,
    stake: {
      totalStaked: defaultTokenUnit,
      locked: defaultTokenUnit,
      stake: defaultTokenUnit,
      topUp: defaultTokenUnit,
      stakePercent: 0,
    },
    profile: {
      name: '',
      imageUrl: '',
      description: '',
    },
    overview: {
      location: '',
      website: '',
      identity: '',
      stakeDistribution: [],
    },
  });

  const handleSetState = useCallback(
    (stateChange: (prevState: ValidatorDetailsState) => ValidatorDetailsState) => {
      setState((prevState) => {
        const newState = stateChange(prevState);
        return R.equals(prevState, newState) ? prevState : newState;
      });
    },
    []
  );

  useEffect(() => {
    const getValidator = async () => {
      try {
        const identityData = await getIdentity();
        const providerData = await getProvider();
        const isProvider = !!providerData;

        const newState: Partial<ValidatorDetailsState> = {
          loading: false,
          isProvider,
        };

        // =====================================
        // contract
        // =====================================
        if (isProvider) {
          const getContract = () => ({
            address: providerData?.provider ?? '',
            locked: formatToken(providerData?.locked ?? '0', primaryTokenUnit),
            nodes: providerData?.numNodes ?? 0,
            apr: providerData?.apr ?? 0,
            commission: providerData?.serviceFee ?? 0,
            delegationCap: formatToken(providerData?.delegationCap ?? '0', primaryTokenUnit),
            delegators: providerData?.numUsers ?? 0,
          });

          newState.contract = getContract();
        }

        // =====================================
        // stake
        // =====================================
        const getStake = async () => {
          const { data: stakeData } = await axios.get(STAKE);
          let reference;
          if (identityData) {
            reference = identityData;
          } else {
            reference = providerData;
          }
          const locked = Big(reference?.locked || 0);
          const totalStaked = Big(stakeData?.totalStaked || 0);

          const stakePercentString = !totalStaked.eq(0)
            ? Big(locked).div(totalStaked)?.times(100).toFixed(3)
            : '0';

          return {
            locked: formatToken(locked.toString(), primaryTokenUnit),
            stake: formatToken(reference?.stake ?? '0', primaryTokenUnit),
            topUp: formatToken(reference?.topUp ?? '0', primaryTokenUnit),
            totalStaked: formatToken(totalStaked.toString(), primaryTokenUnit),
            stakePercent: Number(formatNumber(stakePercentString, 2)),
          };
        };
        newState.stake = await getStake();

        // =====================================
        // profile
        // =====================================
        const getProfile = () => {
          if (identityData) {
            return {
              name: identityData?.name ?? '',
              imageUrl: identityData?.avatar ?? '',
              description: identityData?.description ?? '',
            };
          }
          return {
            name: providerData?.provider ?? '',
            imageUrl: '',
            description: '',
          };
        };
        newState.profile = getProfile();

        // =====================================
        // overview
        // =====================================
        const getOverview = () => {
          // distribution
          let distribution: Array<{ key: string; value: number }> = [];
          if (identityData) {
            const keys = R.keys(identityData?.distribution);
            distribution = keys.map((x) => ({
              key: x as string,
              value: identityData?.distribution?.[x] ?? 0,
            }));
          }

          return {
            location: identityData?.location ?? '',
            website: identityData?.website ?? '',
            identity: identityData?.identity ?? '',
            stakeDistribution: distribution,
          };
        };
        newState.overview = getOverview();

        handleSetState((prevState) => ({ ...prevState, ...newState }));
      } catch (error) {
        handleSetState((prevState) => ({
          ...prevState,
          loading: false,
          exists: false,
        }));
        console.error((error as Error).message);
      }
    };

    const getIdentity = async () => {
      try {
        if (isBech32(router.query.identity as string)) {
          return null;
        }
        const { data: identityData } = await axios.get(IDENTITY(router.query.identity as string));
        return identityData;
      } catch {
        return null;
      }
    };

    const getProvider = async () => {
      try {
        let providerData = null;
        if (isBech32(router.query.identity as string)) {
          const { data: providerRawData } = await axios.get(
            PROVIDER_DETAILS(router.query.identity as string)
          );
          providerData = providerRawData;
        } else {
          const { data: providerRawData } = await axios.get(PROVIDERS, {
            params: {
              size: 1,
              identity: router.query.identity,
            },
          });
          providerData = providerRawData?.[0] ?? null;
        }

        return providerData;
      } catch {
        return null;
      }
    };

    getValidator();
  }, [handleSetState, router.query.identity]);

  return {
    state,
  };
};
