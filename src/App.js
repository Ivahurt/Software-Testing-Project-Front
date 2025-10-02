import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import sr from "date-fns/locale/sr";

registerLocale("sr", sr);

function App({ onLogout }) {
  const [showConfirm, setShowConfirm] = useState(false);

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

  const defaultPersonData = {
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    ageInMonths1: null,
    sumOfPayments: null,
    uniqueIdentificationNumber: "",
    cityBirthName: "",
    cityResidenceName: "",
    payment: null,
    paymentDate: null,
    paymentReason: null
  };


  const [personData, setPersonData] = useState(defaultPersonData);

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

  useEffect(() => {
    if (personData.ageInMonths1 !== null || personData.sumOfPayments !== null) {
      const timer = setTimeout(() => {
        setPersonData(defaultPersonData);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [personData.ageInMonths1, personData.sumOfPayments]);

  const [personList, setPersonList] = useState([]);
  const [placeList, setPlaceList] = useState([]);
  const [userList, setUserList] = useState([]);

  const [userAction, setUserAction] = useState("get")

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [residenceHistory, setResidenceHistory] = useState([]);

  const paymentReasons = ["Školarina", "Renta", "Praksa", "Plata"];

  const [personPayments, setPersonPayments] = useState([]);

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
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const url = "http://localhost:8080/users/";
      const res = await axios.get(url);
      setUserList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllPersons();
    fetchAllPlaces();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (activeTab === "person") {
      fetchAllPlaces();
    }
  }, [activeTab]);

  useEffect(() => {
    if (userAction === "get") {
      fetchAllUsers();
    }
  }, [userAction]);

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
      if (!data.id) {
        errors.id = "Morate izabrati osobu.";
      }

      if (!data.payment) {
        errors.payment = "Iznos isplate mora biti unet.";
      } else if (!/^[0-9]+$/.test(data.payment)) {
        errors.payment = "Iznos isplate mora biti celobrojan broj.";
      }

      if (!data.paymentReason || data.paymentReason.trim() === "") {
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
        sumOfPayments: 0,
        uniqueIdentificationNumber: parseInt(personData.uniqueIdentificationNumber, 10),
        cityBirthName: personData.cityBirthName,
        cityResidenceName: personData.cityResidenceName
      });
      resetForm();
      setPersonApiSuccess("Osoba je uspešno dodata.");

      setShowAllPersons(false);
      fetchAllPersons();
    } catch (err) {
      if (err.response && err.response.data) {
        setPersonApiError(err.response.data.message || "Došlo je do greške na serveru.");
      } else {
        setPersonApiError("Server nije dostupan.");
      }

      setTimeout(() => {
        setPersonApiError("");
      }, 3000);
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

      setShowAllPersons(false);
      fetchAllPersons();
    } catch (err) {
      if (err.response && err.response.data) {
        setPersonApiError(err.response.data.message || "Došlo je do greške na serveru.");
      } else {
        setPersonApiError("Server nije dostupan.");
      }

      setTimeout(() => {
        setPersonApiError("");
      }, 3000);
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

      setShowAllPersons(false);
      fetchAllPersons();
    } catch (err) {
      if (err.response && err.response.data) {
        setPersonApiError(err.response.data.message || "Došlo je do greške na serveru.");
      } else {
        setPersonApiError("Server nije dostupan.");
      }

      setTimeout(() => {
        setPersonApiError("");
      }, 3000);
    }
  };


  const handleGetPersonResidence = async (uniqueId) => {
    setPersonApiError("");
    setPersonApiSuccess("");

    try {
      const url = `http://localhost:8080/person/${uniqueId}`;
      const res = await axios.get(url);

      resetForm();
      setResidenceHistory(res.data);
      setPersonApiSuccess("Isorija prebivališta je uspešno učitana");

    } catch (err) {
      if (err.response && err.response.data) {
        setPersonApiError(err.response.data.message || "Došlo je do greške na serveru.");
      } else {
        setPersonApiError("Server nije dostupan.");
      }

      setTimeout(() => {
        setPersonApiError("");
      }, 3000);
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

    console.log(personData);
    try {
      const url = "http://localhost:8080/person/payment";
      const res = await axios.post("http://localhost:8080/person/payment", {
        uniqueIdentificationNumber: Number(personData.uniqueIdentificationNumber),
        amount: Number(personData.payment),
        reason: personData.paymentReason,
        paymentDate: personData.paymentDate
      });

      resetForm();
      setPersonApiSuccess('Isplata je uspešno dodata');

      setShowAllPersons(false);
      fetchAllPersons();
    } catch (err) {
      if (err.response && err.response.data) {
        setPersonApiError(err.response.data.message || "Došlo je do greške na serveru.");
      } else {
        setPersonApiError("Server nije dostupan.");
      }
      setTimeout(() => {
        setPersonApiError("");
      }, 3000);
    }
  }

  const handleGetPersonPayments = async (uniqueId) => {
    setPersonApiError("");
    setPersonApiSuccess("");

    try {
      console.log("Funkcija za vracanje svih isplata za osobu");

      const url = `http://localhost:8080/person/payment/${uniqueId}`;
      const res = await axios.get(url);
      console.log(res.data)

      resetForm();
      setPersonPayments(res.data);
      setPersonApiSuccess("Isorija isplate je uspešno učitana");
      console.log(personPayments);
    } catch (err) {
      if (err.response && err.response.data) {
        setPersonApiError(err.response.data.message || "Došlo je do greške na serveru.");
      } else {
        setPersonApiError("Server nije dostupan.");
      }

      setTimeout(() => {
        setPersonApiError("");
      }, 3000);
    }
  };


  const handleGetPersonAge = async (uniqueId) => {
    setPersonApiError("");
    setPersonApiSuccess("");

    try {
      const url = `http://localhost:8080/person/age/${uniqueId}`;
      const res = await axios.get(url);

      resetForm();
      setPersonData(res.data);
      setPersonApiSuccess("Starost je uspešno učitana");
    } catch (err) {
      if (err.response && err.response.data) {
        setPersonApiError(err.response.data.message || "Došlo je do greške na serveru.");
      } else {
        setPersonApiError("Server nije dostupan.");
      }

      setTimeout(() => {
        setPersonApiError("");
      }, 3000);
    }
  };



  const handleGetPersonSumOfPayments = async (uniqueId) => {
    setPersonApiError("");
    setPersonApiSuccess("");

    try {
      console.log('Funkcija za prikaz ukupne isplate osobe');

      const url = `http://localhost:8080/person/sum-payments/${uniqueId}`;
      const res = await axios.get(url);

      resetForm();
      setPersonData(res.data);
      setPersonApiSuccess("Ukupna isplata je uspešno učitana");
    } catch (err) {
      if (err.response && err.response.data) {
        setPersonApiError(err.response.data.message || "Došlo je do greške na serveru.");
      } else {
        setPersonApiError("Server nije dostupan.");
      }

      setTimeout(() => {
        setPersonApiError("");
      }, 3000);
    }
  };




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
    setPersonData(defaultPersonData);

    setPlaceData({
      name: "",
      postalCode: "",
      population: ""
    });

    setErrors({});
    setSelectedPerson(null);
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

      setTimeout(() => {
        setPlaceApiError("");
      }, 3000);
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

      setTimeout(() => {
        setPlaceApiError("");
      }, 3000);
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

      setTimeout(() => {
        setPlaceApiError("");
      }, 3000);
    }
  };

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

        <button
          style={{
            ...buttonStyle,
            backgroundColor: activeTab === "users" ? "black" : "white",
            color: activeTab === "users" ? "white" : "black",
          }}
          onClick={() => setActiveTab("users")}
        >
          Korisnici
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
            <option value="payment_histories">Prikaz svih isplata za osobu</option>
            <option value="age">Prikaz starosti izražen u mesecima</option>
            <option value="sum_of_payments">Prikaz ukupne isplate za osobu</option>

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

                  const selectedPersonObj = personList.find(
                    (person) => person.id.toString() === selectedId
                  );

                  if (selectedPersonObj) {
                    setPersonData({
                      ...personData,
                      id: selectedPersonObj.id,
                      firstName: selectedPersonObj.firstName,
                      lastName: selectedPersonObj.lastName,
                      dateOfBirth: selectedPersonObj.dateOfBirth,
                      uniqueIdentificationNumber: selectedPersonObj.uniqueIdentificationNumber,
                      cityBirthName: selectedPersonObj.cityBirthName,
                      cityResidenceName: selectedPersonObj.cityResidenceName,
                    });
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
              {errors.id && (
                <div style={{ color: "red" }}>{errors.id}</div>
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
                value={personData.paymentReason || ""}
                onChange={(e) =>
                  setPersonData({ ...personData, paymentReason: e.target.value })
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
              {errors.paymentReason && (
                <div style={{ color: "red" }}>{errors.paymentReason}</div>
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

          {
            personAction === "payment_histories" && (
              <>
                <select
                  value={selectedPerson}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setSelectedPerson(selectedId);

                    if (selectedId) {
                      handleGetPersonPayments(selectedId);
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

                {personPayments.length > 0 && (
                  <table border="1" cellPadding="10" style={{ marginTop: "20px", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th>Iznos</th>
                        <th>Razlog isplate</th>
                        <th>Datum isplate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personPayments.map((h, index) => (
                        <tr key={index}>
                          <td>{h.amount}</td>
                          <td>{h.reason}</td>
                          <td>{h.paymentDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

              </>
            )
          }

          {
            personAction === "age" && (
              <>
                <select
                  value={selectedPerson}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setSelectedPerson(selectedId);

                    if (selectedId) {
                      handleGetPersonAge(selectedId);
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
                {personData.ageInMonths1 !== null && (
                  <p>Starost osobe u mesecima: {personData.ageInMonths1}</p>
                )}
              </>
            )
          }

          {
            personAction === "sum_of_payments" && (
              <>
                <select
                  value={selectedPerson}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setSelectedPerson(selectedId);

                    if (selectedId) {
                      handleGetPersonSumOfPayments(selectedId);
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
                {personData.sumOfPayments !== null && (
                  <p>Ukupna isplata osobe izražena u dinarima: {personData.sumOfPayments}</p>
                )}
              </>
            )
          }

          {!(["residence", "payment_histories", "age", "sum_of_payments"].includes(personAction)) && (
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
          )}

          {personApiError && <div style={{ color: "red", marginTop: "10px" }}>{personApiError}</div>}
          {personApiSuccess && <div style={{ color: "green", marginTop: "10px" }}>{personApiSuccess}</div>}

          <button
            onClick={() => {
              fetchAllPersons();
              setShowAllPersons((prev) => (!prev));
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
              setShowAllPlaces((prev) => (!prev));
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

      {/* TAB USERS */}
      {activeTab === "users" && (
        <>
          <div>
            <h2>Svi trenutni korisnici</h2>

            {userAction === "get" && (
              <>
                <table border="1" cellPadding="10" style={{ marginTop: "20px", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th>Ime</th>
                      <th>Prezime</th>
                      <th>Korisničko ime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user, index) => (
                      <tr key={index}>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.username}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

          </div>
        </>
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

export default App;