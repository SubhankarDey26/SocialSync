import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/hooks/useAuth";
import Sidebar from "../../Post/components/Sidebar";
import { getFollowers } from "../services/user.api";
import "../styles/followers.scss";

const Followers = () => {
  const { user } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowers();
  }, []);

  const fetchFollowers = async () => {
    try {
      const data = await getFollowers();
      setFollowers(data.followers);
    } catch (error) {
      console.error("Failed to fetch followers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar user={user} />
        <main className="followers-main">
          <div className="loading">Loading followers...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar user={user} />
      <main className="followers-main">
        <div className="followers-card">
          <h2 className="followers-title">Followers ({followers.length})</h2>

          {followers.length === 0 ? (
            <div className="no-followers">
              <p>No followers yet</p>
            </div>
          ) : (
            <div className="followers-list">
              {followers.map((follow) => (
                <div key={follow._id} className="follower-item">
                  <img
                    src={
                      follow.follower?.ProfileImage ||
                      "https://ik.imagekit.io/ag09ehtgk/default%20user.jpg"
                    }
                    alt={follow.follower?.username}
                    className="follower-avatar"
                  />
                  <div className="follower-info">
                    <span className="follower-username">
                      {follow.follower?.username}
                    </span>
                    <span className="follower-email">
                      {follow.follower?.email}
                    </span>
                    {follow.follower?.bio && (
                      <span className="follower-bio">
                        {follow.follower.bio}
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

export default Followers;