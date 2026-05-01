import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../Auth/hooks/useAuth";
import Sidebar from "../../Post/components/Sidebar";
import { updateProfile } from "../services/profile.api";
import "../styles/profile.scss";

const Profile = () => {
  const { user, setuser } = useAuth();
  const photoInputRef = useRef(null);

  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    password: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      username: user.username || "",
      email: user.email || "",
      bio: user.bio || "",
      password: "",
    });
    setPreview(user.ProfileImage || user.profileImage || null);
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("username", form.username);
      payload.append("email", form.email);
      payload.append("bio", form.bio);
      if (form.password) {
        payload.append("password", form.password);
      }
      if (selectedFile) {
        payload.append("profileImage", selectedFile);
      }

      const data = await updateProfile(payload);
      if (setuser) setuser(data.user);
      setForm((prev) => ({ ...prev, password: "" }));
      setSelectedFile(null);
      setMsg({ type: "success", text: "Profile updated successfully!" });
    } catch {
      setMsg({ type: "error", text: "Failed to update profile. Try again." });
    }
    setLoading(false);
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="app-shell">
      <Sidebar user={user} />

      <main className="profile-main">
        <div className="profile-card">
          {/* Profile image section */}
          <div className="profile-avatar-section">
            <div className="profile-avatar-ring">
              <img
                src={
                  preview ||
                  user?.ProfileImage ||
                  user?.profileImage ||
                  "https://ik.imagekit.io/ag09ehtgk/default%20user.jpg"
                }
                alt="Profile"
                className="profile-avatar-lg"
              />
            </div>
            <div className="profile-meta">
              <span className="profile-display-name">
                {user?.username || "Username"}
              </span>
              <span className="profile-email-small">
                {user?.email || ""}
              </span>
              <button
                type="button"
                className="change-photo-btn"
                onClick={() => photoInputRef.current?.click()}
              >
                Change Photo
              </button>
            </div>
          </div>

          {/* Form */}
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-grid">
              <div className="input-group">
                <label className="input-label">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="New password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Bio</label>
                <input
                  type="text"
                  name="bio"
                  placeholder="Tell us about yourself"
                  value={form.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Upload New Photo</label>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Your username"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            {msg && (
              <p className={`profile-msg ${msg.type}`}>{msg.text}</p>
            )}

            <button
              type="submit"
              className="update-btn"
              disabled={loading}
            >
              {loading ? "Updating…" : "Update Profile"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;