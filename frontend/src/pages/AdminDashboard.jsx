import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [lostFound, setLostFound] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
      return;
    }

    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        usersResponse,
        announcementsResponse,
        eventsResponse,
        complaintsResponse,
        lostFoundResponse,
      ] = await Promise.all([
        API.get("/auth/users"),
        API.get("/announcements"),
        API.get("/events"),
        API.get("/complaints"),
        API.get("/lost-found"),
      ]);

      setUsers(usersResponse.data);
      setAnnouncements(announcementsResponse.data);
      setEvents(eventsResponse.data);
      setComplaints(complaintsResponse.data);
      setLostFound(lostFoundResponse.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // UPDATE COMPLAINT STATUS
  const updateComplaintStatus = async (complaintId, status) => {
    try {
      await API.put(`/complaints/${complaintId}/status`, {
        status,
      });

      setComplaints((current) =>
        current.map((complaint) =>
          complaint._id === complaintId
            ? { ...complaint, status }
            : complaint
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update complaint status."
      );
    }
  };

  // DELETE COMPLAINT
  const deleteComplaint = async (complaintId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/complaints/${complaintId}`);

      setComplaints((current) =>
        current.filter(
          (complaint) => complaint._id !== complaintId
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete complaint."
      );
    }
  };

  // DELETE ANNOUNCEMENT
  const deleteAnnouncement = async (announcementId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/announcements/${announcementId}`);

      setAnnouncements((current) =>
        current.filter(
          (announcement) =>
            announcement._id !== announcementId
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete announcement."
      );
    }
  };

  // DELETE EVENT
  const deleteEvent = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/events/${eventId}`);

      setEvents((current) =>
        current.filter((event) => event._id !== eventId)
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete event."
      );
    }
  };

  // DELETE LOST & FOUND POST
  const deleteLostFound = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Lost & Found report?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/lost-found/${postId}`);

      setLostFound((current) =>
        current.filter((post) => post._id !== postId)
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete Lost & Found report."
      );
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="loading-state">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo">UniGo Admin</div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="admin-container">

        {/* HEADER */}
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Welcome back, {currentUser?.name || "Admin"}.
            </p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* STATISTICS */}
        <div className="admin-stats">

          <div className="admin-stat-card">
            <span>👥</span>
            <h2>{users.length}</h2>
            <p>Total Users</p>
          </div>

          <div className="admin-stat-card">
            <span>📢</span>
            <h2>{announcements.length}</h2>
            <p>Announcements</p>
          </div>

          <div className="admin-stat-card">
            <span>📅</span>
            <h2>{events.length}</h2>
            <p>Events</p>
          </div>

          <div className="admin-stat-card">
            <span>📝</span>
            <h2>{complaints.length}</h2>
            <p>Complaints</p>
          </div>

          <div className="admin-stat-card">
            <span>📦</span>
            <h2>{lostFound.length}</h2>
            <p>Lost & Found</p>
          </div>

        </div>

        {/* QUICK ACTIONS */}
        <section className="admin-section">

          <h2>Quick Actions</h2>

          <div className="admin-actions">

            <button
              onClick={() =>
                navigate("/announcements")
              }
            >
              Manage Announcements
            </button>

            <button
              onClick={() => navigate("/events")}
            >
              Manage Events
            </button>

            <button
              onClick={() =>
                navigate("/lost-found")
              }
            >
              Manage Lost & Found
            </button>

            <button
              onClick={() => navigate("/complaints")}
            >
              Manage Complaints
            </button>

            <button
              onClick={() =>
                navigate("/community")
              }
            >
              View Community
            </button>

          </div>

        </section>

        {/* ANNOUNCEMENTS */}
        <section className="admin-section">

          <h2>Announcement Management</h2>

          {announcements.length === 0 ? (
            <div className="empty-state">
              No announcements found.
            </div>
          ) : (
            <div className="admin-list">

              {announcements.map((announcement) => (

                <div
                  className="admin-list-card"
                  key={announcement._id}
                >

                  <div>
                    <h3>{announcement.title}</h3>

                    <p>{announcement.content}</p>

                    <small>
                      Category:{" "}
                      {announcement.category ||
                        "General"}
                    </small>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteAnnouncement(
                        announcement._id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>
          )}

        </section>

        {/* EVENTS */}
        <section className="admin-section">

          <h2>Event Management</h2>

          {events.length === 0 ? (
            <div className="empty-state">
              No events found.
            </div>
          ) : (
            <div className="admin-list">

              {events.map((event) => (

                <div
                  className="admin-list-card"
                  key={event._id}
                >

                  <div>
                    <h3>{event.title}</h3>

                    <p>{event.description}</p>

                    <small>
                      📅{" "}
                      {event.date
                        ? new Date(
                            event.date
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "Date not available"}
                    </small>

                    <br />

                    <small>
                      📍 {event.location}
                    </small>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteEvent(event._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>
          )}

        </section>

        {/* COMPLAINT MANAGEMENT */}
        <section className="admin-section">

          <h2>Complaint Management</h2>

          {complaints.length === 0 ? (
            <div className="empty-state">
              No complaints found.
            </div>
          ) : (
            <div className="admin-list">

              {complaints.map((complaint) => (

                <div
                  className="admin-list-card"
                  key={complaint._id}
                >

                  <div>
                    <h3>{complaint.title}</h3>

                    <p>
                      {complaint.description}
                    </p>

                    <small>
                      Category:{" "}
                      {complaint.category ||
                        "General"}
                    </small>
                  </div>

                  <div className="complaint-controls">

                    <span>Status:</span>

                    <select
                      value={
                        complaint.status ||
                        "pending"
                      }
                      onChange={(e) =>
                        updateComplaintStatus(
                          complaint._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="pending">
                        Pending
                      </option>

                      <option value="in-progress">
                        In Progress
                      </option>

                      <option value="resolved">
                        Resolved
                      </option>
                    </select>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteComplaint(
                          complaint._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

        {/* LOST & FOUND MANAGEMENT */}
        <section className="admin-section">

          <h2>Lost & Found Management</h2>

          {lostFound.length === 0 ? (
            <div className="empty-state">
              No Lost & Found reports found.
            </div>
          ) : (
            <div className="admin-list">

              {lostFound.map((post) => (

                <div
                  className="admin-list-card"
                  key={post._id}
                >

                  <div>

                    <h3>
                      {post.title}
                    </h3>

                    <p>
                      {post.description}
                    </p>

                    <small>
                      Type:{" "}
                      {post.type === "lost"
                        ? "Lost"
                        : "Found"}
                    </small>

                    <br />

                    <small>
                      📍 {post.location}
                    </small>

                    <br />

                    <small>
                      📅{" "}
                      {post.date
                        ? new Date(
                            post.date
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "Date not available"}
                    </small>

                    <br />

                    <small>
                      Contact:{" "}
                      {post.contactInfo}
                    </small>

                    {post.postedBy && (
                      <>
                        <br />

                        <small>
                          Posted by:{" "}
                          {post.postedBy.name ||
                            post.postedBy.email ||
                            "Student"}
                        </small>
                      </>
                    )}

                  </div>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteLostFound(post._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>
          )}

        </section>

        {/* REGISTERED USERS */}
        <section className="admin-section">

          <h2>Registered Users</h2>

          {users.length === 0 ? (
            <div className="empty-state">
              No users found.
            </div>
          ) : (
            <div className="admin-list">

              {users.slice(0, 10).map((user) => (

                <div
                  className="admin-list-card"
                  key={user._id}
                >

                  <div>
                    <h3>{user.name}</h3>

                    <p>{user.email}</p>
                  </div>

                  <span className="user-role">
                    {user.role}
                  </span>

                </div>

              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default AdminDashboard;