/* eslint-disable no-nested-ternary */
import Box from '@/components/box';
import Loading from '@/components/loading';
import NoData from '@/components/no_data';
import { useScreenSize } from '@/hooks';
import { useProfilesRecoil } from '@/recoil/profiles';
import { useBlocks } from '@/screens/home/components/blocks/hooks';
import { useStyles } from '@/screens/home/components/blocks/styles';
import { BLOCKS } from '@/utils/go_to_page';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';

const Desktop = dynamic(() => import('@/screens/home/components/blocks/components/desktop'));
const Mobile = dynamic(() => import('@/screens/home/components/blocks/components/mobile'));

const Blocks: React.FC<{
  className?: string;
}> = ({ className }) => {
  const { isDesktop } = useScreenSize();
  const { t } = useTranslation('home');
  const classes = useStyles();
  const { state } = useBlocks();

  const proposerProfiles = useProfilesRecoil(state.items.map((x) => x.proposer));
  const mergedDataWithProfiles = state.items.map((x, i) => ({
    ...x,
    proposer: proposerProfiles[i],
  }));

  return (
    <Box className={classnames(className, classes.root)}>
      <div className={classes.label}>
        <Typography variant="h2">{t('latestBlocks')}</Typography>
        <Link href={BLOCKS} passHref>
          <Typography variant="h4" className="button" component="a" aria-label="see more blocks">
            {t('seeMore')}
          </Typography>
        </Link>
      </div>
      {state.items.length ? (
        <>
          {isDesktop ? (
            <Desktop className={classes.desktop} items={mergedDataWithProfiles} />
          ) : (
            <Mobile className={classes.mobile} items={mergedDataWithProfiles} />
          )}
          <Divider className={classes.mobile} />
          <Link href={BLOCKS} passHref>
            <Typography
              variant="h4"
              component="a"
              aria-label="see more blocks"
              className={classnames(classes.seeMoreFooter, classes.mobile, 'button')}
            >
              {t('seeMore')}
            </Typography>
          </Link>
        </>
      ) : state.loading ? (
        <Loading />
      ) : (
        <NoData />
      )}
    </Box>
  );
};

export default Blocks;
