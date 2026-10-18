import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

const STATUSES = ["pending", "in-progress", "completed"];
const PAGE_SIZE = 5;

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, active: 0, done: 0 });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks", {
        params: {
          page,
          limit: PAGE_SIZE,
          status: statusFilter || undefined,
          search: search || undefined,
          sortBy,
          order,
        },
      });
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages || 1);
      loadStats();

      if (res.data.tasks.length === 0 && page > 1) {
        setPage(page - 1);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        setError("Could not load tasks");
      }
    }
  };

  const loadStats = async () => {
  try {
    const res = await api.get("/tasks/stats");
    setStats(res.data);
  } catch (err) {
    // ignore, the pills will just show old numbers
  }
};

  useEffect(() => {
    loadTasks();
  }, [page, statusFilter, search, sortBy, order]);

  const addTask = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) return;
    try {
      await api.post("/tasks", { title });
      setTitle("");
      loadTasks();
    } catch (err) {
      setError(errorMessage(err, "Could not add task"));
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      loadTasks();
    } catch (err) {
      setError(errorMessage(err, "Could not update task"));
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      loadTasks();
    } catch (err) {
      setError(errorMessage(err, "Could not delete task"));
    }
  };

  return (
    <div className="tasks-page">
      <header className="tasks-header">
  <div className="title-row">
    <span>🍓</span>
    <h1>To-Do list</h1>
    <span>🌸</span>
  </div>
  <p className="subtitle">stay productive ✨</p>
  <div className="user-box">
    <span>Hi {user.name}</span>
    <button className="small-btn" onClick={logout}>
      Log out
    </button>
  </div>
</header>

<div className="stats-bar">
  <div className="stat-pill">
    <span className="stat-num">{stats.total}</span>
    <span className="stat-label">Total</span>
  </div>
  <div className="stat-pill active-pill">
    <span className="stat-num">{stats.active}</span>
    <span className="stat-label">Active</span>
  </div>
  <div className="stat-pill done-pill">
    <span className="stat-num">{stats.done}</span>
    <span className="stat-label">Done</span>
  </div>
</div>

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

<div className="filter-tabs">
  {[
    ["", "All"],
    ["pending", "Pending"],
    ["in-progress", "In progress"],
    ["completed", "Completed"],
  ].map(([value, label]) => (
    <button
      key={label}
      className={`tab ${statusFilter === value ? "active" : ""}`}
      onClick={() => {
        setStatusFilter(value);
        setPage(1);
      }}
    >
      {label}
    </button>
  ))}
</div>

      <div className="filter-row">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        
        <select
          value={`${sortBy}:${order}`}
          onChange={(e) => {
            const [by, ord] = e.target.value.split(":");
            setSortBy(by);
            setOrder(ord);
            setPage(1);
          }}
        >
          <option value="createdAt:desc">Newest first</option>
          <option value="createdAt:asc">Oldest first</option>
          <option value="title:asc">Title A to Z</option>
          <option value="title:desc">Title Z to A</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      {tasks.length === 0 ? (
        <div className="empty-state">
        <div className="empty-mascot">🍓</div>
        <p className="empty-title">No tasks yet!</p>
        <p className="empty-sub">Add something fresh to do ☁️</p>
       </div>
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

      <div className="pagination">
        <button
          className="small-btn"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="small-btn"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}