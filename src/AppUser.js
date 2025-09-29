import React, { useState, useEffect } from "react";
import axios from "axios";

function AppUser({ onLogout }) {
    const [activeTab, setActiveTab] = useState("person");
    const [personList, setPersonList] = useState([]);
    const [placeList, setPlaceList] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);

    const buttonStyle = {
        padding: "10px 20px",
        fontSize: "14px",
        cursor: "pointer",
        marginTop: "10px",
        marginRight: "10px",
        fontWeight: "bold",
        borderRadius: "8px",
        border: "1px solid #ccc"
    };

    const logoutButtonStyle = {
        position: "fixed",
        bottom: "40px",
        right: "40px",
        padding: "10px 20px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px"
    };

    const modalStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };

    const modalContentStyle = {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center"
    };

    const fetchAllPersons = async () => {
        try {
            const res = await axios.get("http://localhost:8080/person/all");
            setPersonList(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAllPlaces = async () => {
        try {
            const res = await axios.get("http://localhost:8080/city/all");
            setPlaceList(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAllPersons();
        fetchAllPlaces();
    }, []);

    const handleLogout = () => {
        setShowConfirm(true);
    };

    const confirmLogout = () => {
        setShowConfirm(false);
        onLogout();
    };

    return (
        <div style={{ padding: "40px" }}>
            <div>
                <button
                    style={{
                        ...buttonStyle,
                        backgroundColor: activeTab === "person" ? "black" : "white",
                        color: activeTab === "person" ? "white" : "black",
                    }}
                    onClick={() => setActiveTab("person")}
                >
                    Osoba
                </button>

                <button
                    style={{
                        ...buttonStyle,
                        backgroundColor: activeTab === "place" ? "black" : "white",
                        color: activeTab === "place" ? "white" : "black",
                    }}
                    onClick={() => setActiveTab("place")}
                >
                    Mesto
                </button>
            </div>

            <hr />

            {activeTab === "person" && (
                <div>
                    <h2>Sve osobe</h2>
                    <table border="1" cellPadding="10" style={{ marginTop: "20px", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>Ime</th>
                                <th>Prezime</th>
                                <th>Datum rođenja</th>
                                <th>JMBG</th>
                                <th>Mesto rođenja</th>
                                <th>Mesto u kojem živi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personList.map((p, index) => (
                                <tr key={index}>
                                    <td>{p.firstName}</td>
                                    <td>{p.lastName}</td>
                                    <td>{p.dateOfBirth}</td>
                                    <td>{p.uniqueIdentificationNumber}</td>
                                    <td>{p.cityBirthName}</td>
                                    <td>{p.cityResidenceName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === "place" && (
                <div>
                    <h2>Sva mesta</h2>
                    <table border="1" cellPadding="10" style={{ marginTop: "20px", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>Naziv</th>
                                <th>Poštanski broj</th>
                                <th>Populacija</th>
                            </tr>
                        </thead>
                        <tbody>
                            {placeList.map((p, index) => (
                                <tr key={index}>
                                    <td>{p.name}</td>
                                    <td>{p.postalCode}</td>
                                    <td>{p.population}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <button style={logoutButtonStyle} onClick={handleLogout}>
                Odjavi se
            </button>

            {showConfirm && (
                <div style={modalStyle}>
                    <div style={modalContentStyle}>
                        <h3>Da li ste sigurni da želite da se odjavite?</h3>
                        <button style={{ ...buttonStyle, backgroundColor: "red", color: "white" }} onClick={confirmLogout}>
                            Da
                        </button>
                        <button style={{ ...buttonStyle, backgroundColor: "gray", color: "white" }} onClick={() => setShowConfirm(false)}>
                            Ne
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AppUser;