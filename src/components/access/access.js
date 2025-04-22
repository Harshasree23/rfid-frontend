import { useState, useEffect } from "react";
import "./access.css";
import ScannedCards from "../scannedCards/ScannedCards"; // Assuming you have this or will use a similar card scan component

const Access = (props) => {
  const [modelName, setModelName] = useState("");
  const [accessedBy, setAccessedBy] = useState(""); // User who is accessing
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectCard, setSelectCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rfid , setRfid] = useState("");
  const [accessId,setAccessId] = useState("");

  // Auto-clear success and error messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000); // Clears messages after 3 seconds

      return () => clearTimeout(timer); // Cleanup timeout if component unmounts
    }
  }, [error, success]);

  const handleAccessSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!modelName || !accessedBy) {
      setError("All fields must be filled.");
      return;
    }

    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://rfid-bplg.onrender.com/access", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelName, accessedBy: accessId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Access log creation failed.");
      }

      const data = await res.json();
      console.log("Access Log Success:", data);
      setSuccess(`Access log created successfully for ${modelName}`);
      setSelectCard(false);
    } catch (err) {
      setError(err.message);
      console.error("Access Log Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="access-page">
      {/* Error & Success Messages with animations */}
      {error && <div className="error-message fade">{error}</div>}
      {success && <div className="success-message fade">{success}</div>}

      {selectCard ? (
        <div className="access-info">
          <div className="user-name">Hello, {props.user.firstName} {props.user.lastName}</div>
          <div className="go-back" onClick={() => { 
            setSelectCard(false);
            setError("");
            setSuccess("");
          }}>
            Back
          </div>

          <form onSubmit={handleAccessSubmit}>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Enter model name"
              required
            />
            <button type="submit" disabled={loading || !modelName || !accessedBy}>
              {loading ? "Creating Access..." : "Create Access Log"}
            </button>
          </form>
        </div>
      ) : (
        <ScannedCards setSelectCard={setSelectCard} setAccessId={setAccessId} setRfid={setRfid} setUser={setAccessedBy} />
      )}
    </div>
  );
};

export default Access;
