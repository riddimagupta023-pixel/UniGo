
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "Academic",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await API.get("/announcements");
      setAnnouncements(response.data);
      setError("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load announcements."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await API.post("/announcements", form);

      setForm({
        title: "",
        content: "",
        category: "Academic",
      });

      setShowForm(false);
      setSuccess("Announcement published successfully.");
      await fetchAnnouncements();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to publish announcement."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-page">
      <nav className="dashboard-navbar">
        <Link to="/" className="logo">
          Uni<span>Go</span>
        </Link>

        <Link
          to={isAdmin ? "/admin-dashboard" : "/student-dashboard"}
          className="back-link"
        >
          ← Dashboard
        </Link>
      </nav>

      <main className="dashboard-container">
        <p className="section-label">CAMPUS UPDATES</p>

        <h1 className="page-title">Announcements</h1>

        <p className="page-description">
          Stay updated with the latest college announcements.
        </p>

        {isAdmin && (
          <div style={{ margin: "20px 0" }}>
            <button
              type="button"
              className="auth-btn"
              onClick={() => {
                setShowForm(!showForm);
                setError("");
                setSuccess("");
              }}
            >
              {showForm ? "Cancel" : "+ Add Announcement"}
            </button>
          </div>
        )}

        {showForm && isAdmin && (
          <form
            onSubmit={handleSubmit}
            className="announcement-card"
            style={{
              marginBottom: "24px",
              display: "grid",
              gap: "14px",
            }}
          >
            <h2>Create Announcement</h2>

            <label htmlFor="announcement-title">Title</label>
            <input
              id="announcement-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter announcement title"
              required
            />

            <label htmlFor="announcement-category">Category</label>
            <select
              id="announcement-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="Academic">Academic</option>
              <option value="Events">Events</option>
              <option value="General">General</option>
              <option value="Examination">Examination</option>
            </select>

            <label htmlFor="announcement-content">Announcement</label>
            <textarea
              id="announcement-content"
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write the announcement here"
              rows={5}
              required
            />

            <button
              type="submit"
              className="auth-btn"
              disabled={saving}
            >
              {saving ? "Publishing..." : "Publish Announcement"}
            </button>
          </form>
        )}

        {error && <div className="error-card">{error}</div>}

        {success && (
          <div className="success-message">{success}</div>
        )}

        {loading && (
          <div className="empty-card">Loading announcements...</div>
        )}

        {!loading && !error && announcements.length === 0 && (
          <div className="empty-card">
            <h3>No announcements yet</h3>
            <p>New college announcements will appear here.</p>
          </div>
        )}

        <div className="announcement-list">
          {announcements.map((announcement) => (
            <div
              className="announcement-card"
              key={announcement._id}
            >
              <div className="announcement-header">
                <span className="announcement-category">
                  {announcement.category || "General"}
                </span>

                <span className="announcement-date">
                  {announcement.createdAt
                    ? new Date(
                        announcement.createdAt
                      ).toLocaleDateString("en-IN")
                    : ""}
                </span>
              </div>

              <h2>{announcement.title}</h2>
              <p>{announcement.content}</p>

              {announcement.createdBy && (
                <small>
                  Posted by {announcement.createdBy.name}
                </small>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Announcements;
