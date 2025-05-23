import { useEffect, useState, useMemo, useRef } from "react";
import "./paymentHistory.css";

const PaymentHistory = (props) => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true); // ✅ Keep track of loading state

  // useRef to cache transactions
  const cacheRef = useRef(null);

  useEffect(() => {
    if (cacheRef.current) {
      console.log("Using cached transactions");
      setTransactions(cacheRef.current);
      setLoading(false); // ✅ Stop loading if cache is available
    } else {
      fetchPaymentHistory();
    }
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      console.log("Fetching from server...");
      setLoading(true); // ✅ Show loading message while fetching

      const res = await fetch("https://rfid-bplg.onrender.com/payment/history", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch payment history");
      }

      const data = await res.json();
      const sortedTransactions = data.transactions.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      // Store fetched data in useRef
      cacheRef.current = sortedTransactions;
      setTransactions(sortedTransactions);
      setBalance(data.balance);
    } catch (error) {
      console.error("Error fetching transactions:", error.message);
    } finally {
      setLoading(false); // ✅ Stop loading after fetching
    }
  };

  // Memoized filtering
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesSearch =
        txn.from?.firstName?.toLowerCase().includes(search) ||
        txn.to?.firstName?.toLowerCase().includes(search);

      const matchesDate = dateFilter
        ? new Date(txn.timestamp).toISOString().split("T")[0] === dateFilter
        : true;

      return matchesSearch && matchesDate;
    });
  }, [transactions, search, dateFilter]);

  return (
    <div className="payment-history">
      
      {/* Show loading message before transactions are fetched */}
      {loading ? (
        <p className="loading-text">Loading transactions...</p>
      ) : (
        <>
          {/* Balance Display */}
          <div className="balance">
            Total Balance: <span className={balance >= 0 ? "green" : "red"}>₹{balance}</span>
          </div>

          {/* Search Filters */}
          <div className="filters">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
              className="search-box"
            />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="date-filter"
            />
          </div>

          {/* Transactions */}
          <div className="transactions">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn) => (
                <div 
                  key={txn._id} 
                  className={`transaction-card ${txn.transactionType}`} 
                  style={{
                    borderLeft: txn.transactionType === "credited" ? ".5rem solid green" : ".5rem solid red",
                    backgroundColor: txn.transactionType === "credited" ? "#ccffcc" : "#ffcccc",
                  }}
                >
                  <div className="txn-details">
                    <span className="from-to">
                      {txn.transactionType === "credited"
                        ? `From: ${txn.from?.firstName || "Unknown"} ${txn.from?.lastName || ""}`
                        : `To: ${txn.to?.firstName || "Unknown"} ${txn.to?.lastName || ""}`}
                    </span>
                    <span className="amount">₹{txn.amount}</span>
                  </div>
                  <div className="txn-time">{new Date(txn.timestamp).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <p>No transactions found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentHistory;
