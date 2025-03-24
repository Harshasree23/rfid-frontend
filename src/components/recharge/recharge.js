import { useState } from 'react';
import './recharge.css';
import ScannedCards from '../scannedCards/ScannedCards';

const Recharge = (props) => {
    const [rfid, setRfid] = useState("");
    const [user, setUser] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [selectCard,setSelectCard] = useState("");

    // Handle Recharge Submission
    const handlePaySubmit = async (e) => {
        e.preventDefault();
        if (amount <= 0) {
            setError("Amount must be greater than 0!");
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/payment/add", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rfid, fromId : props.user._id , amount }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Something went wrong");
            }

            const data = await res.json();
            console.log("Recharge Success:", data);
            setSuccess(`₹${amount} added successfully to ${user}`);
            setSelectCard(false); // Reset scanned state after success
            setError("");
        } catch (err) {
            console.error("Recharge Error:", err.message);
            setError(err.message || "Recharge failed. Please try again.");
        } finally {
            setAmount(""); // Reset amount field
        }
    };

    return (
        <div className='recharge-page'>
            {error && <div className="error-message">{error}</div>} {/* Error Message */}
            {success && <div className="success-message">{success}</div>} {/* Success Message */}

            {
                selectCard ? (
                <div className='recharge-info'>
                    <div className='user-name'> Hello {user} </div>
                    <div className='go-back' onClick={() => setSelectCard(false)}> Back </div>
                    <form onSubmit={handlePaySubmit}>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            required
                        />
                        <button type='submit'> Add </button>
                    </form>
                </div>
                ) : (
                    <ScannedCards setSelectCard={setSelectCard} setUser={setUser} setRfid={setRfid} />
                )
          }
        </div>
    );
};

export default Recharge;
