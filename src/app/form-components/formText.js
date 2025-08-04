"use client"
import "./formComponents.css";
import { useState } from "react";

export default function RequestDetails( {
    label,
    placeholder,
    errorStatus,
    successStatus,
    helperText,
    charLimit
} ) {
    const [input, setInput] = useState("");
    const [numChar, setNumChar] = useState(0);

    return (
        <div className="form-input-container">
            <div className="form-input-title text-lg">
                {label}
            </div>
            <textarea name="requestCommissionDetails" placeholder={placeholder}
                id={label}
                className="form-input rounded-card bg-custom-gray text-base"
                onChange={(e) => {
                    setInput(e.target.value);
                    setNumChar(e.target.value.length);
                }}
            />
            
            <div className={`form-input-error-container 
                ${ charLimit === 0 && helperText === "" ? "hidden" : "" }`}
            >
                <div className="form-input-error-text text-base">
                    {helperText}
                </div>
                <div className={`form-input-character-limit text-sm ${ charLimit === 0 ? "hidden" : "" }`}>
                    {numChar}/{charLimit}
                </div>
            </div>
        </div>
    )
}

