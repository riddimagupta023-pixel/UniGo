import { Link } from "react-router-dom";
import "../App.css";

function Landing() {
  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">
          Uni<span>Go</span>
        </Link>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="welcome">WELCOME TO UNIGO</p>

          <h1>
            Campus life,
            <br />
            made <span>simple.</span>
          </h1>

          <p className="hero-text">
            One platform for students to stay connected with campus
            announcements, events, lost & found, complaints and community
            discussions.
          </p>

          <div className="hero-buttons">
            <Link to="/register">
              <button className="primary-btn">Get Started</button>
            </Link>

            <Link to="/login">
              <button className="secondary-btn">Login</button>
            </Link>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="hero-card">
          <div className="card-top">
            <span>UniGo</span>
            <span>● Online</span>
          </div>

          <h3>Campus Dashboard</h3>

          <p>
            Everything students need, available in one simple place.
          </p>

          <div className="mini-grid">
            <div>
              📢
              <span>Announcements</span>
            </div>

            <div>
              📅
              <span>Events</span>
            </div>

            <div>
              🔎
              <span>Lost & Found</span>
            </div>

            <div>
              💬
              <span>Community</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <p className="section-label">WHAT UNIGO OFFERS</p>

        <h2>Everything your campus needs.</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon">📢</div>
            <h3>Announcements</h3>
            <p>
              Stay updated with important college announcements and
              notifications.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">📅</div>
            <h3>Events</h3>
            <p>
              Discover upcoming college events, workshops and activities.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">🔎</div>
            <h3>Lost & Found</h3>
            <p>
              Report lost items and help fellow students find their
              belongings.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">💬</div>
            <h3>Community</h3>
            <p>
              Connect with students, share ideas and participate in campus
              discussions.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about" id="about">
        <p className="section-label">ABOUT UNIGO</p>

        <h2>Campus Made Simple.</h2>

        <p>
          UniGo brings everyday campus services together in one platform.
          Students can access information, raise complaints, find lost
          belongings and connect with their campus community without
          switching between different platforms.
        </p>
      </section>

      {/* Footer */}
      <footer>
        <div>
          <strong>UniGo</strong>
        </div>

        <p>Campus Made Simple.</p>
      </footer>
    </div>
  );
}

export default Landing;