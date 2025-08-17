import React, { useState, useEffect } from "react";
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


  const tabContainerStyle = {
    padding: "20px",
    margin: "20px 0",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    fontSize: "18px",
    fontWeight: "bold",
    lineHeight: "2",
  };

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

  useEffect(() => {
    if (activeTab === "person") {
      fetchAllPlaces();
    }
  }, [activeTab]);



  const validatePerson = (data, personAction) => {
    const errors = {};

    if (personAction === 'add') {
      if (!data.firstName || typeof data.firstName !== "string") {
        errors.firstName = "Ime mora biti uneto.";
      } else if (data.firstName.length < 2 || data.firstName.length > 30) {
        errors.firstName = "Ime mora biti između 2 i 30 karaktera.";
      } else if (!/^[A-ZČĆŠŽĐ][a-zčćšžđ]{1,}$/.test(data.firstName)) {
        errors.firstName = "Ime mora početi velikim slovom i sadržati samo mala slova nakon toga.";
      }

      if (!data.lastName || typeof data.lastName !== "string") {
        errors.lastName = "Prezime mora biti uneto.";
      } else if (data.lastName.length < 2 || data.lastName.length > 30) {
        errors.lastName = "Prezime mora biti između 2 i 30 karaktera.";
      } else if (!/^[A-ZČĆŠŽĐ][a-zčćšžđ]{1,}$/.test(data.lastName)) {
        errors.lastName = "Prezime mora početi velikim slovom i sadržati samo mala slova nakon toga.";
      }

      if (!data.dateOfBirth) {
        errors.dateOfBirth = "Datum rođenja mora biti unet.";
      } else {
        const today = new Date();
        const enteredDate = new Date(data.dateOfBirth);

        today.setHours(0, 0, 0, 0);

        if (isNaN(enteredDate.getTime())) {
          errors.dateOfBirth = "Neispravan format datuma.";
        } else if (enteredDate > today) {
          errors.dateOfBirth = "Datum rođenja ne može biti u budućnosti.";
        }
      }

      if (!data.uniqueIdentificationNumber) {
        errors.uniqueIdentificationNumber = "JMBG mora biti unet.";
      } else if (!/^[0-9]+$/.test(data.uniqueIdentificationNumber)) {
        errors.uniqueIdentificationNumber = "JMBG može sadržati samo brojeve.";
      } else if (data.uniqueIdentificationNumber.length !== 13) {
        errors.uniqueIdentificationNumber = "JMBG mora imati tačno 13 cifara.";
      }

      if (!data.cityBirthName || data.cityBirthName.trim() === "") {
        errors.cityBirthName = "Morate izabrati mesto rođenja.";
      }

      if (!data.cityResidenceName || data.cityResidenceName.trim() === "") {
        errors.cityResidenceName = "Morate izabrati mesto prebivališta.";
      }
    } else if (personAction === 'delete') {
      if (!data.uniqueIdentificationNumber) {
        errors.uniqueIdentificationNumber = "JMBG mora biti unet.";
      } else if (!/^[0-9]+$/.test(data.uniqueIdentificationNumber)) {
        errors.uniqueIdentificationNumber = "JMBG može sadržati samo brojeve.";
      } else if (data.uniqueIdentificationNumber.length !== 13) {
        errors.uniqueIdentificationNumber = "JMBG mora imati tačno 13 cifara.";
      }
    } else if (personAction === 'update') {

      if (!data.uniqueIdentificationNumber) {
        errors.uniqueIdentificationNumber = "JMBG mora biti unet.";
      } else if (!/^[0-9]+$/.test(data.uniqueIdentificationNumber)) {
        errors.uniqueIdentificationNumber = "JMBG može sadržati samo brojeve.";
      } else if (data.uniqueIdentificationNumber.length !== 13) {
        errors.uniqueIdentificationNumber = "JMBG mora imati tačno 13 cifara.";
      }

      if (!data.cityResidenceName || data.cityResidenceName.trim() === "") {
        errors.cityResidenceName = "Morate izabrati mesto prebivališta.";
      }
    }

    return errors;
  };

  const handleSubmitPerson = async () => {
    console.log("Fja dodavanja osobe");
    const validationErrors = validatePerson(personData, personAction);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('Slanje osobe: ', personData);
    try {
      const url = "http://localhost:8080/person";
      const res = await axios.post(url, {
        firstName: personData.firstName,
        lastName: personData.lastName,
        dateOfBirth: personData.dateOfBirth,
        uniqueIdentificationNumber: parseInt(personData.uniqueIdentificationNumber, 10),
        cityBirthName: personData.cityBirthName,
        cityResidenceName: personData.cityResidenceName
      });
      resetForm();
      console.log("Response:", res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePerson = async () => {
    console.log("Fja brisanja osobe");
    const validationErrors = validatePerson(personData, personAction);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('Brisanje osobe: ', personData);
    try {
      const uniqueId = parseInt(personData.uniqueIdentificationNumber, 10);
      const url = `http://localhost:8080/person/${uniqueId}`;

      const res = await axios.delete(url);
      resetForm();
      console.log("Response:", res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdatePerson = async () => {
    const validationErrors = validatePerson(personData, personAction);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('Ažuriranje osobe: ', personData)
    try {
      const url = "http://localhost:8080/person";

      const res = await axios.put(url, {
        uniqueIdentificationNumber: Number(personData.uniqueIdentificationNumber),
        cityResidenceName: personData.cityResidenceName
      });

      resetForm();
      console.log("Response:", res.data);
    } catch (err) {
      console.log(err);
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


  const resetForm = () => {
    setPersonData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      uniqueIdentificationNumber: "",
      cityBirthName: "",
      cityResidenceName: ""
    });
    setPlaceData({
      name: "",
      postalCode: "",
      population: ""
    });
    setErrors({});
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
      resetForm();
      console.log("Response:", res.data);
    } catch (err) {
      console.log(err);
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
      resetForm();
      console.log("Response:", res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdatePlace = async () => {
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

      resetForm();
      console.log("Response:", res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <div>
        <button style={buttonStyle} onClick={() => setActiveTab("person")}>Osoba</button>
        <button style={buttonStyle} nClick={() => setActiveTab("place")}>Mesto</button>
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
              <input
                style={inputStyle}
                placeholder="Ime"
                value={personData.firstName}
                onChange={(e) =>
                  setPersonData({ ...personData, firstName: e.target.value })
                }
              />
              {errors.firstName && <div style={{ color: "red" }}>{errors.firstName}</div>}

              <input
                style={inputStyle}
                placeholder="Prezime"
                value={personData.lastName}
                onChange={(e) =>
                  setPersonData({ ...personData, lastName: e.target.value })
                }
              />
              {errors.lastName && <div style={{ color: "red" }}>{errors.lastName}</div>}

              <input
                style={inputStyle}
                type="date"
                placeholder="Datum rođenja"
                value={personData.dateOfBirth}
                onChange={(e) =>
                  setPersonData({ ...personData, dateOfBirth: e.target.value })
                }
              />
              {errors.dateOfBirth && (
                <div style={{ color: "red" }}>{errors.dateOfBirth}</div>
              )}

              <input
                style={inputStyle}
                placeholder="JMBG"
                value={personData.uniqueIdentificationNumber}
                onChange={(e) =>
                  setPersonData({
                    ...personData,
                    uniqueIdentificationNumber: e.target.value,
                  })
                }
              />
              {errors.uniqueIdentificationNumber && (
                <div style={{ color: "red" }}>{errors.uniqueIdentificationNumber}</div>
              )}

              <select
                style={selectStyle}
                value={personData.cityBirthName}
                onChange={(e) => setPersonData({ ...personData, cityBirthName: e.target.value })}
              >
                <option value="">Izaberite mesto rođenja</option>
                {placeList.map((place, index) => (
                  <option key={index} value={place.name}>
                    {place.name}
                  </option>
                ))}
              </select>
              {errors.cityBirthName && (
                <div style={{ color: "red" }}>{errors.cityBirthName}</div>
              )}

              <select
                style={selectStyle}
                value={personData.cityResidenceName}
                onChange={(e) => setPersonData({ ...personData, cityResidenceName: e.target.value })}
              >
                <option value="">Izaberite mesto u kojem živi</option>
                {placeList.map((place, index) => (
                  <option key={index} value={place.name}>
                    {place.name}
                  </option>
                ))}
              </select>
              {errors.cityResidenceName && (
                <div style={{ color: "red" }}>{errors.cityResidenceName}</div>
              )}
            </>
          )}

          {personAction === "delete" && (
            <>
              <input
                style={inputStyle}
                placeholder="JMBG"
                value={personData.uniqueIdentificationNumber}
                onChange={(e) =>
                  setPersonData({
                    ...personData,
                    uniqueIdentificationNumber: e.target.value,
                  })
                }
              />
              {errors.uniqueIdentificationNumber && (
                <div style={{ color: "red" }}>{errors.uniqueIdentificationNumber}</div>
              )}
            </>
          )}

          {personAction === "update" && (
            <>
              <input
                style={inputStyle}
                placeholder="JMBG"
                value={personData.uniqueIdentificationNumber}
                onChange={(e) =>
                  setPersonData({
                    ...personData,
                    uniqueIdentificationNumber: e.target.value,
                  })
                }
              />
              {errors.uniqueIdentificationNumber && (
                <div style={{ color: "red" }}>{errors.uniqueIdentificationNumber}</div>
              )}

              <select
                style={selectStyle}
                value={personData.cityResidenceName}
                onChange={(e) => setPersonData({ ...personData, cityResidenceName: e.target.value })}
              >
                <option value="">Novo mesto prebivališta</option>
                {placeList.map((place, index) => (
                  <option key={index} value={place.name}>
                    {place.name}
                  </option>
                ))}
              </select>
              {errors.cityResidenceName && (
                <div style={{ color: "red" }}>{errors.cityResidenceName}</div>
              )}
            </>
          )}

          <button
            onClick={
              personAction === "add"
                ? handleSubmitPerson
                : personAction === "delete"
                  ? handleDeletePerson
                  : handleUpdatePerson
            }
            style={buttonStyle}
          >
            Pošalji
          </button>

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
              <input style={inputStyle} placeholder="Populacija u mestu" value={placeData.population} onChange={(e) => setPlaceData({ ...placeData, population: e.target.value })} />
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
              <input style={inputStyle} placeholder="Populacija u mestu" value={placeData.population} onChange={(e) => setPlaceData({ ...placeData, population: e.target.value })} />
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