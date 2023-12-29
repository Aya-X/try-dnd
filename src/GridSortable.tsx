import { useState, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import FilledInput from '@mui/material/FilledInput';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';

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

const RenderStockName = (props) => {
  const { stockName, handleSave } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(stockName);

  const handleEditStockName = () => {
    console.log('handleEditStockName:', editValue);
    handleSave(editValue);
    setIsEditing(false);
  };

  return (
    <>
      {isEditing ? (
        <FilledInput
          id="stockName"
          aria-describedby="stockName"
          size="small"
          // defaultValue={stockName}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          // #TODO: Refactor if leave this card
          onMouseLeave={() => setIsEditing(false)}
          onKeyDownCapture={(e) => {
            if (e.key === 'Enter') {
              handleEditStockName();
            }
          }}
          sx={{ p: 0, textAlign: 'center', '& .MuiInputBase-input': { p: 1 } }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="save stock name"
                onClick={handleEditStockName}
              >
                <SaveIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      ) : (
        <Button
          variant="text"
          color="inherit"
          size="large"
          onClick={() => setIsEditing(true)}
        >
          {stockName}
        </Button>
      )}
    </>
  );
};

const GridItem = ({ item, index, handleDelete, handleSaveStockName }) => {
  const theme = useTheme();

  const cardStyles = {
    display: 'flex',
    flexDirection: 'column',
    // height: '100%',
    aspectRatio: '1 / 1',
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

        <CardContent
          sx={{
            flexGrow: 1,
            pt: '24%',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            sx={{
              color: !item?.stockId ? theme.palette.text.disabled : 'inherit',
            }}
          >
            {item?.stockId ? (
              <RenderStockName
                stockName={item?.stockName}
                handleSave={(newName) => {
                  console.log('RenderStockName handleSave:', index, newName);
                  handleSaveStockName(index, newName);
                }}
              />
            ) : (
              item?.stockSeq + 1
            )}
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

const GridSortable = (props) => {
  const { dataList, categoryIndex, stockList } = props;
  const [list, setList] = useState(() => dataList);
  const [gridList, setGridList] = useState([]);

  useEffect(() => {
    if (list && categoryIndex < list.length && categoryIndex >= 0) {
      setGridList([...(list[categoryIndex]?.stockList || [])]); // 使用展開運算符並確保 stockList 存在
    }
  }, [list, categoryIndex]);

  const handleSetList = (newList) => {
    setList((prevList) => {
      // 在原有基礎上更新特定類別的 stockList
      const updatedList = prevList.map((item, index) =>
        index === categoryIndex ? { ...item, stockList: newList } : item,
      );

      console.log(
        'Updating list from:',
        prevList.length,
        'to:',
        updatedList.length,
      );
      return updatedList;
    });
  };

  const handleDelete = (deleteIndex) => {
    setList((prevList) => {
      const updatedStockList = [...prevList[categoryIndex].stockList];

      // 保留 posStockGridCategoryId 和 stockSeq，其他設為空
      const originalItem = updatedStockList[deleteIndex];

      updatedStockList[deleteIndex] = {
        // 保留原始資料
        posStockGridCategoryId: originalItem.posStockGridCategoryId,
        stockSeq: originalItem.stockSeq,

        stockId: '',
        stockMaster: {
          stockId: '',
          internationalBarcode: '',
          stockBrandId: '',
          categoryId: '',
          description: '',
          longDescription: '',
          useUnits: '',
          mbflag: '',
          stockMbflag: null,
          taxCatId: 0,
          stockTradeTypeId: 0,
          saleStartDate: null,
          saleStopDate: null,
          inventoryAccount: '',
          incomeAccount: '',
          price: null,
          bloodTestMaxValue: null,
          bloodTestMinValue: null,
        },
        stockName: '',
        price: 0,
        backgroundColor: '#fcfcfc',
        undiscountable: null,
      };

      const updatedList = prevList.map((item, index) =>
        index === categoryIndex
          ? { ...item, stockList: updatedStockList }
          : item,
      );

      return updatedList;
    });
  };

  const handleSaveStockName = (saveIndex, newName) => {
    setList((prevList) => {
      // 複製當前類別的 stockList 並更新指定項目的 stockName
      const updatedStockList = prevList[categoryIndex].stockList.map(
        (item, index) =>
          index === saveIndex ? { ...item, stockName: newName } : item,
      );

      // 更新當前類別的 stockList 並保留其他
      const updatedList = prevList.map((item, index) =>
        index === categoryIndex
          ? { ...item, stockList: updatedStockList }
          : item,
      );

      return updatedList;
    });
  };

  useEffect(() => {
    console.log('list:', list);
    console.log('categoryIndex:', categoryIndex);
    if (categoryIndex >= list.length) {
      console.warn('categoryIndex is out of bounds.');
    }
  }, [list, categoryIndex]);

  useEffect(() => {
    // 確保 categoryIndex 在 list 範圍內
    if (categoryIndex >= 0 && categoryIndex < list.length) {
      // 這裡可以放置依賴於 list[categoryIndex] 的進一步邏輯
      console.log('Current category:::', list[categoryIndex]);
    } else {
      console.warn('categoryIndex out of bounds:', categoryIndex);
    }

    console.log('list.length:::', list.length);
  }, [categoryIndex, list]);

  return (
    <>
      <Box
        sx={{
          height: '100vh',
          p: 8,

          border: '1px solid #ccc',
          bgcolor: '#ccc',
          shadow:
            '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        }}
      >
        <Box
          sx={{
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
              // list={gridList}
              list={list[categoryIndex]?.stockList}
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
              {list?.[categoryIndex]?.stockList.map((item, index) => (
                <GridItem
                  key={item.stockSeq}
                  item={item}
                  index={index}
                  handleDelete={handleDelete}
                  handleSaveStockName={(index, newName) => {
                    console.log(
                      'GridItem handleSaveStockName:',
                      index,
                      newName,
                    );
                    handleSaveStockName(index, newName);
                  }}
                />
              ))}
            </ReactSortable>
          )}
        </Box>
      </Box>
    </>
  );
};

export default GridSortable;
