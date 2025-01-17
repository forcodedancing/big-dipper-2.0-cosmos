import { useGrid } from '@/hooks';
import { useStyles } from '@/screens/block_details/components/consensus/components/desktop/styles';
import {
  columns,
  formatRows,
} from '@/screens/block_details/components/consensus/components/desktop/utils';
import type { ConsensusType } from '@/screens/block_details/types';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeGrid as Grid } from 'react-window';

const Desktop: React.FC<{ items: ConsensusType[] } & ComponentDefault> = (props) => {
  const { t } = useTranslation('blocks');
  const classes = useStyles();
  const { gridRef, columnRef, onResize, getColumnWidth, getRowHeight } = useGrid(columns);
  const rows = formatRows(props.items);

  return (
    <div className={classes.root}>
      <AutoSizer onResize={onResize}>
        {({ height, width }) => (
          <>
            {/* ======================================= */}
            {/* Table Header */}
            {/* ======================================= */}
            <Grid
              ref={columnRef as React.LegacyRef<Grid>}
              columnCount={columns.length}
              columnWidth={(index) => getColumnWidth(width, index)}
              height={50}
              rowCount={1}
              rowHeight={() => 50}
              width={width}
            >
              {({ columnIndex, style }) => {
                const { key, align } = columns[columnIndex];

                return (
                  <div style={style} className={classes.cell}>
                    <Typography variant="h4" align={align}>
                      {t(key)}
                    </Typography>
                  </div>
                );
              }}
            </Grid>
            {/* ======================================= */}
            {/* Table Body */}
            {/* ======================================= */}
            <Grid
              ref={gridRef as React.LegacyRef<Grid>}
              columnCount={columns.length}
              columnWidth={(index) => getColumnWidth(width, index)}
              height={height - 50}
              rowCount={rows.length}
              rowHeight={getRowHeight}
              width={width}
            >
              {({ columnIndex, rowIndex, style }) => {
                const { key, align } = columns[columnIndex];
                const selectedItem = rows[rowIndex][key];
                return (
                  <div
                    style={style}
                    className={classnames(classes.cell, classes.body, {
                      odd: !(rowIndex % 2),
                    })}
                  >
                    <Typography variant="body1" align={align} component="div">
                      {selectedItem}
                    </Typography>
                  </div>
                );
              }}
            </Grid>
          </>
        )}
      </AutoSizer>
    </div>
  );
};

export default Desktop;
