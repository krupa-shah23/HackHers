import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-router-dom'; 

// Basic placeholder for Daily Check-in since user requested it be connected
const DailyCheckIn = () => {
    const navigate = useNavigate();
    const [mood, setMood] = useState('good');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Check-in submitted!');
        navigate(-1);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Daily Check-in</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>How is the mood today?</label>
                    <select value={mood} onChange={(e) => setMood(e.target.value)} style={{ padding: '8px', width: '100%' }}>
                        <option value="good">Good</option>
                        <option value="neutral">Neutral</option>
                        <option value="bad">Bad</option>
                    </select>
                </div>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Submit Check-in
                </button>
            </form>
        </div>
    );
};

export default DailyCheckIn;
