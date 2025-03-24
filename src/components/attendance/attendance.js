import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./attendance.css"; // Import the new CSS styles

const Attendance = () => {
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [todayStatus, setTodayStatus] = useState(null);
    const [markedDates, setMarkedDates] = useState({});
    const [totalPresents, setTotalPresents] = useState(0);
    const [totalAbsents, setTotalAbsents] = useState(0);
    const [attendancePercentage, setAttendancePercentage] = useState(0);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const res = await fetch("http://localhost:3000/attendance/single", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Failed to fetch attendance");

            const data = await res.json();
            setAttendance(data);

            // Find today's status
            const today = new Date().toISOString().split("T")[0];
            const todayEntry = data.attendance.find(entry =>
                new Date(entry.date).toISOString().split("T")[0] === today
            );
            setTodayStatus(todayEntry ? todayEntry.status : "Not Marked");

            // Map attendance data
            const attendanceMap = {};
            let presents = 0;
            let absents = 0;

            data.attendance.forEach(entry => {
                const dateStr = new Date(entry.date).toISOString().split("T")[0];
                attendanceMap[dateStr] = entry.status;
                if (entry.status === "present") presents++;
                if (entry.status === "absent") absents++;
            });

            setMarkedDates(attendanceMap);
            setTotalPresents(presents);
            setTotalAbsents(absents);
            setAttendancePercentage(((presents / (presents + absents)) * 100).toFixed(2));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const tileClassName = ({ date }) => {
        const dateStr = date.toISOString().split("T")[0];
        if (markedDates[dateStr] === "present") return "present-day";
        if (markedDates[dateStr] === "absent") return "absent-day";
        return null;
    };

    if (loading) return <p>Loading attendance...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="attendance-container">
            {/* Left Side - Calendar */}
            <div className="attendance-calendar">
                <Calendar 
                    tileClassName={tileClassName} 
                    formatShortWeekday={(locale, date) =>
                        date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()
                    }
                />
            </div>

            {/* Right Side - Info */}
            <div className="attendance-info">
                <div className="attendance-header">
                    <p>{attendance.person?.firstName} {attendance.person?.lastName}</p>
                </div>

                <div className="today-div">
                    Today:
                    <p className={`today-status ${todayStatus.toLowerCase()}`}>
                        {todayStatus.toUpperCase()}
                    </p>
                </div>

                <div className="attendance-stats">
                    <table>
                        <tbody>
                            <tr>
                                <td>Total Presents</td>
                                <td>{totalPresents}</td>
                            </tr>
                            <tr>
                                <td>Total Absents</td>
                                <td>{totalAbsents}</td>
                            </tr>
                            <tr>
                                <td>Attendance Percentage</td>
                                <td>{attendancePercentage}%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default Attendance;
