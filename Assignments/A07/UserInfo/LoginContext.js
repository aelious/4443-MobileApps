import { createContext } from "react";

const LoginContext = createContext({
    userLogin: {
        username: '',
        first: '',
        last: '',
        contacts: []
    },
    setUserLogin: () => {},
});


export { LoginContext };