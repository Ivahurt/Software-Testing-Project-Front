import React, { useState } from "react";
import axios from "axios";

function App() {
  const [activeTab, setActiveTab] = useState("person");
  const [personAction, setPersonAction] = useState("add");
  const [showAllPersons, setShowAllPersons] = useState(false);
  
  const [placeAction, setPlaceAction] = useState("add")
  const [showAllPlaces, setShowAllPlaces] = useState(false);
  const [errors, setErrors] = useState({});

  const [personData, setPersonData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    uniqueIdentificationNumber: "",
    cityBirthName: "",
    cityResidenceName: ""
  });

  const [placeData, setPlaceData] = useState({
    name: "",
    postalCode: "",
    population: "",
  });

  const [personList, setPersonList] = useState([]);
  const [placeList, setPlaceList] = useState([]);
  

  const inputStyle = { display: "block", marginBottom: "10px", padding: "10px", fontSize: "16px", width: "300px" };
  const selectStyle = { ...inputStyle, fontWeight: "bold" };
  const buttonStyle = { padding: "10px 20px", fontSize: "16px", cursor: "pointer", marginTop: "10px" };

  const fetchAllPersons = async () => {
  try {
    const url = "http://localhost:8080/person/all";
    const res = await axios.get(url); 
    setPersonList(res.data);
    setShowAllPersons(true);
    console.log("Response:", res.data);
  } catch (err) {
    console.error(err);
  }
};

const fetchAllPlaces = async () => {
  try {
    const url = "http://localhost:8080/city/all";
    const res = await axios.get(url); 
    setPlaceList(res.data);
    setShowAllPlaces(true);
    console.log("Response:", res.data);
  } catch (err) {
    console.error(err);
  }
};
  
  const handleSubmitPerson = async () => {
  try {
    const url = `http://localhost:8080/osoba/${personAction}`;
    const res = await axios.post(url, personData);
    console.log("Response:", res.data);
  } catch (err) {
    console.error(err);
  }
};

