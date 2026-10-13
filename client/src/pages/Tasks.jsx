import { useNavigate } from "react-router-dom";

export default function Tasks() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Hi {user.name} 🍓</h1>
        <p>You're logged in. Your tasks will go here.</p>
        <button onClick={logout}>Log out</button>
      </div>
    </div>
  );
}