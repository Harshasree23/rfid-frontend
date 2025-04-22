import { useEffect, useState } from "react";
import "./accessInfo.css";

const AccessLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAccessLogs();
    }, []);

    const fetchAccessLogs = async () => {
        try {
            const res = await fetch("https://rfid-bplg.onrender.com/access", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Failed to fetch access logs");
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading access logs...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="access-container">
            <div className="access-header">
                <h2>Access Logs</h2>
            </div>

            <div className="access-list">
                <table>
                    <thead>
                        <tr>
                            <th>Model Name</th>
                            <th>Record ID</th>
                            <th>Accessed By</th>
                            <th>Access Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => (
                            <tr key={index}>
                                <td>{log.modelName}</td>
                                <td>{log.recordId}</td>
                                <td>{log.accessedBy?.firstName} {log.accessedBy?.lastName}</td>
                                <td>{new Date(log.time).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccessLogs;
