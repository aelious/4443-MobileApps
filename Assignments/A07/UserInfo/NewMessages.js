import { createContext } from "react";

const ClickContext = createContext({
    clicked: {
        "Beth Annie": false,
        "Joe Mama": false,
        "Springy the Cat": false,
        "Stacy Perez": false,
        "Aaron Williams": false,
        "Kyle B": false,
        "Steph N": false,
    },
    setClicked: () => {},
});


export {ClickContext};