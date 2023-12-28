import { useState, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DragHandleIcon from '@mui/icons-material/DragHandle';

const GridAddItem = () => {
  return (
    <div className="grid-items card ignoreDrag">
      <div className="card-body d-flex justify-content-center align-items-center h3 m-0">
        +
      </div>
    </div>
  );
};

const GridItem = ({ item }) => {
  const theme = useTheme();

  const cardStyles = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    border: '1px solid #ccc',
    borderRadius: 0,
    bgcolor: item?.backgroundColor,
    color: theme.palette.getContrastText(item?.backgroundColor),
  };

  return (
    <>
      <Card sx={cardStyles}>
        <CardActions sx={{ p: 0 }}>
          <IconButton className="dragHandle" aria-label="drag" size="medium">
            <Tooltip title="拖曳" placement="top">
              <DragHandleIcon />
            </Tooltip>
          </IconButton>
        </CardActions>

        <CardContent sx={{ flexGrow: 1, py: 4, textAlign: 'center' }}>
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            sx={{
              color: !item?.stockId ? theme.palette.text.disabled : 'inherit',
            }}
          >
            {item?.stockId ? item?.stockName : item?.stockSeq + 1}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary">
            {/* {item?.price} */}
            {item?.stockId
              ? new Intl.NumberFormat('zh-TW', {
                  style: 'currency',
                  currency: 'TWD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(item?.price)
              : '_'}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

const GridSortable = () => {
  const [list, setList] = useState([]);
  const [draftList, setDraftList] = useState([]);
  const localStorageKey = 'gridSortableData';

  useEffect(() => {
    const storedData = localStorage.getItem(localStorageKey);

    if (storedData) {
      setList(JSON.parse(storedData));
    } else {
      fetch('/src/assets/data/data.json')
        .then((res) => res.json())
        .then((data) => {
          setList(data.map((item) => ({ ...item })));
          localStorage.setItem(localStorageKey, JSON.stringify(data));
        });
    }
  }, []);

  useEffect(() => {
    console.log('list updated:', list);
  }, [list]);

  useEffect(() => {
    console.log('draftList updated:', draftList);
    setList(draftList);
  }, [draftList]);

  // Drag and Drop Handler
  const handleDragDropEnds = (oldIndex, newIndex) => {
    console.log('Drag and drop other tasks');
    console.log(oldIndex, newIndex);
    // list[0].stockList[oldIndex].stockSeq = newIndex;
    // list[0].stockList[newIndex].stockSeq = oldIndex;
    // console.log('updatedList:::', list[0]);
    const updatedList = list[0]?.stockList.map((item, index) => ({
      ...item,
      stockSeq: index,
    }));
    console.log('updatedList:::', updatedList);

    // setDraftList((prevList) => {
    //   const newListCopy = [...prevList];
    //   newListCopy[0].stockList = updatedList;
    //   return newListCopy;
    // });
    setDraftList([{ ...list[0], stockList: updatedList }]);
  };

  const handleSetList = (newList) => {
    const updatedList = newList.map((item, index) => ({
      ...item,
      stockSeq: index,
    }));

    setList([{ ...list[0], stockList: updatedList }]);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        p: 8,

        border: '1px solid #ccc',
        borderRadius: '12px',
        bgcolor: '#cfe8fc',
        shadow:
          '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',

        '& .grid-container': {
          display: 'grid',
          gap: '0',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: '100%',
          overflowY: 'hidden',
        },

        '& .dropArea': {
          position: 'relative',

          '&::before': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',

            backgroundColor: '#ebebeb',
            zIndex: 1,
          },
        },
      }}
    >
      {list.length === 0 ? (
        <GridAddItem />
      ) : (
        <ReactSortable
          list={list[0].stockList}
          setList={(newList) => {
            // setList([{ ...list[0], stockList: newList }]);
            // console.log('newList:::', newList);
            handleSetList(newList);
          }}
          className="grid-container"
          ghostClass="dropArea"
          handle=".dragHandle"
          filter=".ignoreDrag"
          preventOnFilter={true}
          // onEnd={({ oldIndex, newIndex }) =>
          //   handleDragDropEnds(oldIndex, newIndex)
          // }
        >
          {list?.[0]?.stockList.map((item, index) => (
            <GridItem key={item.stockSeq} item={item} />
          ))}
          {/* {list?.[0].stockList.map((item, index) => (
            <GridItem key={item.stockId} item={item} />
          ))} */}
        </ReactSortable>
      )}
    </Box>
  );
};

export default GridSortable;
