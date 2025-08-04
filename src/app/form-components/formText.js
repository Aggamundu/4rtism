"use client"
import "./formComponents.css";
import { useState } from "react";

export default function RequestDetails() {
    const [input, setInput] = useState("");
    const [numChar, setNumChar] = useState(0);

    return (
        <div className="form-input-container">
            <div className="form-input-title text-lg">
                Title
            </div>
            <input name="requestCommissionDetails" defaultValue="Ryan made me rewrite this" 
                className="form-input rounded-card text-base"
                onChange={(e) => {
                    setInput(e.target.value);
                    setNumChar(e.target.value.length);
                }}
            />

            <div className="form-input-error-container">
                <div className="form-input-charcter-limit text-sm">
                    0/30
                </div>
                <div className="form-input-error-text text-base">
                    you bad at smash
                </div>
            </div>
        </div>
    )
}

