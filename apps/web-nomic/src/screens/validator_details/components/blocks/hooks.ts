import {
  LastHundredBlocksSubscription,
  useLastHundredBlocksSubscription,
} from '@/graphql/types/general_types';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const useBlocks = () => {
  const [state, setState] = useState<
    {
      height: number;
      txs: number;
      proposer: string;
      signed: boolean;
    }[]
  >([]);

  const router = useRouter();

  useLastHundredBlocksSubscription({
    variables: {
      address: (router?.query?.address as string) ?? '',
    },
    onData: (data) => {
      setState(data.data.data ? formatLastHundredBlocks(data.data.data) : []);
    },
  });

  const formatLastHundredBlocks = (data: LastHundredBlocksSubscription) =>
    data.block.map((x) => ({
      height: x.height,
      txs: x.transactions.length,
      proposer: x.precommits[0].validatorAddress,
      signed: x.precommits.length === 1,
    }));

  return {
    state,
  };
};
