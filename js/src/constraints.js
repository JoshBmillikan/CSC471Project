// throws an exception if the given value is not valid for the column
export function validateInput(value, column) {
    switch (column) {
        // numeric columns
        case 'weight':
            if (isNaN(value))
                throw new Error(`${column}: Input must be a number`);
            break;
            // integer columns
        case 'id':
        case 'num_doses':
        case 'patient_id':
        case 'address_zip':
            if (value !== parseInt(value))
                throw new Error(`${column}: Input must be a integer`);
            break;
            // ensures middle initial is only 1 character
        case 'middle_initial':
            if (value.length > 1) throw new Error(`${column}: Input can be at most 1 character`)
        default:
            return;
    }
}