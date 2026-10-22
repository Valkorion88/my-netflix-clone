import React, { useState } from 'react'
import './Login.css';
import logo from '../../assets/logo.png';
import { login, signup } from '../../firebase';
import netflix_spinner from '../../assets/netflix_spinner.gif'

const Login = () => {
  const [signState, setSignState] = useState("Sign In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const user_auth = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (signState === "Sign In") {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#e50914",
          color: "#fff",
          padding: "10px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        ⚠️ EDUCATIONAL PORTFOLIO SITE: Do NOT enter your real Netflix or
        personal credentials.
      </div>
      {loading ? (
        <div className="login-spinner">
          <img src={netflix_spinner} alt="" />
        </div>
      ) : (
        <div className="login">
          <img src={logo} className="login-logo" alt="Logo" />
          <div className="login-form">
            <h1>{signState}</h1>
            <form onSubmit={user_auth}>
              {signState === "Sign Up" ? (
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.currentTarget.value);
                  }}
                  type="text"
                  placeholder="Your name"
                />
              ) : (
                <></>
              )}
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.currentTarget.value);
                }}
                type="email"
                placeholder="Email"
              />
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.currentTarget.value);
                }}
                type="password"
                placeholder="Password"
              />
              <button type="submit">
                {signState}
              </button>
              <div className="form-help">
                <div className="remember">
                  <input type="checkbox" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <p>Need help?</p>
              </div>
            </form>
            <div className="form-switch">
              {signState === "Sign In" ? (
                <p>
                  New to Netflix?{" "}
                  <span
                    onClick={() => {
                      setSignState("Sign Up");
                    }}
                  >
                    Sign Up Now
                  </span>
                </p>
              ) : (
                <p>
                  Already have an Account?{" "}
                  <span
                    onClick={() => {
                      setSignState("Sign In");
                    }}
                  >
                    Sign In Now
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Login
