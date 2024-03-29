import './App.css';
import Select from 'react-select';
import React from "react";
import "typeface-roboto"
import {SQLTable} from "./table"
import {useState} from "react";

// names of all tables and their primary keys
const options = [
    {value: ['patient', 'id'], label: 'Patients'},
    {value: ['vaccine', 'sci_name'], label: 'Vaccines'},
    {value: ['allergy', 'patient_id'], label: 'Allergies'},
    {value: ['takes', 'patient_id'], label: 'Takes'},
    {value: ['vaccination_site','name'], label: 'Vaccination Site'},
];


function App() {
    const [currentTable, setCurrentTable] = useState(null);

    return (
        <div className="App">
            <header className="App-header">
                CSC-471 Project
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
                    <SQLTable
                        currentTable={currentTable}
                    />
                }
            </div>
        </div>

    );
}

export default App;
