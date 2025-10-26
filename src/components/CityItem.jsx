import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import formatDate from "../helpers/formatDate";
import { useCities } from "../context/CitiesContext";

export default function CityItem({ city }) {
  const { currCity, deleteCityById } = useCities();
  const { cityName, emoji, date, id, position } = city;

  function handleDelete(e) {
    e.preventDefault();
    deleteCityById(id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button onClick={handleDelete} className={styles.deleteBtn}>
          &times;
        </button>
      </Link>
    </li>
  );
}
