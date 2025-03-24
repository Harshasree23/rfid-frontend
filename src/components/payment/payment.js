import { useState } from "react";
import "./payment.css";
import ScannedCards from "../scannedCards/ScannedCards";

const Payment = (props) => {
  const [rfid, setRfid] = useState("");
  const [amount, setAmount] = useState("");
  const [user , setUser] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectCard,setSelectCard] = useState("");
  

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    
    if (amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    try {
      const res = await fetch("https://rfid-bplg.onrender.com/payment/pay", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfid, toId : props.user._id, amount }),
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
      setAmount("");
    }
  };

  return (
    <div className="payment-page">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      { selectCard ? 
            (
              <div className="payment-info">
                <div className="user-name">Hello, {user}</div>
                <div className="go-back" onClick={() => setSelectCard(false)}>Back</div>
                <form onSubmit={handlePaySubmit}>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Enter amount"
                    required
                  />
                  <button type="submit" disabled={!amount}>Pay</button>
                </form>
              </div>
            )  :
            <ScannedCards setSelectCard={setSelectCard} setUser={setUser} setRfid={setRfid}  />
    }
    </div>
  );
};

export default Payment;
