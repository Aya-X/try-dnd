import { useState, useEffect, FC } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactSortable } from 'react-sortablejs';
import GridSortable from './GridSortable';

interface ItemType {
  id: number;
  name: string;
}

import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import rawData from './assets/data/data.json';
import DragAndDropList from './DragAndDropList';

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

const DragItem = ({ item, provided, snapshot }) => {
  return (
    <Grid
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      item
      xs={2}
      sm={3}
      md={4}
      sx={{ height: '20%', cursor: 'grab' }}
    >
      <GridItem>{item?.stockId ? item?.stockName : '-'}</GridItem>
      {/* <span>{item.id}</span>
      <span>{item.content}</span> */}
      {/* <FormRow key={item.id} item={item} /> */}
    </Grid>
  );
};

const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

function NestedGrid() {
  const [data, setData] = useState<object[]>(() => rawData);
  const [placeholderProps, setPlaceholderProps] = useState({});

  const queryAttr = 'data-rbd-drag-handle-draggable-id';

  const getDraggedDom = (draggableId) => {
    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);

    return draggedDOM;
  };

  const handleDragStart = (event) => {
    const draggedDOM = getDraggedDom(event.draggableId);

    if (!draggedDOM) {
      return;
    }

    const { clientHeight, clientWidth } = draggedDOM;
    const sourceIndex = event.source.index;
    var clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      [...draggedDOM.parentNode.children]
        .slice(0, sourceIndex)
        .reduce((total, curr) => {
          const style = curr.currentStyle || window.getComputedStyle(curr);
          const marginBottom = parseFloat(style.marginBottom);
          return total + curr.clientHeight + marginBottom;
        }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(
        window.getComputedStyle(draggedDOM.parentNode).paddingLeft,
      ),
    });
  };

  const handleDragUpdate = (event) => {
    if (!event.destination) {
      return;
    }

    const draggedDOM = getDraggedDom(event.draggableId);

    if (!draggedDOM) {
      return;
    }

    const { clientHeight, clientWidth } = draggedDOM;
    const destinationIndex = event.destination.index;
    const sourceIndex = event.source.index;

    const childrenArray = [...draggedDOM.parentNode.children];
    const movedItem = childrenArray[sourceIndex];
    childrenArray.splice(sourceIndex, 1);

    const updatedArray = [
      ...childrenArray.slice(0, destinationIndex),
      movedItem,
      ...childrenArray.slice(destinationIndex + 1),
    ];

    var clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      updatedArray.slice(0, destinationIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr);
        const marginBottom = parseFloat(style.marginBottom);
        return total + curr.clientHeight + marginBottom;
      }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(
        window.getComputedStyle(draggedDOM.parentNode).paddingLeft,
      ),
    });
  };

  const handleDragEnd = (result) => {
    setPlaceholderProps({});

    const { source, destination } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // 複製 stockList 以避免直接修改狀態
    const newStockList = Array.from(data[0].stockList);
    // 重新排序 stockList
    const [reorderedItem] = newStockList.splice(source.index, 1);
    newStockList.splice(destination.index, 0, reorderedItem);

    // 更新 state
    const newData = [...data];
    newData[0].stockList = newStockList;
    setData(newData);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 8,
        height: '80%',
        alignItems: 'stretch',
      }}
    >
      <DragDropContext
        onDragStart={handleDragStart}
        onDragUpdate={handleDragUpdate}
        onDragEnd={handleDragEnd}
      >
        <StrictModeDroppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Grid
                container
                spacing={1}
                // direction="column"
                columns={{ xs: 3, sm: 9, md: 12 }}
                justifyContent={'center'}
                sx={{ height: '100%' }}
              >
                {data?.[0].stockList.map((item, index) => (
                  <Draggable
                    // key 是唯一
                    key={`item-${index}`}
                    // draggableId 是唯一且非空
                    draggableId={`item-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <DragItem
                        provided={provided}
                        snapshot={snapshot}
                        item={item}
                      />
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
                <div
                  style={{
                    position: 'absolute',
                    top: placeholderProps.clientY,
                    left: placeholderProps.clientX,
                    height: placeholderProps.clientHeight,
                    background: 'tomato',
                    width: placeholderProps.clientWidth,
                  }}
                />
              </Grid>
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>

      {/* {data?.[0].stockList.map((item, index) => (
          <FormRow key={index} item={item} />
        ))} */}

      {/* {Array.from(Array(15)).map((_, index) => (
          <FormRow key={index} />
        ))} */}
    </Box>
  );
}

const BasicFunction: FC = (props) => {
  const [state, setState] = useState<ItemType[]>([
    { id: 1, name: 'shrek' },
    { id: 2, name: 'fiona' },
  ]);

  return (
    <ReactSortable list={state} setList={setState}>
      {state.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  );
};

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <CssBaseline />

      <Container maxWidth="xl">
        {/* <DragAndDropList /> */}
        <GridSortable />
        <BasicFunction />

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

          <NestedGrid />
        </Box>
      </Container>
    </>
  );
}

export default App;
