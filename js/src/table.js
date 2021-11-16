import {useEffect, useState, useMemo} from "react";
import {useTable} from "react-table";

export function SQLTable(currentTable) {
    const [tableData, setTableData] = useState(null)
    useEffect(() => {
        if (currentTable != null) {
            async function getData() {
                const str = currentTable.currentTable;
                const response = await fetch(`https://csc471f21-millikan-joshua.azurewebsites.net/api/index.php/list/?table_name=${str}`)
                if(response.ok) {
                    const data = await response.json()
                    console.log(data)
                    if (data.length > 0) {
                        setTableData(data)
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
                            Header: it,
                            accessor: it
                        }
                    }
                )
            }
            return  [
                {
                    Header: 'placeholder',
                    accessor: 'placeholder',
                }
            ]
        },
        [tableData]
    )
    const rowData =  useMemo(() => tableData != null ? tableData : [{placeholder:"bla"}],[tableData])

    const tableInstance = useTable({ columns, data: rowData })

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance

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
