import { useState, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import './assets/styles/grid.css';

const GridAddItem = () => {
  return (
    <div className="grid-items card ignoreDrag">
      <div className="card-body d-flex justify-content-center align-items-center h3 m-0">
        +
      </div>
    </div>
  );
};

const GridItem = ({ user }) => {
  return (
    <div className="grid-items card shadow-sm rounded-3 overflow-hidden">
      <div className="card-body">
        <h3 className="h5 card-title m-0">{user.name}</h3>
      </div>

      <div className="card-footer d-flex justify-content-between">
        <span>{user.id}</span>
        <span className="btn btn-white border shadow-sm dragHandle">=</span>
      </div>
    </div>
  );
};

const GridSortable = () => {
  const [users, setUsers] = useState([]);

  // Fetching the data from typicode
  // and setting it to "users" state
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
      .then((res) => res.json())
      .then((data) =>
        setUsers((prev) => {
          return data.map((item) => ({
            id: item.id,
            name: item.title,
          }));
        }),
      );
  }, []);

  // Drag and Drop Handler
  const handleDragDropEnds = (oldIndex, newIndex) => {
    console.log('Drag and drop other tasks');
    console.log(oldIndex, newIndex);
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
          gap: '16px',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: '100%',
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
      {users.length === 0 ? (
        <GridAddItem />
      ) : (
        <ReactSortable
          list={users}
          setList={(newlist) => setUsers(newlist)}
          className="grid-container"
          ghostClass="dropArea"
          handle=".dragHandle"
          filter=".ignoreDrag"
          preventOnFilter={true}
          onEnd={({ oldIndex, newIndex }) =>
            handleDragDropEnds(oldIndex, newIndex)
          }
        >
          {users.map((user) => (
            <GridItem key={user.id} user={user} />
          ))}
          <GridAddItem />
        </ReactSortable>
      )}
    </Box>
  );
};

export default GridSortable;
