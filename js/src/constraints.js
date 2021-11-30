export function isValid(value, column) {
    switch (column) {
        case 'id':
        case 'weight':
        case 'num_doses':
            if (isNaN(value)) throw new Error(`${column}: Input must be a number`);
            break;
        case 'middle_initial': if (value.length > 1) throw new Error(`${column}: Input can be at most 1 character`)
        default:
            return;
    }
}