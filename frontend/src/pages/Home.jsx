import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome to UniGo</h1>

      <p>Campus Made Simple.</p>

      <Link to="/login">
        Go to Login
      </Link>

      <br />

      <Link to="/register">
        Create Account
      </Link>
    </div>
  );
}

export default Home;