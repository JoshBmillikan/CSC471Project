import {useEffect, useState, useMemo} from "react";
import {useTable} from "react-table";
import {DotLoader} from "react-spinners";
/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import styled from 'styled-components'
import {getData, updateData} from "./data";
import {InsertModal} from "./InsertModal";

// Button component to remove a row when clicked
function DeleteButton(rowData, currentTable, setTableData, setLoading) {
    const deleteFn = async () => {
        setLoading(true)
        const pkey = currentTable.currentTable[1];
        const data = {
            table_name: currentTable.currentTable[0],
            pkey_name: pkey,
            pkey_value: rowData[pkey]
        }
        const response = await fetch(
            "https://csc471f21-millikan-joshua.azurewebsites.net/api/index.php/delete",
            {
                method: 'delete',
                body: JSON.stringify(data),
            }
        )
        if (!response.ok) {
            alert(response.error())
        }
        await getData(currentTable, setTableData, setLoading)
    }

    return (
        <button
            css={css`
              border: transparent;
              background: transparent;
              font-size: large;
              color: dimgray;

              &:hover {
                font-weight: bold;
                background: red;
                color: white;
              }
            `}
            onClick={deleteFn}
        > X </button>
    )
}


// I have no idea why, but using InsertModal directly crashes, but this works fine
function InsertButton(rowNames, currentTable, setTableData, setLoading) {
    return (
        <InsertModal
            rowNames={rowNames}
            currentTable={currentTable}
            setTableData={setTableData}
            setLoading={setLoading}
        />
    )

}

const TableStyles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
    background: whitesmoke;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

// The table component to display the data from the database
export function SQLTable(currentTable) {
    const [tableData, setTableData] = useState(null)
    const [loading, setLoading] = useState(true)

    const pkey = useMemo(() => {
        return currentTable.currentTable[1]
    }, [currentTable])
    useEffect(() => {
        setLoading(true)
        if (currentTable != null) {
            getData(currentTable, setTableData, setLoading)
        }
    }, [currentTable])

    const columns = useMemo(
        () => {
            if (tableData != null) {
                const cells = Object.getOwnPropertyNames(tableData[0]).map(
                    (it) => {
                        return {
                            // replace underscores with spaces
                            Header: it.replaceAll(/_/g, ' '),
                            accessor: it
                        }
                    }
                )
                return [...cells,
                    {
                        Header: () => {
                            return InsertButton(Object.getOwnPropertyNames(tableData[0]), currentTable, setTableData, setLoading)
                        },
                        accessor: 'buttons',
                        Cell: ({row: {index}}) => {
                            return DeleteButton(tableData[index], currentTable, setTableData, setLoading)
                        }
                    }
                ]
            }
            return [
                {
                    Header: 'placeholder',
                    accessor: 'placeholder',
                }
            ]
        },
        [tableData, currentTable]
    )
    const rowData = useMemo(() => tableData != null ? tableData : [{placeholder: "bla"}], [tableData])

    // Create an editable cell
    const EditableCell = ({
                              value: initialValue,
                              row: {index},
                              column: {id},
                              updateData,
                          }) => {
        const [value, setValue] = useState(initialValue)
        const onChange = e => {
            setValue(e.target.value)
        }

        const onBlur = () => {
            updateData(tableData[index], value, id, currentTable, setTableData, setLoading)
        }

        useEffect(() => {
            setValue(initialValue)
        }, [initialValue])

        return <input value={value} onChange={onChange} onBlur={onBlur}/>
    }

// Set our editable cell renderer as the default Cell renderer
    const defaultColumn = {
        Cell: EditableCell,
    }

    const tableInstance = useTable({columns, data: rowData, defaultColumn, updateData})

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance


    if (loading) {
        return (<DotLoader loading={loading} css={css`
          border-width: 10px;
          border-color: azure;
          margin-top: 10vh;
        `} color={'#0079fa'}/>)
    }

    return (
        <TableStyles>
            <table {...getTableProps()}>
                <thead>
                {// Loop over the header rows
                    headerGroups.map(headerGroup => (
                        // Apply the header row props
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {// Loop over the headers in each row
                                headerGroup.headers.map(column => (
                                    // Apply the header cell props
                                    <th {...column.getHeaderProps()}>
                                        {// Render the header
                                            column.render('Header')}
                                    </th>
                                ))}
                        </tr>
                    ))}
                </thead>
                {/* Apply the table body props */}
                <tbody {...getTableBodyProps()}>
                {// Loop over the table rows
                    rows.map(row => {
                        // Prepare the row for display
                        prepareRow(row)
                        return (
                            // Apply the row props
                            <tr {...row.getRowProps()}>
                                {// Loop over the rows cells
                                    row.cells.map(cell => {
                                        // Apply the cell props
                                        return (
                                            <td {...cell.getCellProps()}>
                                                {// Render the cell contents
                                                    cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </TableStyles>
    )
}
