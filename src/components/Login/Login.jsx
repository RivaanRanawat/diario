import { useState } from "react";
import "./Login.css";
import firebase from "../../services/firebase";

function Login() {
  const [isSignup, setIsSignup] = useState(true);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  };

  const handleLoginChange = (e) => {
    setIsSignup(!isSignup);
  };

  return (
    <div class="wrapper">
      <form className="form" onSubmit={handleFormSubmit}>
        <div class="headline">
          <h1>Welcome to Diaro, your Personal Diary.</h1>
        </div>
        {isSignup ? (
          <div className="signup">
            <div className="form-group">
              <input type="text" placeholder="Full name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Email" required />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Password" required />
            </div>
            <button type="submit" class="btn">
              SIGN UP
            </button>
            <div className="account-exist">
              Already have an account?{" "}
              <a
                id="login"
                onClick={handleLoginChange}
                style={{ cursor: "pointer" }}
                href=""
              >
                Login
              </a>
            </div>
          </div>
        ) : (
          <div class="signin">
            <div className="form-group">
              <input type="email" placeholder="Email" required />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Password" required />
            </div>
            <div className="forget-password">
              <a>Forgot password?</a>
            </div>
            <button type="submit" class="btn">
              LOGIN
            </button>
            <div className="account-exist">
              Create New account?{" "}
              <a
                id="signup"
                onClick={handleLoginChange}
                style={{ cursor: "pointer" }}
              >
                Signup
              </a>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
