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
import ClearIcon from '@mui/icons-material/Clear';

const hoverEffectStyles = {
  transition: 'transform .3s linear',
  '&:hover': { transform: 'scale(1.2)' },
};

const GridAddItem = () => {
  return (
    <div className="grid-items card ignoreDrag">
      <div className="card-body d-flex justify-content-center align-items-center h3 m-0">
        +
      </div>
    </div>
  );
};
// edf of GridAddItem

const GridItem = ({ item, index, handleDelete }) => {
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
        <CardActions
          sx={{ p: 0, display: 'flex', justifyContent: 'space-between' }}
        >
          <IconButton
            className="dragHandle"
            aria-label="drag"
            size="medium"
            // sx={hoverEffectStyles}
          >
            <Tooltip title="拖曳" placement="top">
              <DragHandleIcon
                sx={{
                  ...hoverEffectStyles,
                  cursor: 'grab',

                  '&:hover': {
                    ...hoverEffectStyles['&:hover'],
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </Tooltip>
          </IconButton>

          <IconButton aria-label="delete" size="small">
            <Tooltip title="刪除" placement="top">
              <ClearIcon
                onClick={() => handleDelete(index)}
                color="disabled"
                sx={{
                  ...hoverEffectStyles,

                  '&:hover': {
                    ...hoverEffectStyles['&:hover'],
                    color: theme.palette.error.main,
                  },
                }}
              />
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
          <Typography sx={{ fontSize: 14 }}>
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
// end of GridItem

const GridSortable = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch('/src/assets/data/data.json')
      .then((res) => res.json())
      .then((data) => {
        setList(data);
      })
      .catch((fetchError) => {
        console.error('Error fetching data:', fetchError);
      });
  }, []);

  useEffect(() => {
    console.log('list updated:', list);
  }, [list]);

  const handleSetList = (newList) => {
    const updatedList = newList.map((item, index) => ({
      ...item,
      stockSeq: index,
    }));

    setList([{ ...list[0], stockList: updatedList }]);
  };

  const handleDelete = (index) => {
    const updatedList = [...list[0].stockList];
    updatedList.splice(index, 1);
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
            <GridItem
              key={item.stockSeq}
              item={item}
              index={index}
              handleDelete={handleDelete}
            />
          ))}
        </ReactSortable>
      )}
    </Box>
  );
};

export default GridSortable;
