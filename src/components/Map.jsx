import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

export default function Map() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  function handleClick() {
    navigate("form");
  }
  return (
    <div className={styles.mapContainer} onClick={handleClick}>
      <h1>Map</h1>
      <h2>{lng}</h2>
      <h2>{lat}</h2>
    </div>
  );
}
