import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await API.get("/announcements");
      setAnnouncements(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load announcements."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">

      <nav className="dashboard-navbar">
        <Link
          to="/student-dashboard"
          className="logo"
        >
          Uni<span>Go</span>
        </Link>

        <Link
          to="/student-dashboard"
          className="back-link"
        >
          ← Dashboard
        </Link>
      </nav>

      <main className="dashboard-container">

        <p className="section-label">
          CAMPUS UPDATES
        </p>

        <h1 className="page-title">
          Announcements
        </h1>

        <p className="page-description">
          Stay updated with the latest college announcements.
        </p>

        {error && (
          <div className="error-card">
            {error}
          </div>
        )}

        {loading && (
          <div className="empty-card">
            Loading announcements...
          </div>
        )}

        {!loading &&
          !error &&
          announcements.length === 0 && (
            <div className="empty-card">
              <h3>No announcements yet</h3>
              <p>
                New college announcements will appear here.
              </p>
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
                  {new Date(
                    announcement.createdAt
                  ).toLocaleDateString("en-IN")}
                </span>

              </div>

              <h2>
                {announcement.title}
              </h2>

              <p>
                {announcement.content}
              </p>

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