import { useEffect } from "react";
import { usePost } from "../hooks/usePost";
import { useAuth } from "../../Auth/hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import "../styles/feed.scss";

const Feed = () => {
  const { feed, handleGetFeed, loading } = usePost();
  const { user } = useAuth();

  useEffect(() => {
    handleGetFeed();
  }, []);

  return (
    <div className="app-shell">
      <Sidebar user={user} />

      <main className="feed-main">
        <div className="feed-header">
          <h1 className="feed-logo">SocialSync</h1>
          <p className="feed-tagline">Your world, your stories</p>
        </div>

        <div className="feed-stream">
          {loading || !feed ? (
            <div className="feed-loading">
              <div className="spinner" />
              <span>Loading your feed…</span>
            </div>
          ) : feed.length === 0 ? (
            <div className="feed-empty">
              <span>No posts yet. Follow some people!</span>
            </div>
          ) : (
            feed.map((post) => (
              <Post key={post._id} post={post} user={post.user} onLike={handleGetFeed} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Feed;