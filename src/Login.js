import React, { useState, useEffect } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userList, setUserList] = useState([]);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "14px",
    cursor: locked ? "not-allowed" : "pointer",
    marginTop: "10px",
    marginRight: "10px",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: locked ? "#ccc" : "#fff"
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

  const handleLockout = () => {
    setLocked(true);
    alert("Previše neuspelih pokušaja. Sačekajte 1 minut.");
    setTimeout(() => {
      setAttempts(0);
      setLocked(false);
    }, 1 * 60 * 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (locked) return;

    setUsernameError("");
    setPasswordError("");
    setGeneralError("");

    let valid = true;

    if (!username) {
      setUsernameError("Korisničko ime mora biti popunjeno");
      valid = false;
    } else if (username.length < 4) {
      setUsernameError("Korisničko ime mora imati najmanje 4 karaktera");
      valid = false;
    }

    if (!password) {
      setPasswordError("Lozinka mora biti popunjena");
      valid = false;
    } else if (password.length < 4) {
      setPasswordError("Lozinka mora imati najmanje 4 karaktera");
      valid = false;
    }

    if (!valid) return;

    const foundUser = userList.find(
      (u) => u.username === username && u.password === password
    );

    if (!foundUser) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      console.log(`Neuspešan pokušaj broj: ${newAttempts}`);

      if (newAttempts >= 10) {
        handleLockout();
      } else {
        setGeneralError(
          `Korisnik ne postoji ili su podaci pogrešni. Pokušaji: ${newAttempts}/10`
        );
      }
      return;
    }

    setAttempts(0);

    if (foundUser.role.toLowerCase() === "administrator") {
      onLogin("admin");
    } else {
      onLogin("user");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
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
          onKeyDown={handleKeyDown}
          disabled={locked}
          style={{
            display: "block",
            marginBottom: "5px",
            padding: "10px",
            width: "500px",
            fontSize: "16px"
          }}
        />
        {usernameError && (
          <div style={{ color: "red", marginBottom: "10px" }}>{usernameError}</div>
        )}

        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={locked}
          style={{
            display: "block",
            marginBottom: "5px",
            padding: "10px",
            width: "500px",
            fontSize: "16px"
          }}
        />
        {passwordError && (
          <div style={{ color: "red", marginBottom: "10px" }}>{passwordError}</div>
        )}

        <button type="submit" style={buttonStyle} disabled={locked}>
          Prijavi se
        </button>

        {generalError && (
          <div style={{ color: "red", marginTop: "10px" }}>{generalError}</div>
        )}
      </form>
    </div>
  );
}

export default Login;