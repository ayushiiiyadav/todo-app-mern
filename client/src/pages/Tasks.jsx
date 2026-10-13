import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

const STATUSES = ["pending", "in-progress", "completed"];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.tasks ?? res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        setError("Could not load tasks");
      }
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) return;
    try {
      await api.post("/tasks", { title });
      setTitle("");
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add task");
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete task");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <h1>To-Do list 🍓</h1>
        <div>
          <span>Hi {user.name}</span>
          <button className="small-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <form className="add-row" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={title}
          maxLength={80}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      {tasks.length === 0 ? (
        <p className="empty">No tasks yet. Add something fresh to do ☁️</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <span className={task.status === "completed" ? "done" : ""}>
                {task.title}
              </span>
              <div className="task-actions">
                <select
                  value={task.status}
                  onChange={(e) => changeStatus(task._id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  className="small-btn danger"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}