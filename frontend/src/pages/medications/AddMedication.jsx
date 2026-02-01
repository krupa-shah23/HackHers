import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMedication } from '../../services/medications';
import MedicationScanner from '../../components/MedicationScanner';
import './AddMedication.css';

const AddMedication = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        medicationName: '',
        strength: '',
        times: ['09:00'],
        frequency: 'daily',
        contextTags: [],
        notes: '',
        assignedTo: 'Family',
        type: 'Tablet', // Default type
        image: null // File object
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    // Mock autocomplete suggestions
    const suggestions = [
        { name: 'Lisinopril', generic: 'ACE Inhibitor', icon: '💊' },
        { name: 'Metformin', generic: 'Diabetes medication', icon: '💊' },
        { name: 'Amlodipine', generic: 'Blood pressure', icon: '💊' },
        { name: 'Omeprazole', generic: 'Acid reducer', icon: '💊' }
    ];

    const steps = [
        { id: 1, title: 'Medication Info', subtitle: 'Name and strength' },
        { id: 2, title: 'Schedule', subtitle: 'When to take' },
        { id: 3, title: 'Details', subtitle: 'Additional info' },
        { id: 4, title: 'Review', subtitle: 'Confirm details' }
    ];

    const contextOptions = ['With food', 'Empty stomach', 'Before bed', 'As needed'];
    const typeOptions = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Inhaler', 'Other'];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleNext = async () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            // Save medication to API
            try {
                setSaving(true);
                let careProfileId = localStorage.getItem('careProfileId');
                
                // If demo user or invalid, send empty to trigger backend auto-creation/default
                if (!careProfileId || careProfileId === 'demo_user_123') {
                    careProfileId = '';
                }

                const data = new FormData();
                data.append('name', formData.medicationName);
                data.append('dosage', formData.strength); // Map strength to dosage
                data.append('type', formData.type);
                
                // Construct schedule object
                const scheduleObj = {
                    times: formData.times,
                    frequency: formData.frequency,
                    startDate: new Date()
                };
                data.append('schedule', JSON.stringify(scheduleObj));
                
                data.append('notes', formData.notes);
                // data.append('assignedTo', formData.assignedTo); // Not used by backend, but okay to keep if needed later
                data.append('careProfileId', careProfileId);

                // Context Tags
                data.append('contextTags', JSON.stringify(formData.contextTags));

                if (formData.image) {
                    data.append('image', formData.image);
                }

                await createMedication(data);

                alert('✅ Medication saved successfully!');
                navigate('/medications');
            } catch (err) {
                console.error('Error saving medication:', err);
                alert('Failed to save medication. Please check console.');
            } finally {
                setSaving(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
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
                            <p>Enter the medication name and dosage</p>
                        </div>

                        {/* ML Scanner */}
                        <div className="section-scanner">
                            <MedicationScanner
                                onScanComplete={(name, fullText) => {
                                    if (name) {
                                        setFormData(prev => ({ ...prev, medicationName: name }));
                                        // Optional: Try to find dosage in fullText using regex
                                        const strengthMatch = fullText.match(/(\d+\s*mg)/i);
                                        if (strengthMatch) {
                                            setFormData(prev => ({ ...prev, strength: strengthMatch[0] }));
                                        }
                                        alert(`Scanned: ${name}`);
                                    } else {
                                        alert('Could not detect distinct medication name. Please enter manually.');
                                    }
                                }}
                            />
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

                            <div className="input-row">
                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <select
                                        className="form-input"
                                        value={formData.type}
                                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                    >
                                        {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Strength / Dosage</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g., 10mg"
                                        value={formData.strength}
                                        onChange={(e) => setFormData(prev => ({ ...prev, strength: e.target.value }))}
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
                            <p>Add context and instructions</p>
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
                                <div className="photo-upload-wrapper">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        id="medication-image"
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="medication-image" className="photo-upload" style={{ cursor: 'pointer' }}>
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                        ) : (
                                            <>
                                                <span className="photo-upload-icon">📷</span>
                                                <span className="photo-upload-text">Click to upload photo</span>
                                            </>
                                        )}
                                    </label>
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
                                        <p>{formData.medicationName || 'Not specified'} {formData.strength} ({formData.type})</p>
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
                                {previewUrl && (
                                    <div className="review-section">
                                        <div>
                                            <h4>Photo</h4>
                                            <img src={previewUrl} alt="Review" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginTop: '5px' }} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Reminder Preview</label>
                                <div className="notification-preview">
                                    <div className="notification-icon">💊</div>
                                    <div className="notification-content">
                                        <h4>Time for {formData.medicationName || 'medication'}</h4>
                                        <p>{formData.strength} {formData.contextTags[0] ? `• ${formData.contextTags[0]}` : ''}</p>
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
                        <button className="btn-next" onClick={handleNext} disabled={saving}>
                            {saving ? 'Saving...' : (currentStep === 4 ? 'Save Medication' : 'Next')}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddMedication;
