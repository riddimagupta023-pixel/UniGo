import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function LostFound() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "found",
    location: "",
    date: "",
    contactInfo: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const currentUserId = String(currentUser?.id || currentUser?._id || "");

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await API.get("/lost-found");
      setPosts(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load Lost & Found posts."
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

      await API.post("/lost-found", form);

      setForm({
        title: "",
        description: "",
        type: "found",
        location: "",
        date: "",
        contactInfo: "",
      });

      setShowForm(false);
      await fetchPosts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create post."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const canDeletePost = (post) => {
    if (isAdmin) {
      return true;
    }

    const postedById = String(
      post.postedBy?._id ||
        post.postedBy?.id ||
        post.postedBy ||
        ""
    );

    return postedById === currentUserId;
  };

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Lost & Found report?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await API.delete(`/lost-found/${postId}`);

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId)
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete the post."
      );
    }
  };

  return (
    <div className="dashboard-page">
      <nav className="dashboard-navbar">
        <Link to="/student-dashboard" className="logo">
          Uni<span>Go</span>
        </Link>

        <Link to="/student-dashboard" className="back-link">
          ← Dashboard
        </Link>
      </nav>

      <main className="dashboard-container">
        <div className="page-top-row">
          <div>
            <p className="section-label">CAMPUS HELP</p>

            <h1 className="page-title">Lost & Found</h1>

            <p className="page-description">
              Find lost belongings or report something you found.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close" : "+ Report Item"}
          </button>
        </div>

        {error && <div className="error-card">{error}</div>}

        {showForm && (
          <div className="lost-form-card">
            <h2>Report an Item</h2>

            <p className="form-description">
              Provide the details below so other students can identify the item.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>

                  <input
                    name="title"
                    placeholder="e.g. Black Wallet"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>

                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="found">Found</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  placeholder="Describe the item..."
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>

                  <input
                    name="location"
                    placeholder="Where was it lost/found?"
                    value={form.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date</label>

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Contact Information</label>

                <input
                  name="contactInfo"
                  placeholder="Email or phone"
                  value={form.contactInfo}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                className="primary-btn"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </form>
          </div>
        )}

        {loading && (
          <div className="empty-card">
            Loading posts...
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="empty-card">
            <h3>No Lost & Found posts</h3>

            <p>
              Be the first to report a lost or found item.
            </p>
          </div>
        )}

        <div className="lost-grid">
          {posts.map((post) => (
            <div className="lost-card" key={post._id}>
              <div className="lost-card-top">
                <span
                  className={
                    post.type === "lost"
                      ? "lost-badge"
                      : "found-badge"
                  }
                >
                  {post.type === "lost" ? "LOST" : "FOUND"}
                </span>

                <div className="lost-card-actions">
                  <span className="lost-status">
                    {post.status || "active"}
                  </span>

                  {canDeletePost(post) && (
                    <button
                      className="lost-delete-btn"
                      onClick={() =>
                        handleDeletePost(post._id)
                      }
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              <h2>{post.title}</h2>

              <p>{post.description}</p>

              <div className="lost-details">
                <span>📍 {post.location}</span>

                <span>
                  📅{" "}
                  {post.date
                    ? new Date(post.date).toLocaleDateString(
                        "en-IN"
                      )
                    : "Date not provided"}
                </span>
              </div>

              <div className="contact-info">
                Contact: {post.contactInfo}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default LostFound;