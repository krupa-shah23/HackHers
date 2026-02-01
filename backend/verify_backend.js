import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

// You might need to adjust the path to a real image file on your system
// or create a dummy one
const dummyImagePath = path.join(process.cwd(), 'dummy_image.jpg');

// Create a dummy image if it doesn't exist
if (!fs.existsSync(dummyImagePath)) {
    fs.writeFileSync(dummyImagePath, 'dummy image content');
}

const verifyBackend = async () => {
    try {
        const form = new FormData();
        form.append('careProfileId', "507f1f77bcf86cd799439011");
        form.append('name', 'Test Med');
        form.append('type', 'Tablet');
        form.append('dosage', '500mg');
        form.append('schedule', JSON.stringify({ times: ['08:00'], frequency: 'daily' }));
        form.append('notes', 'Test notes');
        form.append('image', fs.createReadStream(dummyImagePath));

        const response = await axios.post('http://localhost:5000/api/medications', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
        
        if (response.status === 201 && response.data.imageUrl) {
            console.log('SUCCESS: Medication created with image URL');
        } else {
            console.log('FAILURE: Unexpected response');
        }

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

verifyBackend();
