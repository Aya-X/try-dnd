import { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import GridSortable from './GridSortable';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const StyledTab = styled(Tab)({
  marginRight: '1px',

  backgroundColor: '#ccc',
  borderRadius: '12px 12px 0 0',

  '&:hover': {
    color: '#40a9ff',
    opacity: 1,
  },

  '&.Mui-selected': {
    color: 'grey',
    backgroundColor: '#fff',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'gold',
  },

  // '&.MuiTab-root.Mui-selected': {
  //   color: 'gold',
  // },
});

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <>{children}</>
        </Box>
      )}
    </Box>
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

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Tabs
          TabIndicatorProps={{ sx: { display: 'none' } }}
          sx={{
            '& .MuiTabs-flexContainer': {
              flexWrap: 'wrap',
            },
          }}
          // variant="scrollable"
          // scrollButtons={true}
          value={value}
          onChange={handleChange}
          aria-label="grid tabs"
        >
          {dataList.length > 0 &&
            dataList.map((data, index) => (
              <StyledTab
                key={index}
                label={`${data?.categorySeq}-${data?.categoryName}`}
                {...a11yProps(index)}
              />
            ))}
        </Tabs>
      </Box>

      {dataList.length > 0 &&
        dataList.map((data, index) => (
          <TabPanel key={index} value={value} index={index}>
            <GridSortable
              dataList={dataList}
              categoryIndex={index}
              stockList={data?.stockList}
            />
          </TabPanel>
        ))}
    </Box>
  );
}
