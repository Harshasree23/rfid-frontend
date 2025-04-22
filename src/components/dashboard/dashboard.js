import { useEffect, useState, useRef, useCallback } from 'react';
import './dashboard.css';
import Payment from '../payment/payment';
import Profile from '../profile/profile';
import Recharge from '../recharge/recharge';
import Attendance from '../attendance/attendance';
import Details from '../details/details';
import Access from '../access/access';
import Create from '../create/create';
import PaymentHistory from '../paymentHistory/paymentHistory';
import AccessLogs from '../access_info/accessInfo';

const Dashboard = (props) => {
    const [page, setPage] = useState("Profile"); // Default to Profile
    const [selectedPage, setSelectedPage] = useState("Profile");
    const [user, setUser] = useState(null);
    const userCache = useRef(null); // Cache user data

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        if (userCache.current) {
            setUser(userCache.current);
            return;
        }
        
        try {
            const res = await fetch("https://rfid-bplg.onrender.com/getUserId", {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch user data.");
            }

            const data = await res.json();
            userCache.current = data.user;  // Cache the user data
            setUser(data.user);
        } catch (err) {
            console.error("Error fetching user ID:", err.message);
        }
    };

    // 🛠️ Memoize the render function so it doesn't re-create on every render
    const renderPage = useCallback(() => {
        switch (page) {
            case "Payment":
                return <Payment user={user} />;
            case "Profile":
                return <Profile user={user} />;
            case "Recharge":
                return <Recharge user={user} />;
            case "Details":
                return <Details user={user} />;
            case "Attendance":
                return <Attendance user={user} />;
            case "Access":
                return <Access user={user} />;
            case "Access Logs":
                return <AccessLogs user={user} />;
            case "Create":
                return <Create user={user} />;
            case "Payment History":
                return <PaymentHistory user={user} />;
            default:
                return <Profile user={user} />;
        }
    }, [page, user]); // Recreate only when page or user changes

    const handleNavClick = (name) => {
        if (name !== page) {
            setPage(name);
            setSelectedPage(name);
        }
    };

    const handleLogout = async () => {
        try {
            const res = await fetch('https://rfid-bplg.onrender.com/logout', {
                method: 'GET',
                credentials: "include",
            });

            if (!res.ok) return;

            props.setLogged(false);
            window.location.reload(); // Refresh to clear session data
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='dashboard'>

            {user ? (
                <div className='user-dashboard'>
                    <nav>
                        <div className={`nav-box ${selectedPage === 'Profile' ? 'active' : ''}`} onClick={() => handleNavClick('Profile')}>
                            <img src='/assets/person.png' alt='profile' /> 
                        </div>

                        {user && (user.role === "admin" || user.role === "staff") && (
                            <>
                                <div className={`nav-box ${selectedPage === 'Payment' ? 'active' : ''}`} onClick={() => handleNavClick('Payment')}>Payments</div>
                                <div className={`nav-box ${selectedPage === 'Recharge' ? 'active' : ''}`} onClick={() => handleNavClick('Recharge')}>Recharge</div>
                                <div className={`nav-box ${selectedPage === 'Details' ? 'active' : ''}`} onClick={() => handleNavClick('Details')}>Details</div>
                                <div className={`nav-box ${selectedPage === 'Access' ? 'active' : ''}`} onClick={() => handleNavClick('Access')}>Access</div>
                                <div className={`nav-box ${selectedPage === 'Create' ? 'active' : ''}`} onClick={() => handleNavClick('Create')}>Create</div>
                                <div className={`nav-box ${selectedPage === 'Access Logs' ? 'active' : ''}`} onClick={() => handleNavClick('Access Logs')}>Access Logs</div>
                            </>
                        )}

                        {user && user.role !== "admin" && (
                            <div className={`nav-box ${selectedPage === 'Attendance' ? 'active' : ''}`} onClick={() => handleNavClick('Attendance')}>Attendance</div>
                        )}

                        <div className={`nav-box ${selectedPage === 'Payment History' ? 'active' : ''}`} onClick={() => handleNavClick('Payment History')}>Payment History</div>

                        <div className="nav-box logout" onClick={handleLogout}>Logout</div>
                    </nav>
                    <div className="output-component">
                        {renderPage()} 
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default Dashboard;
