import { useState, useEffect } from "react";
import "./payment.css";
import ScannedCards from "../scannedCards/ScannedCards";

const Payment = (props) => {
  const [rfid, setRfid] = useState("");
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectCard, setSelectCard] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    
    if (amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://rfid-bplg.onrender.com/payment/pay", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfid, toId: props.user._id, amount }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Payment failed.");
      }

      const data = await res.json();
      console.log("Payment Success:", data);
      setSuccess(`₹${amount} paid successfully by ${user}`);
      setSelectCard(false);
    } catch (err) {
      setError(err.message);
      console.error("Payment Error:", err.message);
    } finally {
      setLoading(false);
      setAmount("");
    }
  };

  return (
    <div className="payment-page">
      {/* Error & Success Messages with animations */}
      {error && <div className="error-message fade">{error}</div>}
      {success && <div className="success-message fade">{success}</div>}

      {selectCard ? (
        <div className="payment-info">
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
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount"
              required
            />
            <button type="submit" disabled={!amount || loading}>
              {loading ? "Paying..." : "Pay"}
            </button>
          </form>
        </div>
      ) : (
        <ScannedCards setSelectCard={setSelectCard} setUser={setUser} setRfid={setRfid} />
      )}
    </div>
  );
};

export default Payment;
