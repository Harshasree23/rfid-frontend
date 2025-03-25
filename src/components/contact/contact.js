import { useState } from "react";
import "./contact.css";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        message: ""
    });

    const [buttonText, setButtonText] = useState("Send");
    const [isDisabled, setIsDisabled] = useState(false);
    const [view, setView] = useState("chat"); // Default to Chat Form

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonText("Sending...");
        setIsDisabled(true);

        try {
            const response = await fetch("https://rfid-bplg.onrender.com/send-mail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: "sreeharsha2358@gmail.com",
                    subject: `${formData.name} wants to contact`,
                    text: `Name: ${formData.name}
                        Email: ${formData.email}
                        Phone: ${formData.phone}
                        Address: ${formData.address}
                        Message: ${formData.message}`
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to send message");
            }

            setButtonText("Sent!");
            setTimeout(() => {
                setButtonText("Send");
                setIsDisabled(false);
            }, 3000); // Reset after 3 seconds

            setFormData({ name: "", email: "", phone: "", address: "", message: "" });

        } catch (error) {
            setButtonText("Send");
            setIsDisabled(false);
            alert(error.message);
        }
    };

    const buttons = () => {
        return(
            <div className='contact-img'>
                <img
                    src='/assets/info.png'
                    alt='Get more info'
                    className={view === "info" ? "selected" : ""}
                    onClick={() => setView("info")}
                />
                <img
                    src='/assets/chat.png'
                    alt='Send a message'
                    className={view === "chat" ? "selected" : ""}
                    onClick={() => setView("chat")}
                />
            </div>
        );
    }

    return (
        <div className="contact-container">

            <div className="get-in-touch"> Get in touch </div>

            {view === "chat" && (
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className='form-heading'> {buttons()} Message Us</div>
                    <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={handleChange} />
                    <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
                    <input type="tel" name="phone" placeholder="Phone no" required value={formData.phone} onChange={handleChange} />
                    <input type="text" name="address" placeholder="Address" required value={formData.address} onChange={handleChange} />
                    <textarea name="message" placeholder="Type your message here" required value={formData.message} onChange={handleChange} />
                    <button type="submit" disabled={isDisabled}>{buttonText}</button>
                </form>
            )}

            {view === "info" && (
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className='form-heading'> {buttons()} Request More Info</div>
                    <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={handleChange} />
                    <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
                    <input type="tel" name="phone" placeholder="Phone no" required value={formData.phone} onChange={handleChange} />
                    <button type="submit" disabled={isDisabled}>{buttonText}</button>
                </form>
            )}
        </div>
    );
};

export default Contact;
