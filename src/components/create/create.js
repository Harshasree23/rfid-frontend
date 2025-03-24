import { useState, useEffect } from 'react';
import './create.css';
import ScannedCards from '../scannedCards/ScannedCards';

const Create = (props) => {
    const [scanned, setScanned] = useState(false);
    const [rfid, setRfid] = useState("");
    const [userExist, setUserExist] = useState(false);
    const [isCreating, setIsCreating] = useState(false);  //  New state for form submission

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        rollNo: "",
        phone: "",
        address: "",
        role: "",
        rfid: "",
        dob: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Sync RFID into formData when scanned
    useEffect(() => {
        setFormData(prev => ({ ...prev, rfid }));
    }, [rfid]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsCreating(true);  //  Start loading

        // Ensure all fields are filled
        const updatedFormData = { ...formData };
        for (let key in updatedFormData) {
            if (!updatedFormData[key] || updatedFormData[key].trim() === "") {
                setError("All fields are required");
                setIsCreating(false);  //  Stop loading if error
                return;
            }
        }

        // Phone validation
        if (!/^\d{10}$/.test(updatedFormData.phone)) {
            setError("Phone number must be exactly 10 digits");
            setIsCreating(false);
            return;
        }

        // Ensure RFID is present
        if (!rfid.trim()) {
            setError("RFID is required. Please scan a card.");
            setIsCreating(false);
            return;
        }

        // Convert DOB from input format to YYYY-MM-DD for backend storage
        let formattedDob = updatedFormData.dob;

        // Final Form Data
        const finalFormData = { 
            ...updatedFormData, 
            dob: formattedDob,
            password: formattedDob.split("-").reverse().join("") // Keep password as ddmmyyyy
        };

        console.log("Submitting Data:", finalFormData);

        try {
            const res = await fetch("https://rfid-bplg.onrender.com/person", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(finalFormData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to add user");
            }

            setSuccess("User added successfully!");
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                rollNo: "",
                phone: "",
                address: "",
                role: "",
                rfid: rfid,
                dob: "",
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsCreating(false);  //  Stop loading after fetch
        }
    };

    const handleBack = () => {
        setScanned(false); 
        setUserExist(false);
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            rollNo: "",
            phone: "",
            address: "",
            role: "",
            rfid: rfid,
            dob: "",
        });
        setError("");
    }

    return (
        <div className='create-page'>
            {scanned ? (
                <div className='create-info'>
                    <div className='go-back' onClick={() => handleBack() }>Back</div>
                    {userExist ? (
                        <> User Already Exists </>
                    ) : (
                        <div className="create-container">
                            <h2>Add User</h2>

                            {error && <p className="error-msg">{error}</p>}
                            {success && <p className="success-msg">{success}</p>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>First Name:</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label>Last Name:</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label>Email:</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label>Roll No:</label>
                                    <input type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label>Phone:</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label>Address:</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label>Role:</label>
                                    <select name="role" value={formData.role} onChange={handleChange}>
                                        <option value="">Select Role</option>
                                        {props.user.role === "admin" && (
                                            <>
                                                <option value="admin">Admin</option>
                                                <option value="staff">Staff</option>
                                            </>
                                        )}
                                        <option value="member">Member</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Date of Birth:</label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                                </div>

                                <div className="form-group" style={{ display: "none" }}>
                                    <label>RFID:</label>
                                    <input type="text" name="rfid" value={rfid} readOnly />
                                </div>

                                <button type="submit" className="submit-btn" disabled={isCreating}>
                                    {isCreating ? "Creating user..." : "Add User"}  {/*  Button text changes */}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            ) : (
                <ScannedCards setUserExist={setUserExist} setRfid={setRfid} setScanned={setScanned} />
            )}
        </div>
    );
}

export default Create;
