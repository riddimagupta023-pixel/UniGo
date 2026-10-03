import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await API.get("/complaints/my");
      setComplaints(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load complaints."
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

    try {
      await API.post("/complaints", form);

      setForm({
        title: "",
        description: "",
        category: "General",
      });

      setShowForm(false);
      fetchComplaints();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to submit complaint."
      );
    }
  };

  const getStatusClass = (status) => {
    if (status === "resolved") {
      return "status-resolved";
    }

    if (status === "in-progress") {
      return "status-progress";
    }

    return "status-pending";
  };

  return (
    <div className="dashboard-page">

      <nav className="dashboard-navbar">
        <Link to="/student-dashboard" className="logo">
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

        <div className="page-top-row">
          <div>
            <p className="section-label">
              STUDENT SUPPORT
            </p>

            <h1 className="page-title">
              Complaints
            </h1>

            <p className="page-description">
              Submit a complaint and track its status.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close" : "+ New Complaint"}
          </button>
        </div>

        {error && (
          <div className="error-card">
            {error}
          </div>
        )}

        {showForm && (
          <div className="complaint-form-card">

            <h2>Submit a Complaint</h2>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Title</label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter complaint title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>

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
                  <option value="Infrastructure">
                    Infrastructure
                  </option>
                  <option value="Hostel">
                    Hostel
                  </option>
                  <option value="Library">
                    Library
                  </option>
                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  rows="5"
                  placeholder="Describe your complaint..."
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-btn"
              >
                Submit Complaint
              </button>

            </form>
          </div>
        )}

        {loading && (
          <div className="empty-card">
            Loading complaints...
          </div>
        )}

        {!loading &&
          !error &&
          complaints.length === 0 && (
            <div className="empty-card">
              <h3>No complaints submitted</h3>
              <p>
                Your submitted complaints will appear here.
              </p>
            </div>
          )}

        <div className="complaint-list">

          {complaints.map((complaint) => (
            <div
              className="complaint-card"
              key={complaint._id}
            >

              <div className="complaint-top">

                <span className="complaint-category">
                  {complaint.category || "General"}
                </span>

                <span
                  className={`complaint-status ${getStatusClass(
                    complaint.status
                  )}`}
                >
                  {complaint.status || "pending"}
                </span>

              </div>

              <h2>{complaint.title}</h2>

              <p>{complaint.description}</p>

              <small>
                Submitted{" "}
                {complaint.createdAt
                  ? new Date(
                      complaint.createdAt
                    ).toLocaleDateString("en-IN")
                  : ""}
              </small>

            </div>
          ))}

        </div>

      </main>
    </div>
  );
}

export default Complaints;