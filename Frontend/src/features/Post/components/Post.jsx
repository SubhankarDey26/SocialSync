import React from 'react'
import "../styles/feed.scss";
const Post = ({user,post}) => {
  return (
    <div className="feed">
      
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="profile-section">
          <img
            className="profile-img"
            src={user.ProfileImage}
            alt="profile"
          />

          <h3>{user.username}</h3>

          <div className="stats">
            <p>Followers: 120</p>
            <p>Following: 80</p>
          </div>
        </div>

        <div className="menu">
          <button>Profile</button>
          <button className="active">Feed</button>
          <button>Create Post</button>
          <button className="logout">Logout</button>
        </div>
      </div>

      {/* FEED */}
      <div className="feed-container">
        <h1 className="logo">SocialSync</h1>

        <div className="post-card">

          {/* HEADER */}
          <div className="post-header">
            <img
              className="user-avatar"
              src={user.ProfileImage}
              alt="user"
            />
            <span>Username</span>
          </div>

          {/* IMAGE */}
          <img
            className="post-image"
            src={post.imgUrl}
            alt="post"
          />

          {/* ACTIONS */}
          <div className="post-actions">
            <div className="left-actions">

              {/* LIKE */}
              <span className="icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z" />
                </svg>
              </span>

              {/* COMMENT */}
              <span className="icon">
                <svg viewBox="0 0 24 24">
                  <path d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3Z" />
                </svg>
              </span>

              {/* SHARE */}
              <span className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13 14H11C7.54202 14 4.53953 15.9502 3.03239 18.8107C3.01093 18.5433 3 18.2729 3 18C3 12.4772 7.47715 8 13 8V2.5L23.5 11L13 19.5V14ZM11 12H15V15.3078L20.3214 11L15 6.69224V10H13C10.5795 10 8.41011 11.0749 6.94312 12.7735C8.20873 12.2714 9.58041 12 11 12Z"></path></svg>
              </span>

            </div>

            {/* SAVE */}
            <span className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2ZM18 4H6V19.4324L12 15.6707L18 19.4324V4Z"></path></svg>
            </span>
          </div>

          {/* CAPTION */}
          <div className="caption">
            <b>Username</b>{post.caption}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Post