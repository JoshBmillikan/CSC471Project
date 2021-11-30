// Fetch the table data from the server
export async function getData(currentTable, setTableData, setLoading) {
    const response = await fetch(`https://csc471f21-millikan-joshua.azurewebsites.net/api/index.php/list/?table_name=${currentTable.currentTable[0]}`)
    if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
            setTableData(data)
            setLoading(false)
        } else setTableData(null)
    } else {
        alert(response.error())
    }
}

// Sends an update request to change a column in a row
export async function updateData(rowData, newVal, columnName, currentTable, setTableData, setLoading) {
    setLoading(true)
    const pkey = currentTable.currentTable[1];
    const data = {
        table_name: currentTable.currentTable[0],
        pkey_name: pkey,
        pkey_value: rowData[pkey],
        column_name: columnName,
        column_value: newVal
    }
    const response = await fetch(
        "https://csc471f21-millikan-joshua.azurewebsites.net/api/index.php/update",
        {
            method: 'post',
            body: JSON.stringify(data),
        }
    )
    if (!response.ok) {
        alert(response.error())
    }
    await getData(currentTable, setTableData, setLoading)
}