import { createContext } from "react";

const LocationContext = createContext({
    userLocation: {
        username: '',
        latitude: 0.0,
        longitude: 0.0,
    },
    setUser: () => {},
});


export {LocationContext};