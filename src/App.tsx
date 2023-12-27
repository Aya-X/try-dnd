import { useState } from 'react';

import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import rawData from './assets/data/data.json';

const GridItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',

  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  border: '1px solid #ccc',
  borderRadius: '0',
}));

function FormRow(props) {
  const { item } = props;

  return (
    <>
      <Grid item xs={2} sm={3} md={4} sx={{ height: '20%' }}>
        <GridItem>{item?.stockName}</GridItem>
      </Grid>
    </>
  );
}

function NestedGrid(props) {
  const { data } = props;

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 8,
        height: '80%',
        alignItems: 'stretch',
      }}
    >
      <Grid
        container
        spacing={0}
        // direction="column"
        columns={{ xs: 3, sm: 9, md: 12 }}
        justifyContent={'center'}
        sx={{ height: '100%' }}
      >
        {data?.[0].stockList.map((item, index) => (
          <FormRow key={index} item={item} />
        ))}

        {/* {Array.from(Array(15)).map((_, index) => (
          <FormRow key={index} />
        ))} */}
      </Grid>
    </Box>
  );
}

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0);
  const [data, setData] = useState<object[]>(() => rawData);

  return (
    <>
      <CssBaseline />

      <Container maxWidth="xl">
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>
          <h1>Vite + React</h1>

          <div className="card">
            <button
              type="button"
              onClick={() => setCount((prevCount) => prevCount + 1)}
            >
              <span>count is </span>
              {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>

          <NestedGrid data={data} />
        </Box>
      </Container>
    </>
  );
}

export default App;
