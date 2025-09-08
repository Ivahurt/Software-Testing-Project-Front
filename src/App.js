import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import sr from "date-fns/locale/sr";

registerLocale("sr", sr);

function App() {
  const [activeTab, setActiveTab] = useState("person");
  const [personAction, setPersonAction] = useState("add");
  const [showAllPersons, setShowAllPersons] = useState(false);

  const [placeAction, setPlaceAction] = useState("add")
  const [showAllPlaces, setShowAllPlaces] = useState(false);
  const [errors, setErrors] = useState({});

  const [personApiError, setPersonApiError] = useState("");
  const [personApiSuccess, setPersonApiSuccess] = useState("");
  const [placeApiError, setPlaceApiError] = useState("");
  const [placeApiSuccess, setPlaceApiSuccess] = useState("");

  const [personData, setPersonData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    uniqueIdentificationNumber: "",
    cityBirthName: "",
    cityResidenceName: "",
    payment: null,
    paymentDate: null
  });

  const [placeData, setPlaceData] = useState({
    name: "",
    postalCode: "",
    population: "",
  });

  useEffect(() => {
    if (personApiSuccess) {
      const timer = setTimeout(() => {
        setPersonApiSuccess("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [personApiSuccess]);

  useEffect(() => {
    if (placeApiSuccess) {
      const timer = setTimeout(() => {
        setPlaceApiSuccess("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [placeApiSuccess]);

  const [personList, setPersonList] = useState([]);
  const [placeList, setPlaceList] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [residenceHistory, setResidenceHistory] = useState([]);

  const paymentReasons = ["Školarina", "Renta", "Praksa", "Plata"];

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
      console.log("Response:", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllPersons();
    fetchAllPlaces();
  }, []);

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
    } else if (personAction === 'payment') {
      if (!data.selectedPerson) {
        errors.selectedPerson = "Morate izabrati osobu.";
      }

      if (!data.payment) {
        errors.payment = "Iznos isplate mora biti unet.";
      } else if (!/^[0-9]+$/.test(data.payment)) {
        errors.payment = "Iznos isplate mora biti celobrojan broj.";
      }

      if (!data.reason || data.reason.trim() === "") {
        errors.reason = "Morate izabrati razlog isplate.";
      }

      if (!data.paymentDate) {
        errors.paymentDate = "Datum mora biti unet.";
      } else {
        const today = new Date();
        const enteredDate = new Date(data.dateOfBirth);

        today.setHours(0, 0, 0, 0);

        if (isNaN(enteredDate.getTime())) {
          errors.paymentDate = "Neispravan format datuma.";
        } else if (enteredDate > today) {
          errors.paymentDate = "Datum isplate ne može biti u budućnosti.";
        }
      }
    }


    return errors;
  };

  const handleSubmitPerson = async () => {
    setPersonApiError("");
    setPersonApiSuccess("");

    const validationErrors = validatePerson(personData, personAction);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

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
      setPersonApiSuccess("Osoba je uspešno dodata.");

    } catch (err) {
      if (err.response && err.response.data) {
        setPersonApiError(err.response.data.message || "Došlo je do greške na serveru.");
      } else {
        setPersonApiError("Server nije dostupan.");
      }
    }
  };

  const handleDeletePerson = async () => {
    setPersonApiError("");
    setPersonApiSuccess("");

    const validationErrors = validatePerson(personData, personAction);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const uniqueId = parseInt(personData.uniqueIdentificationNumber, 10);
      const url = `http://localhost:8080/person/${uniqueId}`;
      const res = await axios.delete(url);
      resetForm();
      setPersonApiSuccess("Osoba je uspešno obrisana.");

    } catch (err) {
      if (err.response && err.response.data) {
        setPersonApiError(err.response.data.message || "Došlo je do greške na serveru.");
      } else {
        setPersonApiError("Server nije dostupan.");
      }
    }
  };

  const handleUpdatePerson = async () => {
    setPersonApiError("");
    setPersonApiSuccess("");

    const validationErrors = validatePerson(personData, personAction);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const url = "http://localhost:8080/person";
      const res = await axios.put(url, {
        uniqueIdentificationNumber: Number(personData.uniqueIdentificationNumber),
        cityResidenceName: personData.cityResidenceName
      });

      resetForm();
      setPersonApiSuccess('Osoba je uspešno ažurirana');
    } catch (err) {
      if (err.response && err.response.data) {
        setPersonApiError(err.response.data.message || "Došlo je do greške na serveru.");
      } else {
        setPersonApiError("Server nije dostupan.");
      }
    }
  };


  const handleGetPersonResidence = async (uniqueId) => {
    setPersonApiError("");
    setPersonApiSuccess("");

    try {
      const url = `http://localhost:8080/person/${uniqueId}`;
      const res = await axios.get(url);

      setResidenceHistory(res.data);
      setPersonApiSuccess("Isorija prebivališta je uspešno učitana");
    } catch (err) {
      if (err.response && err.response.data) {
        setPersonApiError(err.response.data.message || "Došlo je do greške na serveru.");
      } else {
        setPersonApiError("Server nije dostupan.");
      }
    }
  };

  const handlePersonPayment = async () => {
    setPersonApiError("");
    setPersonApiSuccess("");

    const validationErrors = validatePerson(personData, personAction);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }


  }


  const validatePlace = (data, placeAction) => {
    const errors = {};

    if (placeAction === "add") {
      if (!data.name || typeof data.name !== "string") {
        errors.name = "Naziv mesta mora biti unet.";
      } else if (data.name.length < 2 || data.name.length > 30) {
        errors.name = "Naziv mesta mora imati između 2 i 30 karaktera.";
      } else if (!/^[A-Za-zČĆŽŠĐčćžšđ\s]+$/.test(data.name)) {
        errors.name = "Naziv mesta može sadržati samo slova.";
      } else if (!/^[A-ZČĆŽŠĐ]/.test(data.name)) {
        errors.name = "Naziv mesta mora početi velikim slovom.";
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
    setPlaceApiError("");
    setPlaceApiSuccess("");

    const validationErrors = validatePlace(placeData, placeAction);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const url = "http://localhost:8080/city";
      const res = await axios.post(url, {
        ...placeData,
        postalCode: parseInt(placeData.postalCode, 10),
        population: placeData.population ? parseInt(placeData.population, 10) : null
      });
      resetForm();
      setPlaceApiSuccess("Mesto je uspešno dodato.")
    } catch (err) {
      if (err.response && err.response.data) {
        setPlaceApiError(err.response.data.message || "Došlo je do greške na serveru.");
      } else {
        setPlaceApiError("Server nije dostupan.");
      }
    }

  };

  const handleDeletePlace = async () => {
    setPlaceApiError("");
    setPlaceApiSuccess("");

    const validationErrors = validatePlace(placeData, placeAction);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const postalCode = parseInt(placeData.postalCode, 10);
      const url = `http://localhost:8080/city/${postalCode}`;

      const res = await axios.delete(url);
      resetForm();
      setPlaceApiSuccess("Mesto je uspešno obrisano");
    } catch (err) {
      if (err.response && err.response.data) {
        setPlaceApiError(err.response.data.message || "Došlo je do greške na serveru.");
      } else {
        setPlaceApiError("Server nije dostupan.");
      }
    }
  };

  const handleUpdatePlace = async () => {
    setPlaceApiError("");
    setPlaceApiSuccess("");

    const validationErrors = validatePlace(placeData, placeAction);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const url = "http://localhost:8080/city";

      const res = await axios.put(url, {
        ...placeData,
        postalCode: parseInt(placeData.postalCode, 10),
        population: placeData.population ? parseInt(placeData.population, 10) : null
      });

      resetForm();
      setPlaceApiSuccess("Osoba je uspešno izmenjena.")
    } catch (err) {
      if (err.response && err.response.data) {
        setPlaceApiError(err.response.data.message || "Došlo je do greške na serveru.");
      } else {
        setPlaceApiError("Server nije dostupan.");
      }
    }
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

      {/* TAB PERSON */}
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
            <option value="residence">Prikaz istorijata stanovanja</option>
            <option value="payment">Dodaj isplatu za osobu</option>
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

              <DatePicker
                selected={personData.dateOfBirth ? new Date(personData.dateOfBirth) : null}
                onChange={(date) =>
                  setPersonData({
                    ...personData,
                    dateOfBirth: date ? date.toISOString().split("T")[0] : "",
                  })
                }
                dateFormat="dd.MM.yyyy"
                placeholderText="Datum rođenja"
                locale="sr"
                customInput={<input style={inputStyle} />}
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

          {personAction === 'residence' && (
            <>
              <select
                value={selectedPerson}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setSelectedPerson(selectedId);

                  if (selectedId) {
                    handleGetPersonResidence(selectedId);
                  }
                }}
                style={selectStyle}
              >
                <option value="">-- Izaberi osobu --</option>
                {personList.map((person) => (
                  <option key={person.id} value={person.uniqueIdentificationNumber}>
                    {person.firstName} {person.lastName}
                  </option>
                ))}
              </select>

              {residenceHistory.length > 0 && (
                <table border="1" cellPadding="10" style={{ marginTop: "20px", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th>Ime</th>
                      <th>Prezime</th>
                      <th>Mesto prebivališta</th>
                      <th>Datum od</th>
                      <th>Datum do</th>
                    </tr>
                  </thead>
                  <tbody>
                    {residenceHistory.map((h, index) => (
                      <tr key={index}>
                        <td>{h.firstName}</td>
                        <td>{h.lastName}</td>
                        <td>{h.cityResidenceName}</td>
                        <td>{h.residenceStart}</td>
                        <td>{h.residenceEnd || "Trenutno"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            </>
          )}

          {personAction === 'payment' && (
            <>
              <select
                value={selectedPerson}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setSelectedPerson(selectedId);

                  setPersonData({ ...personData, selectedPerson: selectedId });

                  if (selectedId) {
                    handleGetPersonResidence(selectedId);
                  }
                }}
                style={selectStyle}
              >
                <option value="">-- Izaberi osobu --</option>
                {personList.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.firstName} {person.lastName}
                  </option>
                ))}
              </select>
              {errors.selectedPerson && (
                <div style={{ color: "red" }}>{errors.selectedPerson}</div>
              )}

              <input
                style={inputStyle}
                placeholder="Isplata"
                value={personData.payment}
                onChange={(e) =>
                  setPersonData({ ...personData, payment: e.target.value })
                }
              />
              {errors.payment && (
                <div style={{ color: "red" }}>{errors.payment}</div>
              )}

              <select
                value={personData.reason || ""}
                onChange={(e) =>
                  setPersonData({ ...personData, reason: e.target.value })
                }
                style={selectStyle}
              >
                <option value="">-- Izaberi razlog --</option>
                {paymentReasons.map((reason, index) => (
                  <option key={index} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              {errors.reason && (
                <div style={{ color: "red" }}>{errors.reason}</div>
              )}

              <DatePicker
                selected={personData.paymentDate ? new Date(personData.paymentDate) : null}
                onChange={(date) =>
                  setPersonData({
                    ...personData,
                    paymentDate: date ? date.toISOString().split("T")[0] : "",
                  })
                }
                dateFormat="dd.MM.yyyy"
                placeholderText="Datum isplate"
                locale="sr"
                customInput={<input style={inputStyle} />}
              />
              {errors.paymentDate && (
                <div style={{ color: "red" }}>{errors.paymentDate}</div>
              )}
              <br />
            </>
          )}

          <button
            onClick={
              personAction === "add"
                ? handleSubmitPerson
                : personAction === "delete"
                  ? handleDeletePerson
                  : personAction === "update"
                    ? handleUpdatePerson
                    : personAction === "payment"
                      ? handlePersonPayment
                      : () => { }
            }
            style={buttonStyle}
          >
            Pošalji
          </button>

          {personApiError && <div style={{ color: "red", marginTop: "10px" }}>{personApiError}</div>}
          {personApiSuccess && <div style={{ color: "green", marginTop: "10px" }}>{personApiSuccess}</div>}

          <button
            onClick={() => {
              fetchAllPersons();
              setShowAllPersons(true);
            }}
            style={buttonStyle}
          >
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

      {/* TAB PLACE */}
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

          {placeApiError && <div style={{ color: "red", marginTop: "10px" }}>{placeApiError}</div>}
          {placeApiSuccess && <div style={{ color: "green", marginTop: "10px" }}>{placeApiSuccess}</div>}

          <button
            onClick={() => {
              fetchAllPlaces();
              setShowAllPlaces(true);
            }}
            style={buttonStyle}
          >
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