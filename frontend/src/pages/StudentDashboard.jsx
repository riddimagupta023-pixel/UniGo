import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Student",
    course: "Student",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      {/* Navbar */}
      <nav className="dashboard-navbar">
        <Link to="/" className="logo">
          Uni<span>Go</span>
        </Link>

        <div className="dashboard-nav-right">
          <span>Hi, {user.name}</span>

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="dashboard-container">

        <div className="dashboard-welcome">
          <div>
            <p className="section-label">STUDENT DASHBOARD</p>

            <h1>Welcome, {user.name} 👋</h1>

            <p>
              Manage your campus activities from one place.
            </p>
          </div>

          <div className="student-info">
            <strong>{user.course}</strong>
            <span>Student</span>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">📢</div>
            <div>
              <h3>Announcements</h3>
              <p>Latest college updates</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div>
              <h3>Events</h3>
              <p>Upcoming campus events</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔎</div>
            <div>
              <h3>Lost & Found</h3>
              <p>Find or report items</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div>
              <h3>Complaints</h3>
              <p>Submit and track complaints</p>
            </div>
          </div>

        </div>

        {/* Quick Access */}
        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <p className="section-label">QUICK ACCESS</p>
              <h2>Campus Services</h2>
            </div>
          </div>

          <div className="service-grid">

            <Link to="/announcements" className="service-card">
              <span className="service-icon">📢</span>
              <h3>Announcements</h3>
              <p>View important college announcements.</p>
              <span className="service-link">View →</span>
            </Link>

            <Link to="/events" className="service-card">
              <span className="service-icon">📅</span>
              <h3>Events</h3>
              <p>Explore upcoming college events.</p>
              <span className="service-link">Explore →</span>
            </Link>

            <Link to="/lost-found" className="service-card">
              <span className="service-icon">🔎</span>
              <h3>Lost & Found</h3>
              <p>Report or find lost belongings.</p>
              <span className="service-link">Open →</span>
            </Link>

            <Link to="/complaints" className="service-card">
              <span className="service-icon">📝</span>
              <h3>Complaints</h3>
              <p>Submit and track your complaints.</p>
              <span className="service-link">Manage →</span>
            </Link>

            <Link to="/community" className="service-card">
              <span className="service-icon">💬</span>
              <h3>Community</h3>
              <p>Connect and interact with students.</p>
              <span className="service-link">Join →</span>
            </Link>

          </div>

        </section>

        {/* Recent Activity */}
        <section className="dashboard-section">

          <p className="section-label">YOUR CAMPUS</p>

          <div className="activity-card">

            <div className="activity-item">
              <span>📢</span>
              <div>
                <strong>Stay updated</strong>
                <p>Check announcements regularly for college updates.</p>
              </div>
            </div>

            <div className="activity-item">
              <span>📅</span>
              <div>
                <strong>Don't miss events</strong>
                <p>Explore upcoming workshops and campus activities.</p>
              </div>
            </div>

            <div className="activity-item">
              <span>💬</span>
              <div>
                <strong>Join the community</strong>
                <p>Share ideas and connect with fellow students.</p>
              </div>
            </div>

          </div>

        </section>

      </main>

      <footer>
        <strong>UniGo</strong>
        <p>Campus Made Simple.</p>
      </footer>

    </div>
  );
}

export default StudentDashboard;