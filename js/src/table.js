import {useEffect, useState, useMemo} from "react";
import {useTable} from "react-table";
import {DotLoader} from "react-spinners";
import {css} from "@emotion/react";

async function updateData(row,tableName,column,value) {
    let data = {
        table: tableName,
        column: column,
        value: value,
        row: row
    }
    let response = await fetch('https://csc471f21-millikan-joshua.azurewebsites.net/api/index.php/update/', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export function SQLTable(currentTable) {
    const [tableData, setTableData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        if (currentTable != null) {
            async function getData() {
                const str = currentTable.currentTable;
                const response = await fetch(`https://csc471f21-millikan-joshua.azurewebsites.net/api/index.php/list/?table_name=${str}`)
                if (response.ok) {
                    const data = await response.json()
                    console.log(data)
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
                return Object.getOwnPropertyNames(tableData[0]).map(
                    (it) => {
                        return {
                            Header: it.replaceAll(/_/g, ' '),
                            accessor: it
                        }
                    }
                )
            }
            return [
                {
                    Header: 'placeholder',
                    accessor: 'placeholder',
                }
            ]
        },
        [tableData]
    )
    const rowData = useMemo(() => tableData != null ? tableData : [{placeholder: "bla"}], [tableData])

    const EditableCell = ({value: initialValue, row: {index}, column: {id}, updateData,}) => {
        const [value, setValue] = useState(initialValue)
        const onChange = e => {
            setValue(e.target.value)
        }
        useEffect(() => {
            let old = initialValue
            setValue(initialValue)
            alert(`PKey: ${currentTable.pkey}`)
            updateData(tableData[index],currentTable.currentTable,id,value).then((it)=>{
                if(!it) {
                    setValue(old)
                }
            })
        }, [initialValue])
        return <input value={value} onChange={onChange} />
    }

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

    const loaderCss = css`
      border-width: 10px;
      border-color: azure;
      margin-top: 10vh;
    `;

    if (loading) {
        return (<DotLoader loading={loading} css={loaderCss} color={'#0079fa'}/>)
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
