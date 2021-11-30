export function validateInput(value, column) {
    switch (column) {
        case 'weight':
            if (isNaN(value))
                throw new Error(`${column}: Input must be a number`);
            break;
        case 'id':
        case 'num_doses':
        case 'patient_id':
        case 'address_zip':
            if (value !== parseInt(value))
                throw new Error(`${column}: Input must be a integer`);
            break;
        case 'middle_initial':
            if (value.length > 1) throw new Error(`${column}: Input can be at most 1 character`)
        default:
            return;
    }
}