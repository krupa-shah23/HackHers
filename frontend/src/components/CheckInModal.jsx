import React, { useState } from 'react';
import './CheckInModal.css';

const CheckInModal = ({ isOpen, onClose, onSubmit, userName }) => {
    const [mood, setMood] = useState('');
    const [symptoms, setSymptoms] = useState([]);
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit({ mood, symptoms, notes });
        onClose();
        // Reset form
        setMood('');
        setSymptoms([]);
        setNotes('');
    };

    const toggleSymptom = (sym) => {
        if (symptoms.includes(sym)) {
            setSymptoms(symptoms.filter(s => s !== sym));
        } else {
            setSymptoms([...symptoms, sym]);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Daily Check-in 💬</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="modal-body">
                    <p>How is {userName} feeling today?</p>
                    
                    <div className="mood-selection">
                        {['Great 😄', 'Good 🙂', 'Okay 😐', 'Not Good 🤒'].map(m => (
                            <button 
                                key={m} 
                                className={`mood-btn ${mood === m ? 'selected' : ''}`}
                                onClick={() => setMood(m)}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    <div className="symptoms-section">
                        <h4>Any symptoms?</h4>
                        <div className="tags-container">
                            {['Headache', 'Nausea', 'Dizziness', 'Fatigue', 'None'].map(sym => (
                                <button 
                                    key={sym} 
                                    className={`tag-btn ${symptoms.includes(sym) ? 'selected' : ''}`}
                                    onClick={() => toggleSymptom(sym)}
                                >
                                    {sym}
                                </button>
                            ))}
                        </div>
                    </div>

                    <textarea 
                        className="notes-input" 
                        placeholder="Any additional notes..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <div className="modal-footer">
                    <button className="submit-btn" onClick={handleSubmit}>Save Check-in</button>
                </div>
            </div>
        </div>
    );
};

export default CheckInModal;
