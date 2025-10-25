// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import useURLPosition from "./hooks/useURLPosition.js";
import Message from "./Message";
import Spinner from "./Spinner.jsx";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export default function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [isLoadingGeoData, setIsLoadingGeoData] = useState(false);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [lat, lng] = useURLPosition();
  const [emoji, setEmoji] = useState("");
  const [geoCodingError, setGeoCodingError] = useState("");

  const BASE_ULR = "https://api.bigdatacloud.net/data/reverse-geocode-client";

  useEffect(() => {
    async function fetchCity() {
      try {
        setIsLoadingGeoData(true);
        setGeoCodingError("");
        console.log("Fetching city for:", lat, lng);
        const res = await fetch(`${BASE_ULR}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (!data.countryCode)
          throw new Error(
            "That doesn't seem to be a city. Please click somewhere else."
          );
        console.log(data);
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        console.log(err);
        setGeoCodingError(err.message);
      } finally {
        setIsLoadingGeoData(false);
      }
    }

    fetchCity();
  }, [lat, lng]);

  if (geoCodingError) return <Message message={geoCodingError} />;
  if (isLoadingGeoData) return <Spinner />;
  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type={"primary"}>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}
