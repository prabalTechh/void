// import { ReactElement } from "react";


interface ButtonProps {
    varient : "primary" | "secondary";
    text: String;
    // startIcon : ReactElement;
}

const varientClasses = {
    "primary" : "bg-purple-600 text-white",
    "secondary" : "bg-purple-200 text-purple-600"
}

const defaultClass = "px-4 py-2 rounded-md font-semibold "

export const Button = ({varient, text}:ButtonProps) =>{
    return <button className={varientClasses[varient] + " " + defaultClass}>
            {text}
    </button>
}