import { useNavigate } from "react-router";

const Sidebar = ({ user }) => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-dot" />
        <span className="brand-name">SS</span>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item" onClick={() => navigate("/")}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.084 5.22A9.003 9.003 0 0 1 21 12a9 9 0 0 1-18 0c0-.309.016-.614.047-.916L6.084 5.22zm1.44 2.163-.557 4.37a7 7 0 1 0 5.43-5.43l-4.874 1.06z" />
          </svg>
          <span>Feed</span>
        </button>

        <button className="nav-item active">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
          </svg>
          <span>Create</span>
        </button>

        <button className="nav-item">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.523 0 10 2.239 10 5v1H2v-1c0-2.761 4.477-5 10-5z" />
          </svg>
          <span>Profile</span>
        </button>
      </nav>

      {user && (
        <div className="sidebar-user">
          <img
            className="sidebar-avatar"
            src={user.ProfileImage || user.profileImage || "https://ik.imagekit.io/ag09ehtgk/default%20user.jpg"}
            alt={user.username}
          />
          <div className="sidebar-user-info">
            <span className="sidebar-username">{user.username}</span>
            <span className="sidebar-handle">@{user.username}</span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;