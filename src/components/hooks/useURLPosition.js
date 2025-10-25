import { useSearchParams } from "react-router-dom";

export default function useURLPosition() {
  const [searchParams] = useSearchParams();
  const lng = searchParams.get("lng");
  const lat = searchParams.get("lat");

  return [lat, lng];
}
