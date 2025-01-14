import { useStyles } from '@/screens/validator_details/components/staking/components/tabs/styles';
import { a11yProps } from '@/utils/a11yProps';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import classnames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import numeral from 'numeral';
import React, { ComponentProps } from 'react';

const TabsHeader: React.FC<{
  className?: string;
  tab: number;
  handleTabChange: ComponentProps<typeof Tabs>['onChange'];
  tabs: {
    id: number;
    key: string;
    count: number;
    component?: React.ReactNode;
  }[];
}> = ({ className, tab, handleTabChange, tabs }) => {
  const classes = useStyles();
  const { t } = useTranslation('accounts');

  return (
    <div className={classnames(className, classes.root)}>
      <Tabs variant="scrollable" scrollButtons="off" value={tab} onChange={handleTabChange}>
        {tabs.map((x) => (
          <Tab
            key={x.key}
            label={t(x.key, {
              num: numeral(x.count ?? 0).format('0,0'),
            })}
            {...a11yProps(x.id)}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default TabsHeader;
