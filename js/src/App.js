import './App.css';
import Select from 'react-select';
import React from "react";
import "typeface-roboto"
import {SQLTable} from "./table"
import {useState} from "react";

const options = [
    {value: 'patient', label: 'Patients', pkey: ''},
    {value: 'vaccine', label: 'Vaccines', pkey: 'sci_name'},
    {value: 'allergy', label: 'Allergies', pkey: ''},
    {value: 'takes', label: 'Takes', pkey: ''},
    {value: 'vaccination_site', label: 'Vaccination Site', pkey: ''},
    {value: 'lot', label: "Lot", pkey: ''},
    {value: 'billing', label: 'Billing', pkey: ''}
];


function App() {
    const [currentTable, setCurrentTable] = useState(null);

    return (
        <div className="App">
            <header className="App-header">
                CSC-471 Project {currentTable}
            </header>
            <span>
                <Select
                    className="DropDown"
                    options={options}
                    isClearable
                    isSearchable
                    onChange={(it) => {
                        if (it != null) {
                            setCurrentTable(it.value)
                        } else setCurrentTable(null)
                    }}
                > </Select>
            </span>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30%'}}>
                {currentTable != null &&
                    <SQLTable currentTable={currentTable}/>
                }
            </div>
        </div>

    );
}

export default App;
