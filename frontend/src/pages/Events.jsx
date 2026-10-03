import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const isAdmin = currentUser?.role === "admin";

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "General",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await API.get("/events");
      setEvents(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load events."
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

    try {
      setSubmitting(true);
      setError("");

      await API.post("/events", form);

      setForm({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "General",
      });

      setShowForm(false);
      await fetchEvents();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create event."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}
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

        {/* PAGE HEADER */}
        <div className="events-page-header">

          <div>
            <p className="section-label">
              CAMPUS ACTIVITIES
            </p>

            <h1 className="page-title">
              Events
            </h1>

            <p className="page-description">
              Discover upcoming college events and activities.
            </p>
          </div>

          {/* ADMIN BUTTON */}
          {isAdmin && (
            <button
              className="primary-btn"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Close" : "+ Add Event"}
            </button>
          )}

        </div>

        {/* ERROR */}
        {error && (
          <div className="error-card">
            {error}
          </div>
        )}

        {/* ADMIN FORM */}
        {isAdmin && showForm && (
          <div className="event-form-card">

            <h2>
              Add New Event
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>
                  Event Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter event title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="General">
                    General
                  </option>

                  <option value="Academic">
                    Academic
                  </option>

                  <option value="Cultural">
                    Cultural
                  </option>

                  <option value="Sports">
                    Sports
                  </option>

                  <option value="Technical">
                    Technical
                  </option>

                  <option value="Workshop">
                    Workshop
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Date & Time
                </label>

                <input
                  type="datetime-local"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="Enter event location"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="5"
                  placeholder="Describe the event..."
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-btn"
                disabled={submitting}
              >
                {submitting
                  ? "Adding Event..."
                  : "Add Event"}
              </button>

            </form>

          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="empty-card">
            Loading events...
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          events.length === 0 && (
            <div className="empty-card">

              <h3>
                No upcoming events
              </h3>

              <p>
                New college events will appear here.
              </p>

            </div>
          )}

        {/* EVENTS */}
        <div className="event-list">

          {events.map((event) => (

            <div
              className="event-card"
              key={event._id}
            >

              <div className="event-date">

                <strong>
                  {new Date(event.date).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                    }
                  )}
                </strong>

                <span>
                  {new Date(event.date).toLocaleDateString(
                    "en-IN",
                    {
                      month: "short",
                    }
                  )}
                </span>

              </div>

              <div className="event-content">

                <div className="event-header">

                  <span className="announcement-category">
                    {event.category || "General"}
                  </span>

                  <span className="event-location">
                    📍 {event.location}
                  </span>

                </div>

                <h2>
                  {event.title}
                </h2>

                <p>
                  {event.description}
                </p>

                <small>
                  {new Date(event.date).toLocaleString(
                    "en-IN",
                    {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }
                  )}
                </small>

              </div>

            </div>

          ))}

        </div>

      </main>
    </div>
  );
}

export default Events;