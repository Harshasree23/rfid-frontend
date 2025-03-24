import { useState, useEffect } from "react";
import "./profile.css";

const Profile = (props) => {
    const excludedFields = ["_id", "__v", "password", "rfid", "createdAt", "updatedAt"];
    const nonEditableFields = ["email", "role", "rollNo"]; // Fields that should not be editable
    const filteredUserData = Object.fromEntries(
        Object.entries(props.user).filter(([key]) => !excludedFields.includes(key))
    );

    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(filteredUserData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(""), 2000); // Hide success message after 2 seconds
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    // Function to format date fields (YYYY-MM-DD)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date) ? date.toISOString().split("T")[0] : dateString;
    };

    // Email Validation
    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    // Phone Number Validation (Only Digits, 10-15 Length)
    const isValidPhoneNumber = (phone) => {
        const phoneRegex = /^[0-9]{10,15}$/;
        return phoneRegex.test(phone);
    };

    // Validate all fields before submission
    const validateFields = () => {
        for (const [key, value] of Object.entries(userData)) {
            if (value.trim() === "") {
                setError(`"${key.replace(/([A-Z])/g, " $1").trim()}" is required.`);
                return false;
            }
            if (key.toLowerCase().includes("email") && !isValidEmail(value)) {
                setError("Invalid email format.");
                return false;
            }
            if (key.toLowerCase().includes("phone") && !isValidPhoneNumber(value)) {
                setError("Phone number must be 10-15 digits.");
                return false;
            }
        }
        return true;
    };

    // Save updated profile data
    const saveProfile = async () => {
        if (!validateFields()) return; // Prevent submission if validation fails

        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await fetch("http://localhost:3000/person/", {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update profile");
            }

            setIsEditing(false); // Exit edit mode
            setSuccess("Successfully updated!");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <h2 className="msg">
                Profile Details
                <button className="edit-btn" onClick={() => (isEditing ? saveProfile() : setIsEditing(true))} disabled={loading}>
                    {loading ? "Saving..." : isEditing ? "Save" : "Edit"}
                </button>
            </h2>

            {error && <p className="error-msg">{error}</p>}
            {success && <p className="success-msg">{success}</p>}

            <div className="profile-card">
                <div className="profile-info">
                    {Object.entries(userData).map(([key, value]) => (
                        <div className="input-container" key={key}>
                            <label>{key.replace(/([A-Z])/g, " $1").trim()}:</label>
                            {isEditing && !nonEditableFields.includes(key) ? (
                                key === "address" ? (
                                    <textarea name={key} value={value} onChange={handleChange} required></textarea>
                                ) : key.toLowerCase().includes("dob") ? (
                                    <input type="date" name={key} value={formatDate(value)} onChange={handleChange} required />
                                ) : key.toLowerCase().includes("email") ? (
                                    <input type="email" name={key} value={value} onChange={handleChange} required />
                                ) : key.toLowerCase().includes("phone") ? (
                                    <input type="tel" name={key} value={value} onChange={handleChange} required />
                                ) : (
                                    <input type="text" name={key} value={value} onChange={handleChange} required />
                                )
                            ) : (
                                <div className="span non-editable">{key.toLowerCase().includes("dob") ? formatDate(value) : value}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
