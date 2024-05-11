import { createContext } from "react";

const SentContext = createContext({
    wasSent: {sent: false,
        message: '',
    },
    setWasSent: () => {},

});


export {SentContext};