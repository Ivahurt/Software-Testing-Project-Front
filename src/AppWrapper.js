import React, { useState } from "react";
import Login from "./Login";
import App from "./App";
import AppUser from "./AppUser";

function AppWrapper() {
  const [role, setRole] = useState(null);

  const handleLogout = () => {
    setRole(null);
  };

  return (
    <>
      {!role && <Login onLogin={setRole} />}
      {role === "admin" && <App onLogout={handleLogout} />}
      {role === "user" && <AppUser onLogout={handleLogout} />}
    </>
  );
}

export default AppWrapper;