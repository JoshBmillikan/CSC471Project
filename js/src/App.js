import './App.css';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import {waitForElementToBeRemoved} from "@testing-library/react";
import "typeface-roboto"
import {Table} from "./table"
import {useState} from "react";

const options = [
    {value: 'patient', label: 'Patients'},
    {value: 'vaccine', label: 'Vaccines'},
    {value: 'allergy', label: 'Allergies'},
    {value: 'takes', label: 'Takes'},
    {value: 'vaccination_site', label: 'Vaccination Site'},
    {value: 'lot', label: "Lot"},
    {value: 'billing', label: 'Billing'}
];


function App() {
    const [currentTable, setCurrentTable] = useState(null);
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
                    isClearable
                    isSearchable
                    onChange={(it) => {
                        if (it != null) {
                            setCurrentTable(it.value)
                        } else setCurrentTable(null)
                    }}
                > </Select>
                        </span>
            <div
                style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30%'}}
            >
                {currentTable != null && <Table
                    tableName={currentTable}/>
                }
            </div>
            </body>
        </div>

    );
}

export default App;
