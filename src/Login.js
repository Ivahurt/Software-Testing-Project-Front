import React, { useState, useEffect } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userList, setUserList] = useState([]);

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

  const fetchAllUsers = async () => {
    try {
      const url = "http://localhost:8080/users/all";
      const res = await axios.get(url);
      setUserList(res.data);
      console.log("Korisnici:", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const foundUser = userList.find(
      (u) => u.username === username && u.password === password
    );

    console.log(foundUser)

    if (!foundUser) {
      setError("Korisnik ne postoji ili su podaci pogrešni");
      return;
    }

    if (foundUser.role.toLowerCase() === "administrator") {
      onLogin("admin");
      console.log("admin")
    } else {
      onLogin("user");
      console.log("korisnik")
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div style={{ padding: "60px" }}>
      <h1>Prijavi se</h1>
      <hr />

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Korisničko ime"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "10px",
            width: "500px",
            fontSize: "16px"
          }}
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "10px",
            width: "500px",
            fontSize: "16px"

          }}
        />
        <button
          type="submit"
          style={buttonStyle}
          onClick={handleSubmit}
        >
          Prijavi se
        </button>
      </form>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </div>
  );
}

export default Login;