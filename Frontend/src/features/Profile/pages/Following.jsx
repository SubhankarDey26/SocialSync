import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/hooks/useAuth";
import Sidebar from "../../Post/components/Sidebar";
import { getFollowing } from "../services/user.api";
import "../styles/following.scss";

const Following = () => {
  const { user } = useAuth();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    try {
      const data = await getFollowing();
      setFollowing(data.following);
    } catch (error) {
      console.error("Failed to fetch following:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar user={user} />
        <main className="following-main">
          <div className="loading">Loading following...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar user={user} />
      <main className="following-main">
        <div className="following-card">
          <h2 className="following-title">Following ({following.length})</h2>

          {following.length === 0 ? (
            <div className="no-following">
              <p>Not following anyone yet</p>
            </div>
          ) : (
            <div className="following-list">
              {following.map((follow) => (
                <div key={follow._id} className="following-item">
                  <img
                    src={
                      follow.followee?.ProfileImage ||
                      "https://ik.imagekit.io/ag09ehtgk/default%20user.jpg"
                    }
                    alt={follow.followee?.username}
                    className="following-avatar"
                  />
                  <div className="following-info">
                    <span className="following-username">
                      {follow.followee?.username}
                    </span>
                    <span className="following-email">
                      {follow.followee?.email}
                    </span>
                    {follow.followee?.bio && (
                      <span className="following-bio">
                        {follow.followee.bio}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Following;