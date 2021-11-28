import {useEffect, useState, useMemo} from "react";
import {useTable} from "react-table";
import {DotLoader} from "react-spinners";
/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";

async function updateData(index, id, newValue, pkey, tableName) {

}

function DeleteButton(rowData,currentTable) {

    const deleteFn = () => {
        async function del() {
            const pkey = currentTable.currentTable[1];
            const data = {
                table_name: currentTable.currentTable[0],
                pkey_name: pkey,
                pkey_value: rowData[pkey]
            }

            const response = await fetch(
                "https://csc471f21-millikan-joshua.azurewebsites.net/api/index.php/delete",
                {
                    method: 'post',
                    body: JSON.stringify(data)
                }
            )
            alert((await response).toString())
            if(!response.ok) {
                console.error(response.error())
            }
        }


        del()
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

export function SQLTable(currentTable) {
    const [tableData, setTableData] = useState(null)
    const [loading, setLoading] = useState(true)

    const pkey = useMemo(() => {
        return currentTable.currentTable[1]
    }, [currentTable])
    useEffect(() => {
        setLoading(true)
        if (currentTable != null) {
            async function getData() {
                const response = await fetch(`https://csc471f21-millikan-joshua.azurewebsites.net/api/index.php/list/?table_name=${currentTable.currentTable[0]}`)
                if (response.ok) {
                    const data = await response.json()
                    if (data.length > 0) {
                        setTableData(data)
                        setLoading(false)
                    } else setTableData(null)
                } else {
                    console.error(response.error())
                }
            }

            getData()
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
                        Header: ' ',
                        Cell: ({row: {index}}) => {
                            return DeleteButton(tableData[index],currentTable)
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
        [tableData,currentTable]
    )
    const rowData = useMemo(() => tableData != null ? tableData : [{placeholder: "bla"}], [tableData])

    // Create an editable cell renderer
    const EditableCell = ({
                              value: initialValue,
                              row: {index},
                              column: {id},
                              updateData, // This is a custom function that we supplied to our table instance
                          }) => {
        // We need to keep and update the state of the cell normally
        const [value, setValue] = useState(initialValue)
        const onChange = e => {
            setValue(e.target.value)
        }

        // We'll only update the external data when the input is blurred
        const onBlur = () => {
            alert(`PKey: ${JSON.stringify(pkey)}`)
            updateData(index, id, value, pkey, currentTable.currentTable).then((result) => {
                //todo error handling
                if (!result.ok) {

                }
            })
        }

        // If the initialValue is changed external, sync it up with our state
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
    )
}
