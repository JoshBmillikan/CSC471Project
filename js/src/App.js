import './App.css';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import {waitForElementToBeRemoved} from "@testing-library/react";
import "typeface-roboto"

const options = [
    {value: 'patient', label: 'Patients'},
    {value: 'vaccine', label: 'Vaccines'},
    {value: 'allergy', label: 'Allergies'},
    {value: 'takes', label: 'Takes'},
    {value: 'vaccination_site', label: 'Vaccination Site'}
];

const url = "https://csc471f21-millikan-joshua.azurewebsites.net/api/index.php";


function App() {
    return (
        <div className="App">
            <header className="App-header">
                CSC-471 Project
            </header>
            <body>
            <span>
                <Select
                    className="DropDown"
                    options={options}
                > </Select>
            </span>
            </body>
        </div>

    );
}

export default App;
