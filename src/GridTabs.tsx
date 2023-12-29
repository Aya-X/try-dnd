import { useState, useEffect } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import GridSortable from './GridSortable';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
// end of TabPanel

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
// end of a11yProps

export default function GridTabs() {
  const [value, setValue] = useState<number>(0);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    fetch('/src/assets/data/data.json')
      .then((res) => res.json())
      .then((data) => {
        setDataList(data);
      })
      .catch((fetchError) => {
        console.error('Error fetching data:', fetchError);
      });
  }, []);

  useEffect(() => {
    console.log('list updated:', dataList);
  }, [dataList]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabsData = [
    { label: 'Item One', content: 'Item One Content' },
    { label: 'Item Two', content: 'Item Two Content' },
    { label: 'Item Three', content: 'Item Three Content' },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="grid tabs">
          {dataList.length > 0 &&
            dataList.map((data, index) => (
              <Tab
                key={index}
                label={`${data?.categorySeq}-${data?.categoryName}`}
                {...a11yProps(index)}
              />
            ))}

          {tabsData.map((tab, index) => (
            <Tab key={index} label={tab.label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {dataList.length > 0 &&
        dataList.map((data, index) => (
          <TabPanel key={index} value={value} index={index}>
            {data?.categorySeq}
            {data?.categoryName}
            <GridSortable dataList={dataList} />
          </TabPanel>
        ))}
    </Box>
  );
}
