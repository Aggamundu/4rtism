import FormText from "../form-components/formText";
import "./requestDetails.css";

export default function RequestDetails() {

    return (
        <div className="request-details-container">
            <div className="request-details-title">
                Request Details
            </div>
            <div className="form-container">
                <div className="form-card">
                    <FormText 
                        label={"Request Details"} 
                        placeholder={"idk what this is"} 
                        errorStatus={false} 
                        helperText={"type better"}
                        charLimit={50}
                    />
                </div>
                <div className="form-card">
                    <FormText 
                        label={"Smth"} 
                        placeholder={"idk what this is"} 
                        errorStatus={false}
                        successStatus={true}
                        helperText={"good/10"}
                        charLimit={50}
                    />
                </div>
                <div className="form-card">
                    <FormText 
                        label={"Smth"} 
                        placeholder={"idk what this is"} 
                        errorStatus={true}
                        successStatus={false}
                        helperText={"get better at steve"}
                        charLimit={50}
                    />
                </div>
                <div className="form-card">

                </div>
            </div>
        </div>
    )
}