const validatePlace = (data, placeAction) => {
  console.log(data);
  const errors = {};

  if (placeAction === "add") {
    if (!data.name || typeof data.name !== "string") {
      errors.name = "Naziv mesta mora biti unet.";
    } else if (data.name.length < 2 || data.name.length > 30) {
      errors.name = "Naziv mesta mora imati između 2 i 30 karaktera.";
    }

    const postalCode = parseInt(data.postalCode, 10);
    if (isNaN(postalCode)) {
      errors.postalCode = "Poštanski broj mora biti broj.";
    } else if (postalCode < 11000 || postalCode > 39660) {
      errors.postalCode = "Poštanski broj mora biti između 11000 i 39660.";
    }

    if (data.population !== "" && data.population !== null) {
      const population = parseInt(data.population, 10);
      if (isNaN(population)) {
        errors.population = "Populacija mora biti broj.";
      } else if (population < 0 || population > 2000000) {
        errors.population = "Populacija mora biti između 0 i 2000000.";
      }
    }
  } else if (placeAction === "delete") {
    const postalCode = parseInt(data.postalCode, 10);
    if (isNaN(postalCode)) {
      errors.postalCode = "Poštanski broj mora biti broj.";
    } else if (postalCode < 11000 || postalCode > 39660) {
      errors.postalCode = "Poštanski broj mora biti između 11000 i 39660.";
    }
  } else if (placeAction === "update") {
    const postalCode = parseInt(data.postalCode, 10);
    if (isNaN(postalCode)) {
      errors.postalCode = "Poštanski broj mora biti broj.";
    } else if (postalCode < 11000 || postalCode > 39660) {
      errors.postalCode = "Poštanski broj mora biti između 11000 i 39660.";
    }

    if (data.population === "" || data.population === null) {
      errors.population = "Populacija mora biti uneta.";
    } else {
      const population = parseInt(data.population, 10);
      if (isNaN(population)) {
        errors.population = "Populacija mora biti broj.";
      } else if (population < 0 || population > 2000000) {
        errors.population = "Populacija mora biti između 0 i 2000000.";
      }
    }
  }
  return errors;
};

  const handleSubmitPlace = async () => {
    const validationErrors = validatePlace(placeData, placeAction);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Slanje mesta:", placeData);
    try {
      const url = "http://localhost:8080/city";
      const res = await axios.post(url, {
        ...placeData,
        postalCode: parseInt(placeData.postalCode, 10),
        population: placeData.population ? parseInt(placeData.population, 10) : null
      });
      setErrors({});
      console.log("Response:", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlace = async () => {
    const validationErrors = validatePlace(placeData, placeAction);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Brisanje mesta:", placeData);
    try {
      const postalCode = parseInt(placeData.postalCode, 10);
      const url = `http://localhost:8080/city/${postalCode}`;

      const res = await axios.delete(url);
      setErrors({});
      console.log("Response:", res.data);
    } catch (err) {
      console.error(err);
    }
  }; 

  const handleUpdatePlace = async() => {
    const validationErrors = validatePlace(placeData, placeAction);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Izmena mesta: ", placeData);
    try {
      const url = "http://localhost:8080/city";

      const res = await axios.put(url, {
        ...placeData,
        postalCode: parseInt(placeData.postalCode, 10),
        population: placeData.population ? parseInt(placeData.population, 10) : null
      });

      setErrors({});
      console.log("Response:", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <button onClick={() => setActiveTab("person")}>Osoba</button>
        <button onClick={() => setActiveTab("place")}>Mesto</button>
      </div>

      <hr />

      {/* TAB OSOBA */}
      {activeTab === "person" && (
        <div>
          <h2>Podaci o osobi</h2>

          <label style={{ fontWeight: "bold" }}>
            Izaberite akciju:
          </label>
          <br />
          <br />
          
          <select value={personAction} onChange={(e) => setPersonAction(e.target.value)} style={selectStyle}>
            <option value="add">Dodaj novu osobu</option>
            <option value="delete">Obriši osobu</option>
            <option value="update">Izmeni osobu</option>
          </select>

          {personAction === "add" && (
            <>
              <input style={inputStyle} placeholder="Ime" value={personData.firstName} onChange={(e) => setPersonData({ ...personData, firstName: e.target.value })} />
              <input style={inputStyle} placeholder="Prezime" value={personData.lastName} onChange={(e) => setPersonData({ ...personData, lastName: e.target.value })} />
              <input style={inputStyle} type="date" placeholder="Datum rođenja" value={personData.dateOfBirth} onChange={(e) => setPersonData({ ...personData, dateOfBirth: e.target.value })} />
              <input style={inputStyle} placeholder="JMBG" value={personData.uniqueIdentificationNumber} onChange={(e) => setPersonData({ ...personData, uniqueIdentificationNumber: e.target.value })} />
              <input style={inputStyle} placeholder="Mesto rođenja" value={personData.cityBirthName} onChange={(e) => setPersonData({ ...personData, cityBirthName: e.target.value })} />
              <input style={inputStyle} placeholder="Mesto u kojem živi" value={personData.cityResidenceName} onChange={(e) => setPersonData({ ...personData, cityResidenceName: e.target.value })} />
            </>
          )}

          {personAction === "delete" && (
            <input style={inputStyle} placeholder="JMBG" value={personData.uniqueIdentificationNumber} onChange={(e) => setPersonData({ ...personData, uniqueIdentificationNumber: e.target.value })} />
          )}

          {personAction === "update" && (
            <>
              <input style={inputStyle} placeholder="JMBG" value={personData.uniqueIdentificationNumber} onChange={(e) => setPersonData({ ...personData, uniqueIdentificationNumber: e.target.value })} />
              <input style={inputStyle} placeholder="Mesto u kojem živi" value={personData.cityResidenceName} onChange={(e) => setPersonData({ ...personData, cityResidenceName: e.target.value })} />
            </>
          )}

          <button onClick={handleSubmitPerson} style={buttonStyle}>Pošalji</button>

          {/* Dugme za prikaz svih osoba */}
          <button onClick={fetchAllPersons} style={buttonStyle}>
            Prikaži sve osobe
          </button>

          {showAllPersons && (
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
          )}
        </div>
      )}

      {/* TAB MESTO */}
      {activeTab === "place" && (
        <div>
          <h2>Podaci o mestu</h2>
          <label style={{ fontWeight: "bold" }}>
            Izaberite akciju:
          </label>
          <br />
          <br />

          <select value={placeAction} onChange={(e) => setPlaceAction(e.target.value)} style={selectStyle}>
            <option value="add">Dodaj novo mesto</option>
            <option value="delete">Obriši mesto</option>
            <option value="update">Izmeni populaciju u mestu</option>
          </select>

           {placeAction === "add" && (
            <>
              <input style={inputStyle} placeholder="Naziv" value={placeData.name} onChange={(e) => setPlaceData({ ...placeData, name: e.target.value })} />
              {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
              <input style={inputStyle} placeholder="Poštanski broj" value={placeData.postalCode} onChange={(e) => setPlaceData({ ...placeData, postalCode: e.target.value })} />
              {errors.postalCode && <div style={{ color: "red" }}>{errors.postalCode}</div>}
              <input style={inputStyle}  placeholder="Populacija rođenja" value={placeData.population} onChange={(e) => setPlaceData({ ...placeData, population: e.target.value })} />
            {errors.population && (
              <div style={{ color: "red" }}>{errors.population}</div>
        )}
            </>
          )}

          {placeAction === "delete" && (
            <>
              <input style={inputStyle} placeholder="Poštanski broj" value={placeData.postalCode} onChange={(e) => setPlaceData({ ...placeData, postalCode: e.target.value })} />
              {errors.postalCode && <div style={{ color: "red" }}>{errors.postalCode}</div>}
            </>
          )}

        {placeAction === "update" && (
            <>
              <input style={inputStyle} placeholder="Poštanski broj" value={placeData.postalCode} onChange={(e) => setPlaceData({ ...placeData, postalCode: e.target.value })} />
              {errors.postalCode && <div style={{ color: "red" }}>{errors.postalCode}</div>}
              <input style={inputStyle}  placeholder="Populacija u mestu" value={placeData.population} onChange={(e) => setPlaceData({ ...placeData, population: e.target.value })} />
            {errors.population && (
              <div style={{ color: "red" }}>{errors.population}</div>
        )}
            </>
          )}
          
        <button
          onClick={
            placeAction === "add"
              ? handleSubmitPlace
              : placeAction === "delete"
              ? handleDeletePlace
              : handleUpdatePlace
          }
          style={buttonStyle}
        >
          Pošalji
        </button>

          <button onClick={fetchAllPlaces} style={buttonStyle}>
            Prikaži sva mesta
          </button>

          {showAllPlaces && (
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
          )}
        </div>
      )}
    </div>
  );
}

export default App;