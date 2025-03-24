import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./ScannedCards.css";

const socket = io("https://rfid-bplg.onrender.com/", {
    transports: ["websocket", "polling"]
}); // Adjust to your server URL

const ScannedCards = (props) => {
    const [rfidScans, setRfidScans] = useState([]);

    useEffect(() => {
        console.log("Connecting to WebSocket...");
    
        socket.on("connect", () => {
            console.log("Connected to WebSocket server!");
        });
    
        socket.on("updateRFIDs", (rfids) => {
            console.log("Received updated RFIDs:", rfids);
            setRfidScans(rfids);
        });
    
        return () => {
            socket.off("updateRFIDs");
        };
    }, []);

    // Handle "Use" button click
    const handleUse = (rfid) => {
        if( props.setUser )
            props.setUser( rfid.name );
        props.setRfid( rfid.rfid );
        socket.emit("processRFID" , rfid.rfid);
        
        if(props.setScanned)
            props.setScanned((true));
        if(props.setSelectCard )
            props.setSelectCard(true);

        if(props.setUserExist && rfid.name!=="new user")
            props.setUserExist(true);
    };


    // Handle "Remove" button click
    const handleRemove = (rfid) => {
        socket.emit("processRFID", rfid.rfid); // Tell server to remove RFID
    };

    return (
        <div className="scanned-cards">

            <div className="scanned-cards-heading">
                <h2>Scanned RFID Cards</h2>
            </div>
            
            {rfidScans.length === 0 ? (
                <div className="no-card">
                    <div className="card">
                        <p>No active scans</p>
                    </div>
                    <div className="scan-txt">
                        Please scan a card and check here
                    </div>
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>RFID</th>
                            <th>Name</th>
                            <th>Roll No</th>
                            <th>Time</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rfidScans.map((rfid, index) => (
                            <tr key={index}>
                                <td>{rfid.rfid}</td>
                                <td>{rfid.name}</td>
                                <td>{rfid.rollNo}</td>
                                <td>{new Date(rfid.timestamp).toLocaleTimeString()}</td>
                                <td>
                                    <button onClick={() => handleUse(rfid)}>Use</button>
                                    <button onClick={() => handleRemove(rfid)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ScannedCards;
