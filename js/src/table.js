import makeAnimated from 'react-select/animated';
import { useTable, usePagination } from 'react-table'
import React from "react";
import { useFetch } from "react-async"

export function Table({tableName}) {
    const [tableData,setTableData] = React.useState(null)

    React.useEffect( () => {
            async function fetchData() {
                const fetchResult = await fetch("https://csc471f21-millikan-joshua.azurewebsites.net/api/index.php/list/?table_name=" + tableName)
                setTableData((await fetchResult.json()).parse())
            }
            fetchData()
        },
        [tableName]
    )
    const data = React.useMemo(
        () => {


            return [
                {
                    col1: 'Hello',
                    col2: 'World',
                },
                {
                    col1: 'react-table',
                    col2: 'rocks',
                },
                {
                    col1: 'whatever',
                    col2: 'you want',
                },
            ]
        },
        [tableName]
    )

    const columns = React.useMemo(
        () => {
            const first = tableData[0]

            return [
                {
                    Header: 'Column 1',
                    accessor: 'col1', // accessor is the "key" in the data
                },
                {
                    Header: 'Column 2',
                    accessor: 'col2',
                },
            ]
        },
        [tableName]
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data })

    return (
        <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th
                            {...column.getHeaderProps()}
                            style={{
                                borderBottom: 'solid 3px red',
                                background: 'aliceblue',
                                color: 'black',
                                fontWeight: 'bold',
                            }}
                        >
                            {column.render('Header')}
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map(row => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return (
                                <td
                                    {...cell.getCellProps()}
                                    style={{
                                        padding: '10px',
                                        border: 'solid 1px gray',
                                        background: 'papayawhip',
                                    }}
                                >
                                    {cell.render('Cell')}
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