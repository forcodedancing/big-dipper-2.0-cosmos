import Box from '@/components/box';
import { getMessageByType } from '@/components/msg/utils';
import TransactionMessagesFilter from '@/components/transaction_messages_filter';
import { useList, useListRow } from '@/hooks';
import { useStyles } from '@/screens/transaction_details/components/messages/styles';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ListChildComponentProps, VariableSizeList as List } from 'react-window';

type MessagesProps = {
  className?: string;
  messages: unknown[];
  viewRaw: boolean;
  toggleMessageDisplay: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMessageFilterCallback: (value: string) => void;
};

const Messages: FC<MessagesProps> = ({ className, ...props }) => {
  const { t } = useTranslation('transactions');
  const classes = useStyles();

  const { listRef, getRowHeight, setRowHeight } = useList();

  const formattedItems = props.messages.map((x) => getMessageByType(x, props.viewRaw, t));

  return (
    <Box className={classnames(className, classes.root)}>
      <div className={classes.header}>
        <div className={classes.mobileOptions}>
          <Typography variant="h2">{t('messages')}</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={props.viewRaw}
                onChange={props.toggleMessageDisplay}
                color="primary"
              />
            }
            label={t('raw')}
          />
        </div>
        <div className={classes.desktopOptions}>
          <FormControlLabel
            control={
              <Switch
                checked={props.viewRaw}
                onChange={props.toggleMessageDisplay}
                color="primary"
              />
            }
            label={t('raw')}
          />
          <TransactionMessagesFilter
            className={classes.filter}
            callback={props.onMessageFilterCallback}
          />
        </div>
      </div>
      <Divider />
      <div className={classes.list}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              className="List"
              height={height}
              itemCount={props.messages.length}
              itemSize={getRowHeight}
              ref={listRef as React.LegacyRef<List>}
              width={width}
            >
              {({ index, style }) => (
                <ListItem
                  {...{ index, style, setRowHeight, formattedItems, classes }}
                  messages={props.messages}
                />
              )}
            </List>
          )}
        </AutoSizer>
      </div>
    </Box>
  );
};

type ListItemProps = Pick<ListChildComponentProps, 'index' | 'style'> & {
  setRowHeight: Parameters<typeof useListRow>[1];
  formattedItems: Array<{ type: unknown; message: unknown }>;
  classes: ReturnType<typeof useStyles>;
  messages: unknown[];
};

const ListItem: FC<ListItemProps> = ({
  index,
  style,
  setRowHeight,
  formattedItems,
  classes,
  messages,
}) => {
  const { rowRef } = useListRow(index, setRowHeight);
  const selectedItem = formattedItems[index];
  return (
    <div style={style}>
      <div ref={rowRef}>
        <div className={classes.item}>
          <div className={classes.tags}>{selectedItem.type}</div>
          <span className="msg">{selectedItem.message}</span>
        </div>
        {index !== messages.length - 1 && <Divider />}
      </div>
    </div>
  );
};

export default Messages;
