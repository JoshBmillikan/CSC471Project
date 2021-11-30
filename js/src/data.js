// Fetch the table data from the server
export async function getData(currentTable, setTableData, setLoading, pkeyName = null, pkeyValue = null) {
    try {
        const response = await fetch(
            `https://csc471f21-millikan-joshua.azurewebsites.net/api/index.php/list/?table_name=
        ${currentTable.currentTable[0]}
        ${pkeyName != null ? `&pkey_name=${pkeyName}&pkey_value=${pkeyValue}` : ''} 
        `)
        if (response.ok) {
            const data = await response.json()
            setTableData(data)
            setLoading(false)
        }
        if(!response.ok)
            alert(await response.text())
    } catch (error) {
        alert(error.message)
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
    try {
        const response = await fetch(
            "https://csc471f21-millikan-joshua.azurewebsites.net/api/index.php/update",
            {
                method: 'post',
                body: JSON.stringify(data),
            }
        )
        if(!response.ok)
            alert(await response.text())
    } catch (error) {
        alert(error.message)
    }
    await getData(currentTable, setTableData, setLoading)
}