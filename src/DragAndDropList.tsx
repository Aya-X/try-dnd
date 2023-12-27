import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const elements = [
  { id: 'one', content: 'one' },
  { id: 'two', content: 'two' },
  { id: 'three', content: 'three' },
  { id: 'four', content: 'four' },
];

const DragItem = ({ item, provided, snapshot }) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{
        padding: 8,
        cursor: 'grab',
        margin: '0 0 8px 0',
        backgroundColor: snapshot.isDragging ? 'lightgreen' : 'grey',
        ...provided.draggableProps.style,
      }}
    >
      <span>{item.id}</span>
      <span>{item.content}</span>
    </div>
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

function DragAndDropList() {
  const [items, setItems] = useState(elements);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const newItems = Array.from(items);
    const [removed] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, removed);
    setItems(newItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="droppable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
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
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}

export default DragAndDropList;
