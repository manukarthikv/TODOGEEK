// src/App.js
import React, { useState } from 'react';
import {
  Container, Box, Typography, Button, Modal, TextField,
  IconButton, Select, MenuItem, Paper, Checkbox, Snackbar, Alert
} from '@mui/material';
import { Close, Delete, Edit } from '@mui/icons-material';

const motivationalMessages = [
  "You're on fire! 🔥 Keep it up!",
  "One task at a time! ",
  "Small steps lead to big results! "
];

const App = () => {
  const [todos, setTodos] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('incomplete');
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  const handleAddOrUpdateTask = () => {
    if (title.trim() === '') return;

    const taskData = {
      id: editId ? editId : Date.now(),
      title,
      status,
      timestamp: new Date().toLocaleString(),
    };

    if (editId) {
      const noChanges = todos.some(
        (task) => task.id === editId && task.title === title && task.status === status
      );

      if (noChanges) {
        setSnackbarMessage('No changes made ❌');
        setSnackbarOpen(true);
      } else {
        setTodos(todos.map((task) => (task.id === editId ? taskData : task)));
        setSnackbarMessage('Task updated successfully!');
        setSnackbarOpen(true);
        setOpen(false);
      }
    } else {
      setTodos([...todos, taskData]);
      setSnackbarMessage('Task added successfully!');
      setSnackbarOpen(true);
      setOpen(false);
    }

    resetForm();
  };

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setStatus('incomplete');
  };

  const handleEdit = (todo) => {
    setTitle(todo.title);
    setStatus(todo.status);
    setEditId(todo.id);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((task) => task.id !== id));
    setSnackbarMessage('Task deleted successfully!');
    setSnackbarOpen(true);
  };

  const handleCompleteTask = (id) => {
    setTodos(todos.map((task) =>
      task.id === id ? { ...task, status: task.status === 'complete' ? 'incomplete' : 'complete' } : task
    ));
    const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const filteredTodos = todos.filter((task) => {
    if (filter === 'completed') return task.status === 'complete';
    if (filter === 'incomplete') return task.status === 'incomplete';
    return true;
  });

  return (
    <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center' }}>
      {/* Header */}
      <Typography variant="h4" sx={{ fontWeight: '900', color: '#5A9BD5', mb: 4, fontSize: '2.5rem', textDecoration: 'none' }}>
  TODO LIST
</Typography>


      {/* Add Task and Filter Dropdown (Aligned) */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Button
  variant="contained"
  size="small"
  onClick={() => setOpen(true)}
  sx={{
    width: '180px',
    backgroundColor: '#5A9BD5', // Slate Blue
    transition: 'background-color 0.3s',
    '&:hover': { backgroundColor: '#4682B4' }, // Darker on hover
    color: 'white', // Text color for "Add Task"
    fontWeight: 'bold', // Make the text bold
  }}
>
  Add Task <span style={{ color: 'white', fontWeight: 'bold' }}>➕</span> {/* White "+" */}
</Button>


<Select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  size="small"
  sx={{
    width: '180px',
    backgroundColor: '#5A9BD5', // Light Steel Blue for the dropdown
    transition: 'background-color 0.3s',
    '&:hover': { backgroundColor: '#4682B4' }, // Steel Blue on hover
    color: 'white', // Text color for the dropdown
    '& .MuiSelect-select': { // Styles for the select element
      backgroundColor: '#5A9BD5', // Light Steel Blue
      color: 'white', // White text
    },
    '& .MuiOutlinedInput-notchedOutline': { // Styles for the outline
      borderColor: '#5A9BD5', // Match the dropdown color
    },
    '&:focus .MuiOutlinedInput-notchedOutline': { // Focus outline color
      borderColor: '#4682B4', // Steel Blue on focus
    },
    '&:before, &:after': { // Remove underline
      display: 'none',
    },
  }}
>
  <MenuItem value="all">All Tasks 🗂️</MenuItem>
  <MenuItem value="incomplete">Incomplete ✏️</MenuItem>
  <MenuItem value="completed">Completed ✅</MenuItem>
</Select>
      </Box>

      {/* Todo List or No Tasks Message */}
      <Box sx={{ mt: 2 }}>
        {filteredTodos.length ? (
          filteredTodos.map((task) => (
            <Paper
              key={task.id}
              elevation={3}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                mt: 2,
                backgroundColor: '#e0e0e0',
                borderRadius: '12px',
                transition: 'all 0.3s',
                '&:hover': { backgroundColor: '#d6d6d6' },
                border: '2px blue', // Make the task list thicker and blue
              }}
            >
              <Checkbox
                checked={task.status === 'complete'}
                onChange={() => handleCompleteTask(task.id)}
              />
              <Typography
                variant="body1"
                sx={{ textDecoration: task.status === 'complete' ? 'line-through' : 'none', mx: 2 }}
              >
                {task.title} <small>({task.timestamp})</small>
              </Typography>
              <Box>
                <IconButton onClick={() => handleEdit(task)}><Edit /></IconButton>
                <IconButton onClick={() => handleDelete(task.id)} color="error"><Delete /></IconButton>
              </Box>
            </Paper>
          ))
        ) : (
          <Paper
            sx={{
              mt: 4,
              p: 3,
              borderRadius: '12px',
              backgroundColor: 'white',
              width: '100%',
              transition: 'all 0.3s',
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No tasks available.
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Add/Update Task Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            p: 4,
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: 24,
            transition: 'all 0.3s',
            '&:hover': { boxShadow: '0 8px 16px rgba(0,0,0,0.2)' },
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editId ? 'Update Task' : 'Add Task'}
          </Typography>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Select
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="incomplete">Incomplete</MenuItem>
            <MenuItem value="complete">Complete</MenuItem>
          </Select>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={handleAddOrUpdateTask}>
              {editId ? 'Update' : 'Add'}
            </Button>
            <Button variant="outlined" color="error" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for Notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity={snackbarMessage === 'No changes made ❌' ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Motivational Alert */}
      <Snackbar open={alertOpen} autoHideDuration={4000} onClose={() => setAlertOpen(false)}>
        <Alert severity="info">
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
