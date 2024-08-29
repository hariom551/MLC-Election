

export const validateVoterDetails = (name, value) => {
    let error = '';

    switch (name) {

        case 'PacketNo':
            if (!value) {
                return 'Packet number is required';
            }
            break;

        case 'VMob1':
        case 'MNo2':
            if (value && !/^[0-9]+$/.test(value)) {
                error = 'Mobile number must be digits';
            } else if (value && value.length != 10) {
                error = 'Mobile number must be 10 digits';
            }
            break;

        case 'EFName':
        case 'ERFName':
        case 'ELName':
            if (!value) {
                error = 'This field is required';
            }
            //  else if (!/^[a-zA-Z\s]+$/.test(value)) {
            //     error = 'Only alphabets are allowed';
            // }
            break;

        case 'HFName':
        case 'HRFName':
       
            if (!value) {
                error = 'Name (Hindi) is required';
            }
            break;

        case 'MNo':
            if (!value) {
                error = 'Mobile No. is required';
            }
            else if (value && !/^[0-9]+$/.test(value)) {
                error = 'Mobile number must be digits';
            } else if (value && value.length != 10) {
                error = 'Mobile number must be 10 digits';
            }
            break;

        case 'AadharNo':
           if (value && !/^[0-9]+$/.test(value)) {
                error = 'Aadhar number must be digits';
            }
            else if (value && !/^\d{12}$/.test(value)) {
                error = 'Aadhar number must be 12 digits';
            }
            break;

            case 'VIdNo':
                if (value && !/^[a-zA-Z0-9]{10}$/.test(value)) {
                    error = 'Voter ID must be 10 alphanumeric characters';
                }
                break;
            

        case 'RType':
        case 'CasteId':
        case 'Qualification':
        case 'Occupation':
        case 'Sex':
        case 'GCYear':
        case 'Age':
        case 'DOB':
            if (!value) {
                error = 'This field is required';
            }
            break;
        default:
            break;
    }

    return error;
};
