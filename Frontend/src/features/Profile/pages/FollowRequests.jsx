import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/hooks/useAuth";
import Sidebar from "../../Post/components/Sidebar";
import { getFollowRequests, acceptFollowRequest, rejectFollowRequest } from "../services/user.api";
import "../styles/follow-requests.scss";

const FollowRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getFollowRequests();
      setRequests(data.requests);
    } catch (error) {
      console.error("Failed to fetch follow requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    setActionLoading(requestId);
    try {
      await acceptFollowRequest(requestId);
      setRequests(requests.filter(req => req._id !== requestId));
    } catch (error) {
      console.error("Failed to accept request:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    setActionLoading(requestId);
    try {
      await rejectFollowRequest(requestId);
      setRequests(requests.filter(req => req._id !== requestId));
    } catch (error) {
      console.error("Failed to reject request:", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar user={user} />
        <main className="follow-requests-main">
          <div className="loading">Loading follow requests...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar user={user} />
      <main className="follow-requests-main">
        <div className="follow-requests-card">
          <h2 className="requests-title">Follow Requests</h2>

          {requests.length === 0 ? (
            <div className="no-requests">
              <p>No pending follow requests</p>
            </div>
          ) : (
            <div className="requests-list">
              {requests.map((request) => (
                <div key={request._id} className="request-item">
                  <div className="requester-info">
                    <img
                      src={
                        request.follower?.ProfileImage ||
                        "https://ik.imagekit.io/ag09ehtgk/default%20user.jpg"
                      }
                      alt={request.follower?.username}
                      className="requester-avatar"
                    />
                    <div className="requester-details">
                      <span className="requester-username">
                        {request.follower?.username}
                      </span>
                      <span className="requester-email">
                        {request.follower?.email}
                      </span>
                    </div>
                  </div>

                  <div className="request-actions">
                    <button
                      className="accept-btn"
                      onClick={() => handleAccept(request._id)}
                      disabled={actionLoading === request._id}
                    >
                      {actionLoading === request._id ? "Accepting..." : "Accept"}
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(request._id)}
                      disabled={actionLoading === request._id}
                    >
                      {actionLoading === request._id ? "Rejecting..." : "Reject"}
                    </button>
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

export default FollowRequests;