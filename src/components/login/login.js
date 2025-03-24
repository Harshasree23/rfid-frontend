import React, { useState ,useEffect } from "react";
import "./login.css";
import Tagflow from "../tagflow/Tagflow";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  // Auto Login: Check if token exists
  useEffect(() => {
    const autoLogin = async () => {
      try {
        const response = await fetch("http://localhost:3000/auto-login", {
          method: "GET",
          credentials: "include", // Send cookies with request
        });

        if (!response.ok) return; // No valid session, do nothing

        props.setLogged(true);
        props.setLogin(false);
      } catch (err) {
        console.error("Auto-login failed:", err.message);
      }
    };

    autoLogin();
  }, ); // Runs only once on mount


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://rfid-bplg.onrender.com/login", {
        method: "POST",
        credentials: "include", // Include cookies/auth headers
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json(); // Parse JSON response
      throw errorData.error || "Login failed";
    }

    const data = await response.json();
    console.log("Login Success:", data);

      // Update parent component's state
      props.setLogged(true);
      props.setLogin(false);

    } catch (error) {
      console.log(error);
      setError(error || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page" onClick={(e) => e.target.classList.contains("login-page") && props.setLogin(false)}>
      <div className="container" onClick={(e) => e.stopPropagation()}>

        {/* Close Button */}
        <button className="close-btn" onClick={() => props.setLogin(false)}>✖</button>

        {/* Logo */}
        <div className="logo">
          <img src="/assets/logo.png" alt="TagFlow Logo" />
          <Tagflow />
        </div>

        <div className="login-form">
          {/* Role Selection */}
         
          {/* Login Form */}
          <form className="form" onSubmit={handleLogin}>
            <input type="email" name="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" name="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && <p className="error-msg">{error}</p>}

          <div className="signup-msg">
            <div className="signup-left">Don't Have an account?</div>
            <ul>
              <li>For Admin access contact our team</li>
              <li>For Staff access contact admin</li>
              <li>For Member access contact staff or admin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
