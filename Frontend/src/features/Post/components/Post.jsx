// import { useState } from "react";
// import { likePost } from "../services/post.api";
// import { followUser } from "../../Profile/services/user.api";

// const Post = ({ post, user, onLike }) => {
//   const [liked, setLiked] = useState(post.isLiked || false);
//   const [saved, setSaved] = useState(false);
//   const [likeCount, setLikeCount] = useState(post.likeCount || 0);

//   const handleLike = async () => {
//     try {
//       await likePost(post._id);
//       if (onLike) {
//         onLike();
//       }
//     } catch (error) {
//       console.error("Error liking post:", error);
//     }
//   };

// const handleFollow = async () => {
//   try {
//     await followUser(user.username);
//     alert("Followed successfully");
//   } catch (err) {
//     console.log(err);
//   }
// };

//   const avatarSrc =
//     user?.ProfileImage ||
//     user?.profileImage ||
//     "https://ik.imagekit.io/ag09ehtgk/default%20user.jpg";

//   const username = user?.username || "unknown";

//   return (
//     <article className="post-card">
//       {/* Header */}
//       <div className="post-head">
//         <div className="post-user">
//           <div className="avatar-ring">
//             <img src={avatarSrc} alt={username} className="post-avatar" />
//           </div>
//           <div className="post-user-meta">
//             <span className="post-username">{username}</span>
//             <span className="post-time">Just now</span>
//           </div>
//         </div>
//         <button className="post-more">
//           <svg viewBox="0 0 24 24" fill="currentColor">
//             <circle cx="5" cy="12" r="2" />
//             <circle cx="12" cy="12" r="2" />
//             <circle cx="19" cy="12" r="2" />
//           </svg>
//         </button>
//       </div>

//       {/* Image */}
//       <div className="post-img-wrap">
//         <img src={post.imgUrl} alt="post" className="post-img" />
//       </div>

//       {/* Actions */}
//       <div className="post-body">
//         <div className="post-actions">
//           <div className="actions-left">
//             <button
//               className={`action-btn like-btn ${liked ? "liked" : ""}`}
//               onClick={handleLike}
//             >
//               <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
//                 <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z" />
//               </svg>
//             </button>

//             <button className="action-btn">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3Z" />
//               </svg>
//             </button>

//             <button className="action-btn">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M13 14H11C7.54202 14 4.53953 15.9502 3.03239 18.8107C3.01093 18.5433 3 18.2729 3 18C3 12.4772 7.47715 8 13 8V2.5L23.5 11L13 19.5V14Z" />
//               </svg>
//             </button>
//           </div>

//           <button
//             className={`action-btn save-btn ${saved ? "saved" : ""}`}
//             onClick={() => setSaved((p) => !p)}
//           >
//             <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
//               <path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2Z" />
//             </svg>
//           </button>
//         </div>

//         <div className="post-likes">{likeCount.toLocaleString()} likes</div>

//         {post.caption && (
//           <p className="post-caption">
//             <span className="caption-user">{username}</span> {post.caption}
//           </p>
//         )}
//       </div>
//     </article>
//   );
// };

// export default Post;







import { useState, useEffect } from "react";
import { likePost } from "../services/post.api";
import { followUser } from "../../Profile/services/user.api";
import { useAuth } from "../../Auth/hooks/useAuth";

const Post = ({ post, user, onLike }) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [following, setFollowing] = useState(false);

  // Sync state when feed reloads
  useEffect(() => {
    setLiked(post.isLiked || false);
    setLikeCount(post.likeCount || 0);
  }, [post]);

  // ================= LIKE =================
  const handleLike = async () => {
    try {
      await likePost(post._id);

      // Optimistic UI update 🔥
      if (liked) {
        setLikeCount(prev => prev - 1);
      } else {
        setLikeCount(prev => prev + 1);
      }

      setLiked(!liked);

      if (onLike) onLike();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // ================= FOLLOW =================
  const handleFollow = async () => {
    try {
      await followUser(user.username);
      setFollowing(true);
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  const avatarSrc =
    user?.ProfileImage ||
    user?.profileImage ||
    "https://ik.imagekit.io/ag09ehtgk/default%20user.jpg";

  const username = user?.username || "unknown";

  return (
    <article className="post-card">
      {/* ================= HEADER ================= */}
      <div className="post-head">
        <div className="post-user">
          <div className="avatar-ring">
            <img src={avatarSrc} alt={username} className="post-avatar" />
          </div>

          <div className="post-user-meta">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="post-username">{username}</span>

              {/* FOLLOW BUTTON */}
              <button
                onClick={handleFollow}
                disabled={following}
                style={{
                  padding: "4px 8px",
                  background: following ? "#555" : "#f97316",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: following ? "not-allowed" : "pointer",
                  fontSize: "12px"
                }}
              >
                {following ? "Following" : "Follow"}
              </button>
            </div>

            <span className="post-time">Just now</span>
          </div>
        </div>

        <button className="post-more">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      </div>

      {/* ================= IMAGE ================= */}
      <div className="post-img-wrap">
        <img src={post.imgUrl} alt="post" className="post-img" />
      </div>

      {/* ================= BODY ================= */}
      <div className="post-body">
        <div className="post-actions">
          <div className="actions-left">
            {/* LIKE BUTTON */}
            <button
              className={`action-btn like-btn ${liked ? "liked" : ""}`}
              onClick={handleLike}
            >
              <svg
                viewBox="0 0 24 24"
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z" />
              </svg>
            </button>

            {/* COMMENT */}
            <button className="action-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3Z" />
              </svg>
            </button>

            {/* SHARE */}
            <button className="action-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 14H11C7.54202 14 4.53953 15.9502 3.03239 18.8107C3.01093 18.5433 3 18.2729 3 18C3 12.4772 7.47715 8 13 8V2.5L23.5 11L13 19.5V14Z" />
              </svg>
            </button>
          </div>

          {/* SAVE */}
          <button
            className={`action-btn save-btn ${saved ? "saved" : ""}`}
            onClick={() => setSaved(prev => !prev)}
          >
            <svg
              viewBox="0 0 24 24"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2Z" />
            </svg>
          </button>
        </div>

        {/* LIKE COUNT */}
        <div className="post-likes">{likeCount.toLocaleString()} likes</div>

        {/* CAPTION */}
        {post.caption && (
          <p className="post-caption">
            <span className="caption-user">{username}</span> {post.caption}
          </p>
        )}
      </div>
    </article>
  );
};

export default Post;