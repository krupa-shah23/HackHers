import { useState } from 'react';
import './AddMedication.css';
import { useNavigate } from 'react-router-dom';
import { addMedication } from '../../services/api';

const AddMedication = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        medicationName: '',
        type: 'Tablet', // Default type
        dosage: '',
        times: ['09:00'],
        frequency: 'daily',
        contextTags: [],
        notes: '',
        image: null, // For file upload
        imagePreview: null // For preview
    });

    // Mock autocomplete suggestions
    const suggestions = [
        { name: 'Lisinopril', generic: 'ACE Inhibitor', icon: '💊' },
        { name: 'Metformin', generic: 'Diabetes medication', icon: '💊' },
        { name: 'Amlodipine', generic: 'Blood pressure', icon: '💊' },
        { name: 'Omeprazole', generic: 'Acid reducer', icon: '💊' }
    ];

    const steps = [
        { id: 1, title: 'Medication Info', subtitle: 'Name, type & dosage' },
        { id: 2, title: 'Schedule', subtitle: 'When to take' },
        { id: 3, title: 'Details', subtitle: 'Photo & Instructions' },
        { id: 4, title: 'Review', subtitle: 'Confirm details' }
    ];

    const contextOptions = ['With food', 'Empty stomach', 'Before bed', 'As needed'];
    const medicationTypes = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Inhaler'];

    const handleNext = async () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            // Final step: Save medication
            try {
                const data = new FormData();
                data.append('name', formData.medicationName);
                data.append('type', formData.type);
                data.append('dosage', formData.dosage);
                
                // Construct schedule object matching Mongoose schema
                const scheduleObj = {
                    times: formData.times,
                    frequency: formData.frequency,
                    startDate: new Date()
                };
                data.append('schedule', JSON.stringify(scheduleObj)); 

                data.append('contextTags', JSON.stringify(formData.contextTags)); 
                data.append('notes', formData.notes);

                if (formData.image) {
                    data.append('image', formData.image);
                }

                // Default careProfileId if not handled by backend
                // data.append('careProfileId', "default"); 

                await addMedication(data);
                alert('Medication added successfully!');
                navigate('/dashboard/caregiver');
            } catch (error) {
                console.error("Error adding medication:", error);
                if (error.response) {
                    console.error("Server Error Data:", error.response.data);
                }
                alert('Failed to add medication: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const toggleContextTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            contextTags: prev.contextTags.includes(tag)
                ? prev.contextTags.filter(t => t !== tag)
                : [...prev.contextTags, tag]
        }));
    };

    const addTime = () => {
        setFormData(prev => ({
            ...prev,
            times: [...prev.times, '12:00']
        }));
    };

    const removeTime = (index) => {
        setFormData(prev => ({
            ...prev,
            times: prev.times.filter((_, i) => i !== index)
        }));
    };

    const selectSuggestion = (name) => {
        setFormData(prev => ({ ...prev, medicationName: name }));
        setShowAutocomplete(false);
    };

    return (
        <div className="add-medication-screen">
            {/* Sidebar Stepper */}
            <aside className="step-sidebar">
                <div className="sidebar-header">
                    <h2>Add Medication</h2>
                    <p>Fill in the details below</p>
                </div>

                <div className="stepper">
                    {steps.map((step, index) => (
                        <div key={step.id} className="step-item">
                            <div className="step-indicator">
                                <div className={`step-circle ${step.id < currentStep ? 'completed' :
                                        step.id === currentStep ? 'current' : 'upcoming'
                                    }`}>
                                    {step.id < currentStep ? '✓' : step.id}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`step-line ${step.id < currentStep ? 'completed' : ''}`} />
                                )}
                            </div>
                            <div className="step-content">
                                <p className={`step-title ${step.id > currentStep ? 'muted' : ''}`}>
                                    {step.title}
                                </p>
                                <p className="step-subtitle">{step.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Form Area */}
            <main className="form-main">
                {/* Step 1: Medication Info */}
                {currentStep === 1 && (
                    <>
                        <div className="form-header">
                            <h1>Medication Information</h1>
                            <p>Enter the medication name, type and dosage</p>
                        </div>

                        <div className="form-section">
                            <div className="form-group autocomplete-wrapper">
                                <label className="form-label">Medication name</label>
                                <div className="input-with-icon">
                                    <span className="input-icon">💊</span>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g., Lisinopril"
                                        value={formData.medicationName}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, medicationName: e.target.value }));
                                            setShowAutocomplete(e.target.value.length > 0);
                                        }}
                                    />
                                </div>

                                {showAutocomplete && (
                                    <div className="autocomplete-dropdown">
                                        {suggestions.filter(s =>
                                            s.name.toLowerCase().includes(formData.medicationName.toLowerCase())
                                        ).map(suggestion => (
                                            <div
                                                key={suggestion.name}
                                                className="autocomplete-item"
                                                onClick={() => selectSuggestion(suggestion.name)}
                                            >
                                                <div className="autocomplete-icon">{suggestion.icon}</div>
                                                <div className="autocomplete-info">
                                                    <h4>{suggestion.name}</h4>
                                                    <p>{suggestion.generic}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                             <div className="form-group">
                                <label className="form-label">Type</label>
                                <select 
                                    className="form-input"
                                    value={formData.type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                >
                                    {medicationTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-row">
                                <div className="form-group">
                                    <label className="form-label">Dosage</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g., 10mg"
                                        value={formData.dosage}
                                        onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Step 2: Schedule */}
                {currentStep === 2 && (
                    <>
                        <div className="form-header">
                            <h1>Schedule</h1>
                            <p>When do you take this medication?</p>
                        </div>

                        <div className="form-section">
                            <div className="form-group">
                                <label className="form-label">Times</label>
                                {formData.times.map((time, index) => (
                                    <div key={index} className="time-picker-row">
                                        <div className="time-input-group">
                                            <input
                                                type="time"
                                                className="time-input"
                                                value={time}
                                                onChange={(e) => {
                                                    const newTimes = [...formData.times];
                                                    newTimes[index] = e.target.value;
                                                    setFormData(prev => ({ ...prev, times: newTimes }));
                                                }}
                                            />
                                        </div>
                                        {formData.times.length > 1 && (
                                            <button className="remove-time-btn" onClick={() => removeTime(index)}>
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button className="add-time-link" onClick={addTime}>
                                    + Add another time
                                </button>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Frequency</label>
                                <div className="radio-group">
                                    {['daily', 'every-other-day', 'specific-days', 'custom'].map(freq => (
                                        <div
                                            key={freq}
                                            className={`radio-option ${formData.frequency === freq ? 'selected' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, frequency: freq }))}
                                        >
                                            <div className="radio-circle" />
                                            <span className="radio-label">
                                                {freq === 'daily' && 'Daily'}
                                                {freq === 'every-other-day' && 'Every other day'}
                                                {freq === 'specific-days' && 'Specific days'}
                                                {freq === 'custom' && 'Custom schedule'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Step 3: Details */}
                {currentStep === 3 && (
                    <>
                        <div className="form-header">
                            <h1>Additional Details</h1>
                            <p>Add context, photo, and instructions</p>
                        </div>

                        <div className="form-section">
                            <div className="form-group">
                                <label className="form-label">Instructions</label>
                                <div className="context-tags">
                                    {contextOptions.map(tag => (
                                        <button
                                            key={tag}
                                            className={`context-tag ${formData.contextTags.includes(tag) ? 'selected' : ''}`}
                                            onClick={() => toggleContextTag(tag)}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Photo (Optional)</label>
                                <div className="photo-upload-container">
                                    <label htmlFor="file-upload" className="photo-upload">
                                        <span className="photo-upload-icon">📷</span>
                                        <span className="photo-upload-text">Click to upload photo</span>
                                    </label>
                                    <input 
                                        id="file-upload" 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                    {formData.imagePreview && (
                                        <div className="image-preview">
                                            <img src={formData.imagePreview} alt="Preview" style={{ maxWidth: '100px', marginTop: '10px' }} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Notes</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., Take after breakfast"
                                    value={formData.notes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                    <>
                        <div className="form-header">
                            <h1>Review</h1>
                            <p>Confirm your medication details</p>
                        </div>

                        <div className="form-section">
                            <div className="review-card">
                                <div className="review-section">
                                    <div>
                                        <h4>Medication</h4>
                                        <p>{formData.medicationName || 'Not specified'} ({formData.type}) - {formData.dosage}</p>
                                    </div>
                                    <button className="edit-btn" onClick={() => setCurrentStep(1)}>✏️</button>
                                </div>
                                <div className="review-section">
                                    <div>
                                        <h4>Schedule</h4>
                                        <p>{formData.times.join(', ')} • {formData.frequency}</p>
                                    </div>
                                    <button className="edit-btn" onClick={() => setCurrentStep(2)}>✏️</button>
                                </div>
                                <div className="review-section">
                                    <div>
                                        <h4>Instructions</h4>
                                        <p>{formData.contextTags.join(', ') || 'None'}</p>
                                    </div>
                                    <button className="edit-btn" onClick={() => setCurrentStep(3)}>✏️</button>
                                </div>
                                {formData.imagePreview && (
                                     <div className="review-section">
                                     <div>
                                         <h4>Photo</h4>
                                         <img src={formData.imagePreview} alt="Review" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                     </div>
                                     <button className="edit-btn" onClick={() => setCurrentStep(3)}>✏️</button>
                                 </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Reminder Preview</label>
                                <div className="notification-preview">
                                    <div className="notification-icon">💊</div>
                                    <div className="notification-content">
                                        <h4>Time for {formData.medicationName || 'medication'}</h4>
                                        <p>{formData.dosage} {formData.contextTags[0] ? `• ${formData.contextTags[0]}` : ''}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Bottom Action Bar */}
                <div className="action-bar">
                    <span className="step-indicator-text">Step {currentStep} of 4</span>
                    <div className="action-buttons">
                        {currentStep > 1 && (
                            <button className="btn-back" onClick={handleBack}>Back</button>
                        )}
                        <button className="btn-next" onClick={handleNext}>
                            {currentStep === 4 ? 'Save Medication' : 'Next'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddMedication;
