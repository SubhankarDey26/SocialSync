import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../Auth/hooks/useAuth";
import Sidebar from "../components/Sidebar";
import { createPost } from "../services/post.api";
import "../styles/create-post.scss";

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (!dropped) return;
    setFile(dropped);
    setPreview(URL.createObjectURL(dropped));
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a photo first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", caption);
      await createPost(formData);
      navigate("/");
    } catch {
      setError("Upload failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="app-shell">
      <Sidebar user={user} />

      <main className="create-main">
        <div className="create-card">
          {/* Header */}
          <div className="create-header">
            <p className="form-eyebrow">New Post</p>
            <h2 className="create-title">Share a moment</h2>
          </div>

          {/* Upload zone */}
          <div
            className={`upload-zone ${preview ? "has-preview" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {preview ? (
              <img src={preview} alt="preview" className="upload-preview" />
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
                <span className="upload-label">Upload Photo</span>
                <span className="upload-hint">Drag & drop or click to browse</span>
                <span className="upload-formats">JPG · PNG · WEBP · GIF</span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          {/* Change photo link shown after selection */}
          {preview && (
            <button
              className="reselect-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 2a5 5 0 100 10A5 5 0 0012 2zm0 8a3 3 0 110-6 3 3 0 010 6zm-7 11a7 7 0 0114 0H5z" />
              </svg>
              Change Photo
            </button>
          )}

          {/* Caption */}
          <div className="input-group">
            <label className="input-label">Caption</label>
            <textarea
              className="caption-textarea"
              placeholder="Write a caption…"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
            />
          </div>

          {/* Error */}
          {error && <p className="create-error">{error}</p>}

          {/* Submit */}
          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={loading || !file}
          >
            {loading ? (
              <>
                <span className="btn-spinner" />
                Uploading…
              </>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;