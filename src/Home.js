import { useState, useEffect } from 'react';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const username = localStorage.getItem('username');  // check if user is logged in
  const token = localStorage.getItem('token');


  useEffect(() => {
    if (username) {
      fetchTasks();
    }
  }, [username]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://mahmoudd123.pythonanywhere.com/api/tasks/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        }
      });
      const data = await res.json();
      console.log('Fetched tasks:', data);
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);  // fallback
        console.error('Tasks API did not return an array:', data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]); // fallback
    }
  };

  

  const addTask = async () => {
    if (!username) {
      alert('You must be signed in to add a task!');
      return;
    }
    if (!title.trim()) return;

    try {
      const res = await fetch('https://mahmoudd123.pythonanywhere.com/api/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ title, description })
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        fetchTasks();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTaskDetails = (taskId) => {
    setActiveTaskId(prev => (prev === taskId ? null : taskId));
  };

  const toggleComplete = async (task) => {
    try {
      await fetch(`https://mahmoudd123.pythonanywhere.com/api/tasks/${task.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          is_completed: !task.is_completed
        })
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`https://mahmoudd123.pythonanywhere.com/api/tasks/${taskId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        }
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEdit = (task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = async (taskId) => {
    try {
      await fetch(`https://mahmoudd123.pythonanywhere.com/api/tasks/${taskId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          is_completed: tasks.find(t => t.id === taskId)?.is_completed
        })
      });
      setEditTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  return (
    <div className="home">
      <h1>Welcome to the To-Do List App</h1>

      <input
        type="text"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={!username}
      />
      <input
        type="text"
        placeholder="Enter task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={!username}
      />
      <button onClick={addTask} disabled={!username}>Add Task</button>

      <div className="task-list">
        <h2>Your Tasks</h2>
        {!username ? (
          <p>Please sign in to see your tasks.</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <ul>
            {tasks.map(task => (
                <li key={task.id} className="task-item">
                  <div className="task-header">
                    <div className="task-header-left">
                      <input
                        type="checkbox"
                        checked={task.is_completed}
                        onChange={() => toggleComplete(task)}
                      />
                      {editTaskId === task.id ? (
                        <>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Edit description"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                          />
                        </>
                      ) : (
                        <strong
                          className={task.is_completed ? 'completed' : ''}
                          onClick={() => toggleTaskDetails(task.id)}
                        >
                          {task.title}
                        </strong>
                      )}
                    </div>
                    <div className="task-header-right">
                      {editTaskId === task.id ? (
                        <button onClick={() => saveEdit(task.id)}>💾</button>
                      ) : (
                        <>
                          <button onClick={() => startEdit(task)}>✏️</button>
                          <button onClick={() => deleteTask(task.id)}>🗑</button>
                        </>
                      )}
                    </div>
                  </div>
                  {activeTaskId === task.id && (
                    <div className="task-details">
                      <p><strong>Description:</strong> {task.description || 'No description'}</p>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
