import { useState } from "react";

export default function useGeoLocation(defaultPosition = null) {
  const [isLoading, setIsloading] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [error, setError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation) {
      return setError("Your browser does not support geolocation");
    }

    setIsloading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsloading(false);
      },
      (error) => {
        setError(error.message);
        setIsloading(false);
      }
    );
  }

  return { isLoading, position, error, getPosition };
}
