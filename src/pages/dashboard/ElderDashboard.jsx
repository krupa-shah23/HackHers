import { useState, useEffect } from 'react';
import './ElderDashboard.css';

const ElderDashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [medicationTaken, setMedicationTaken] = useState(false);

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = () => {
        return currentTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleTookIt = () => {
        setMedicationTaken(true);
        // Voice feedback could be added here
        setTimeout(() => {
            alert("Great job! Your family has been notified. ✅");
        }, 300);
    };

    const handleRemindLater = () => {
        alert("Okay! I'll remind you in 10 minutes. ⏰");
    };

    const handleVoiceAssistant = () => {
        alert("🎙️ Voice Assistant: Press and hold to ask me anything!");
    };

    const handleCallAsha = () => {
        alert("📞 Calling Asha...");
    };

    const handleSOS = () => {
        if (confirm("🆘 Emergency! Call for help?")) {
            alert("Calling emergency contact...");
        }
    };

    const routineSteps = [
        { id: 1, label: 'Morning Meds', icon: '💊', status: medicationTaken ? 'completed' : 'current' },
        { id: 2, label: 'Walk', icon: '🚶', status: 'pending' },
        { id: 3, label: 'Lunch', icon: '🍽️', status: 'pending' },
        { id: 4, label: 'Evening Meds', icon: '💊', status: 'pending' }
    ];

    return (
        <div className="elder-dashboard-v2">
            {/* Top Bar */}
            <div className="elder-top-bar">
                <div className="current-time-large">{formatTime()}</div>
                <button className="voice-button-pulse" onClick={handleVoiceAssistant} aria-label="Voice Assistant">
                    🎙️
                </button>
            </div>

            {/* Main Content */}
            <div className="elder-main-content">
                {/* Medication Card */}
                {!medicationTaken && (
                    <div className="medication-card-giant">
                        <div className="pill-image-large">💊</div>
                        <h2 className="med-title-simple">Your Morning Medicine</h2>
                        <p className="med-name-simple">Blood Pressure Medicine</p>

                        <div className="giant-action-buttons">
                            <button className="giant-btn took-it" onClick={handleTookIt}>
                                ✓ I Took It
                            </button>
                            <button className="giant-btn remind-later" onClick={handleRemindLater}>
                                ⏰ Remind Me in 10 Min
                            </button>
                        </div>
                    </div>
                )}

                {medicationTaken && (
                    <div className="medication-card-giant">
                        <div className="pill-image-large">✅</div>
                        <h2 className="med-title-simple">All Done!</h2>
                        <p className="med-name-simple">You're doing great today.</p>
                    </div>
                )}

                {/* Today's Routine */}
                <div className="routine-card">
                    <h3 className="routine-title">Today's Routine</h3>
                    <div className="routine-steps">
                        {routineSteps.map(step => (
                            <div key={step.id} className="routine-step">
                                <div className={`step-icon ${step.status}`}>
                                    {step.status === 'completed' ? '✓' : step.icon}
                                </div>
                                <span className="step-label">{step.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call Asha Button */}
                <button className="call-asha-button" onClick={handleCallAsha}>
                    📞 Call Asha
                </button>
            </div>

            {/* SOS Button - Subtle but accessible */}
            <button className="sos-button-subtle" onClick={handleSOS} aria-label="Emergency SOS">
                SOS
            </button>
        </div>
    );
};

export default ElderDashboard;
