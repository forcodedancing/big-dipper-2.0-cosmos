import React from 'react';
import classnames from 'classnames';
import Box from '@/components/box';
import LoadAndExist from '@/components/load_and_exist';
import TabPanel from '@/components/tab_panel';
import Validators from '@/screens/validators/components/list/components/validators';
import Tabs from '@/screens/validators/components/list/components/tabs';
import { useStyles } from '@/screens/validators/components/list/styles';
import { useValidators } from '@/screens/validators/components/list/hooks';
import type { TabType } from '@/screens/validators/components/list/types';

const List: React.FC<{
  className?: string;
}> = ({ className }) => {
  const classes = useStyles();
  const { state, handleTabChange, handleSearch } = useValidators();

  const tabs: TabType[] = [
    {
      id: 0,
      key: 'validators',
      component: <Validators search={state.search} items={state.validators} />,
    },
  ];

  return (
    <LoadAndExist loading={state.loading} exists={state.exists}>
      <Box className={classnames(className, classes.root)}>
        <Tabs
          tabs={tabs}
          tab={state.tab}
          handleTabChange={handleTabChange}
          handleSearch={handleSearch}
        />
        {tabs.map((x) => (
          <TabPanel key={x.id} index={x.id} value={state.tab}>
            <div className={classes.list}>{x.component}</div>
          </TabPanel>
        ))}
      </Box>
    </LoadAndExist>
  );
};

export default List;
