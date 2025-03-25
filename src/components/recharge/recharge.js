import { useState, useEffect } from "react";
import "./recharge.css";
import ScannedCards from "../scannedCards/ScannedCards";

const Recharge = (props) => {
  const [rfid, setRfid] = useState("");
  const [user, setUser] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectCard, setSelectCard] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-clear error & success messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000); // 3 seconds before disappearing

      return () => clearTimeout(timer); // Cleanup timeout if component unmounts
    }
  }, [error, success]);

  // Handle Recharge Submission
  const handlePaySubmit = async (e) => {
    e.preventDefault();
    
    if (amount <= 0) {
      setError("Amount must be greater than 0!");
      return;
    }

    setSuccess("");
    setError("");
    setLoading(true); // Start processing

    try {
      const res = await fetch("https://rfid-bplg.onrender.com/payment/add", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rfid, fromId: props.user._id, amount }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const data = await res.json();
      console.log("Recharge Success:", data);
      setSuccess(`₹${amount} added successfully to ${user}`);
      setSelectCard(false);
    } catch (err) {
      console.error("Recharge Error:", err.message);
      setError(err.message || "Recharge failed. Please try again.");
    } finally {
      setLoading(false); // Stop processing
      setAmount(""); // Reset input field
    }
  };

  return (
    <div className="recharge-page">
      {/* Error & Success Messages with Fade Effect */}
      {error && <div className="error-message fade">{error}</div>}
      {success && <div className="success-message fade">{success}</div>}

      {selectCard ? (
        <div className="recharge-info">
          <div className="user-name">Hello, {user}</div>
          <div className="go-back" onClick={() => { 
            setSelectCard(false);
            setError("");
            setSuccess("");
          }}>
            Back
          </div>
          <form onSubmit={handlePaySubmit}>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
            <button type="submit" disabled={!amount || loading}>
              {loading ? "Processing..." : "Add"}
            </button>
          </form>
        </div>
      ) : (
        <ScannedCards setSelectCard={setSelectCard} setUser={setUser} setRfid={setRfid} />
      )}
    </div>
  );
};

export default Recharge;
