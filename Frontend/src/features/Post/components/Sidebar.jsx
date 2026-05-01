import { useNavigate, useLocation } from "react-router";

const Sidebar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const handleLogout = () => {
    // TODO: Add backend logout / token blacklisting logic here
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* Top Avatar */}
      <div className="sidebar-avatar-wrap" onClick={() => navigate("/profile")}>
        <div className="sidebar-avatar-ring">
          <img
            className="sidebar-avatar-img"
            src={
              user?.ProfileImage ||
              user?.profileImage ||
              "https://ik.imagekit.io/ag09ehtgk/default%20user.jpg"
            }
            alt={user?.username || "user"}
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${currentPath === "/followers" ? "active" : ""}`}
          onClick={() => navigate("/followers")}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H16C16 18.6863 13.3137 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM10 11C12.21 11 14 9.21 14 7C14 4.79 12.21 3 10 3C7.79 3 6 4.79 6 7C6 9.21 7.79 11 10 11ZM18.2837 14.7028C21.0644 15.9561 23 18.752 23 22H21C21 19.564 19.5483 17.4671 17.4628 16.4789L18.2837 14.7028ZM17.5962 3.41321C19.5944 4.23703 21 6.20993 21 8.5C21 11.3702 18.8042 13.7252 16 13.9776V11.9646C17.6967 11.7222 19 10.264 19 8.5C19 7.11935 18.2016 5.92603 17.041 5.35635L17.5962 3.41321Z" />
          </svg>
          <span>Followers</span>
        </button>

        <button
          className={`nav-item ${currentPath === "/following" ? "active" : ""}`}
          onClick={() => navigate("/following")}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 14.252V22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM18 17V14H20V17H23V19H20V22H18V19H15V17H18Z" />
          </svg>
          <span>Following</span>
        </button>

        <button
          className={`nav-item ${currentPath === "/" ? "active" : ""}`}
          onClick={() => navigate("/")}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.084 5.22A9.003 9.003 0 0 1 21 12a9 9 0 0 1-18 0c0-.309.016-.614.047-.916L6.084 5.22zm1.44 2.163-.557 4.37a7 7 0 1 0 5.43-5.43l-4.874 1.06z" />
          </svg>
          <span>Feed</span>
        </button>

        <button
          className={`nav-item ${currentPath === "/create-post" ? "active" : ""}`}
          onClick={() => navigate("/create-post")}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
          </svg>
          <span>Create Post</span>
        </button>

        <button
          className={`nav-item ${currentPath === "/profile" ? "active" : ""}`}
          onClick={() => navigate("/profile")}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.523 0 10 2.239 10 5v1H2v-1c0-2.761 4.477-5 10-5z" />
          </svg>
          <span>Profile</span>
        </button>

        <button
          className={`nav-item ${currentPath === "/follow-requests" ? "active" : ""}`}
          onClick={() => navigate("/follow-requests")}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 17v2H2v-2s0-4 7-4 7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11.5 3.5 3.5 0 0 0 12.5 8m3.5 6.04A5.468 5.468 0 0 1 22 17v2h4v-2s0-3.63-6.67-4.04M9 13c-7 0-7 4-7 4v2h7v-2s0-4-7-4m4.5-9A3.5 3.5 0 1 0 5 7.5 3.5 3.5 0 0 0 8.5 4z" />
          </svg>
          <span>Follow Requests</span>
        </button>

        <button className="nav-item logout-item" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </nav>

      {/* Bottom user info */}
      {user && (
        <div className="sidebar-user">
          <img
            className="sidebar-avatar"
            src={
              user.ProfileImage ||
              user.profileImage ||
              "https://ik.imagekit.io/ag09ehtgk/default%20user.jpg"
            }
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