import './App.css';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import {waitForElementToBeRemoved} from "@testing-library/react";

const options = [
    {value: 'patient', label: 'Patients'},
    {value: 'vaccine', label: 'Vaccines'},
    {value: 'allergy', label: 'Allergies'},
];

const url = "https://csc471f21-millikan-joshua.azurewebsites.net/php/API";

function App() {
    const loadOptions = (input) => {
        return fetch(url + "/api/tables").then(
            (response) => {
                if (response.status === 200) {
                    return response.json()
                }
            }
        )
    }
    return (
        <div className="App">
            <body>
            <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
            >
            </AsyncSelect>
            </body>
        </div>
    );
}

export default App;
