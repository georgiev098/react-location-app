import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:9000";

const initialState = {
  cities: [],
  isLoading: false,
  currCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        currCity: action.payload,
        isLoading: false,
      };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error("Unknown action type.");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, currCity, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const fetchCities = async () => {
      dispatch({
        type: "loading",
      });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({
          type: "cities/loaded",
          payload: data,
        });
      } catch (err) {
        console.log(err);
        dispatch({
          type: "rejected",
          payload: "There was an error loading data...",
        });
      }
    };

    fetchCities();
  }, []);

  const getCityById = useCallback(
    async function getCityById(id) {
      if (Number(id) === currCity.id) return;
      try {
        dispatch({
          type: "loading",
        });
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({
          type: "city/loaded",
          payload: data,
        });
      } catch (err) {
        console.log(err);
        dispatch({
          type: "rejected",
          payload: "There was an error loading data...",
        });
      }
    },
    [currCity.id]
  );

  async function deleteCityById(id) {
    try {
      dispatch({
        type: "loading",
      });

      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({
        type: "city/deleted",
        payload: id,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: "rejected",
        payload: "There was an error deleting city...",
      });
    }
  }

  async function createNewCity(newCity) {
    try {
      dispatch({
        type: "loading",
      });

      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-type": "application/json",
        },
      });

      const data = await res.json();

      dispatch({
        type: "city/created",
        payload: data,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: "rejected",
        payload: "There was an error creating a new city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currCity,
        error,
        getCityById,
        createNewCity,
        deleteCityById,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (!context) {
    throw new Error("Cities context was used outside of CitiesProvider");
  }
  return context;
}

export { CitiesProvider, useCities };
