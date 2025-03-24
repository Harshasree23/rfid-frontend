import { useEffect, useState } from "react";
import './details.css';

const Details = (props) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("https://rfid-bplg.onrender.com/person", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch users");
                }

                setUsers(data.users);
                setFilteredUsers(data.users);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Function to filter users based on search and role selection
    useEffect(() => {
        let updatedUsers = users;

        if (searchTerm.trim() !== "") {
            updatedUsers = updatedUsers.filter((user) =>
                user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.rollNo.toString().includes(searchTerm)
            );
        }

        if (selectedRole) {
            updatedUsers = updatedUsers.filter((user) => user.role === selectedRole);
        }

        setFilteredUsers(updatedUsers);
    }, [searchTerm, selectedRole, users]);

    return (
        <div className="users-container">

            <div className="search-filter-container">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search by name, email, or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {
                    props.user.role === 'admin' ? 
                    <select
                        className="role-filter"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}>

                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                        <option value="member">Member</option>
                    
                    </select>
                     : <></>
                }
                
            </div>

            {loading && <p>Loading users...</p>}
            {error && <p className="error-msg">{error}</p>}

            {!loading && !error && filteredUsers.length === 0 && <p>No users found.</p>}

            {!loading && !error && filteredUsers.length > 0 && (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Roll No</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Dob</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id}>
                                <td>{user.firstName + " " + user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.rollNo}</td>
                                <td>{user.phone}</td>
                                <td>{user.address}</td>
                                <td>
                                {user.dob 
                                    ? new Date(user.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-') 
                                    : "N/A"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Details;
