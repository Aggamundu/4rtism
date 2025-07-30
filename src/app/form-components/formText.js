"use client"
import { Input } from "@material-tailwind/react";
import "./formComponents.css";
import { useState } from "react";

export default function RequestDetails(
    { label, placeholder, errorStatus, 
        successStatus, helperText, charLimit }
    ) 
{
    const [input, setInput] = useState("");
    const [numChar, setNumChar] = useState(0);

    return (
        <div className="form-input-container">
            <Input 
                variant="outlined"
                size="lg"
                label={ label }
                placeholder={ placeholder }
                error={ errorStatus }
                success={successStatus}
                color={successStatus ? "green" : "blue"} // color of label
                // makes label bigger and correct font
                labelProps={{
                    className: "text-sm \
                                peer-placeholder-shown:text-base \
                                peer-focus:text-sm\
                                font-['IBM_Plex_Mono'] \
                                transition-all"
                }}
                // makes input text correct font
                containerProps={{
                    className: "font-['IBM_Plex_Mono']"
                }}

                className={successStatus ? "green" : errorStatus ? "red" : "black"}

                //change numChar according to 
                onChange={(e) => {
                    setInput(e.target.value);
                    setNumChar(e.target.value.length);
                }}
            />
            <div className={`form-input-character-limit ${numChar > charLimit ? "red" : "black"}`}>
                {numChar}/{charLimit}
            </div>
            <div className="form-input-helper-text red">
                {helperText}
            </div>
        </div>
    )
}

