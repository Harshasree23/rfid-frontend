import { useEffect, useState } from "react";
import "./paymentHistory.css";

const PaymentHistory = (props) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
        console.log(props.user);
        const res = await fetch("http://localhost:3000/payment/history", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch payment history");
        }

        const data = await res.json();
        
        // Sort transactions in descending order (newest first)
        const sortedTransactions = data.transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setTransactions(sortedTransactions);
        setFilteredTransactions(sortedTransactions);
        setBalance(data.balance);
    } catch (error) {
        console.error("Error fetching transactions:", error.message);
    }
};


  // Search by name
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    filterTransactions(value, dateFilter);
  };

  // Search by date
  const handleDateFilter = (e) => {
    const value = e.target.value;
    setDateFilter(value);
    filterTransactions(search, value);
  };

  // Filter transactions based on name and date
  const filterTransactions = (searchValue, dateValue) => {
    let filtered = transactions.filter((txn) => 
      txn.from?.firstName?.toLowerCase().includes(searchValue) || 
      txn.to?.firstName?.toLowerCase().includes(searchValue)
    );

    if (dateValue) {
      filtered = filtered.filter((txn) => 
        new Date(txn.timestamp).toISOString().split("T")[0] === dateValue
      );
    }

    setFilteredTransactions(filtered);
  };

  return (
    <div className="payment-history">
      <h2>Transaction History</h2>

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
          onChange={handleSearch}
          className="search-box"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={handleDateFilter}
          className="date-filter"
        />
      </div>

      {/* Transaction Cards */}
      <div className="transactions">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((txn) => (
            <div 
              key={txn._id} 
              className={`transaction-card ${txn.transactionType}`} 
              style={{ borderLeft: txn.transactionType === "credited" ? ".5rem solid green" : ".5rem solid red" ,  backgroundColor: txn.transactionType === "credited" ? "#ccffcc" : "#ffcccc" }}
            >
              <div className="txn-details" >
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
    </div>
  );
};

export default PaymentHistory;
