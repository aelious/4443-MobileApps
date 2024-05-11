import { createContext } from "react";

const UserContext = createContext({
    user: {
        username: '',
        first: '',
        last: '',
        contacts: []
    },
    setUser: () => {},
});


export {UserContext};