import { useEffect, useState } from 'react';
import './dashboard.css';
import Payment from '../payment/payment';
import Profile from '../profile/profile';
import Recharge from '../recharge/recharge';
import Attendance from '../attendance/attendance';
import Details from '../details/details';
import Access from '../access/access';
import Create from '../create/create';
import PaymentHistory from '../paymentHistory/paymentHistory';

const Dashboard = (props) => {
    const [page, setPage] = useState("");
    const [selectedPage, setSelectedPage] = useState("");
    const [user, setUser] = useState(null);  // Initialize as null to avoid errors

    useEffect(() => {
        async function getData(){
        await getUser();
        }
        getData();
    }, []);

    const getUser = async () => {
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
            setUser(data.user);
        } catch (err) {
            console.error("Error fetching user ID:", err.message);
        }
    };

    const renderPage = () => {
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
            case "Create":
                return <Create user={user} />;
            case "Payment History":
                return <PaymentHistory user={user} />;
            default:
                return <Profile user={user} />
        }
    };

    const handleNavClick = (name) => {
        setPage(name);
        setSelectedPage(name);
    };

    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:3000/logout', {
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
        <>
            <nav>
                <div className={`nav-box ${selectedPage === 'Profile' ? 'active' : ''}`} onClick={() => handleNavClick('Profile')}>Profile</div>

                {user && (user.role === "admin" || user.role === "staff") && (
                    <>
                        <div className={`nav-box ${selectedPage === 'Payment' ? 'active' : ''}`} onClick={() => handleNavClick('Payment')}>Payments</div>
                        <div className={`nav-box ${selectedPage === 'Recharge' ? 'active' : ''}`} onClick={() => handleNavClick('Recharge')}>Recharge</div>
                        <div className={`nav-box ${selectedPage === 'Details' ? 'active' : ''}`} onClick={() => handleNavClick('Details')}>Details</div>
                        <div className={`nav-box ${selectedPage === 'Access' ? 'active' : ''}`} onClick={() => handleNavClick('Access')}>Access</div>
                        <div className={`nav-box ${selectedPage === 'Create' ? 'active' : ''}`} onClick={() => handleNavClick('Create')}>Create</div>
                    </>
                )}

                {user && user.role !== "admin" && (
                    <div className={`nav-box ${selectedPage === 'Attendance' ? 'active' : ''}`} onClick={() => handleNavClick('Attendance')}>Attendance</div>
                )}

                <div className={`nav-box ${selectedPage === 'Payment History' ? 'active' : ''}`} onClick={() => handleNavClick('Payment History')}>Payment History</div>

                <div className="nav-box logout" onClick={handleLogout}>Logout</div>
            </nav>
            {
                user ? 
                <>
                <div className="output-component">
                    {renderPage()}
                </div>
                </> 
                :
                <>
                    <div> Loading... </div>
                </>
            }
            
        </>
    );
};

export default Dashboard;
