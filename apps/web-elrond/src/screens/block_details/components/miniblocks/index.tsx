import React from 'react';
import classnames from 'classnames';
import Link from 'next/link';
import Box from '@/components/box';
import useTranslation from 'next-translate/useTranslation';
import Typography from '@material-ui/core/Typography';
import { MINIBLOCK_DETAILS } from '@/utils/go_to_page';
import type { MiniBlockType } from '@/screens/block_details/types';
import { useStyles } from '@/screens/block_details/components/miniblocks/styles';

const MiniBlocks: React.FC<{ miniBlocks: MiniBlockType[] } & ComponentDefault> = (props) => {
  const { t } = useTranslation('blocks');
  const classes = useStyles();
  return (
    <Box className={classnames(props.className, classes.root)}>
      <Typography className={classes.title} variant="h2">
        {t('miniBlocks')}
      </Typography>
      <div className={classes.listContainer}>
        {props.miniBlocks.map((x) => (
          <div key={x} className={classes.item}>
            <div className={classes.hash}>
              <div className={classes.bullet} />
              <Link href={MINIBLOCK_DETAILS(x)} passHref>
                <Typography variant="body1" className={classes.block} component="a">
                  {x}
                </Typography>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default MiniBlocks;
