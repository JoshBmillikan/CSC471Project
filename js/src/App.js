import './App.css';
import Select from 'react-select';
import React from "react";
import "typeface-roboto"
import {SQLTable} from "./table"
import {useState} from "react";

const options = [
    {value: {name: 'patient', pkey: ''}, label: 'Patients'},
    {value: {name: 'vaccine', pkey: 'sci_name'}, label: 'Vaccines'},
    {value: {name: 'allergy', pkey: ''}, label: 'Allergies'},
    {value: {name: 'takes', pkey: ''}, label: 'Takes'},
    {value: {name: 'vaccination_site', pkey:''}, label: 'Vaccination Site'},
    {value: {name: 'lot',pkey:''}, label: "Lot"},
    {value: {name: 'billing', pkey: ''}, label: 'Billing'}
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
                    <SQLTable
                        currentTable={currentTable}
                    />
                }
            </div>
        </div>

    );
}

export default App;
