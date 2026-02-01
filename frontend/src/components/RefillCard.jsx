import { useState } from 'react';
import './RefillCard.css';

const RefillCard = ({
    medication,
    daysRemaining,
    urgencyLevel,
    reorderDate,
    onRequestRefill,
    onToggleAutoRefill,
    onFindPharmacy
}) => {
    const [showHistory, setShowHistory] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);

    const getProgressColor = () => {
        switch (urgencyLevel) {
            case 'critical': return '#ef4444'; // Red
            case 'warning': return '#f59e0b'; // Yellow
            case 'caution': return '#eab308'; // Amber
            default: return '#22c55e'; // Green
        }
    };

    const getProgressWidth = () => {
        const maxDays = 30;
        return Math.min(100, (daysRemaining / maxDays) * 100);
    };

    const handleRefill = async (method) => {
        setIsRequesting(true);
        await onRequestRefill(medication._id, method);
        setIsRequesting(false);
    };

    const formatPhone = (phone) => {
        if (!phone) return null;
        return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
    };

    return (
        <div className={`refill-card ${urgencyLevel}`}>
            {/* Header */}
            <div className="card-header">
                <div className="med-info">
                    <span className="med-type-icon">
                        {medication.type === 'Tablet' && '💊'}
                        {medication.type === 'Capsule' && '💊'}
                        {medication.type === 'Syrup' && '🧴'}
                        {medication.type === 'Injection' && '💉'}
                        {medication.type === 'Inhaler' && '🌬️'}
                        {!medication.type && '💊'}
                    </span>
                    <div>
                        <h3 className="med-name">{medication.name}</h3>
                        <p className="med-dosage">{medication.dosage} • {medication.type || 'Tablet'}</p>
                    </div>
                </div>
                <div className="days-badge" style={{ borderColor: getProgressColor() }}>
                    <span className="days-count">{daysRemaining}</span>
                    <span className="days-label">days</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-container">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${getProgressWidth()}%`,
                            backgroundColor: getProgressColor()
                        }}
                    />
                </div>
                <span className="progress-text">
                    {medication.pillsRemaining || 30} pills remaining
                </span>
            </div>

            {/* Reminder */}
            {urgencyLevel !== 'good' && reorderDate && (
                <div className="reorder-reminder">
                    ⏰ Order by <strong>{reorderDate}</strong> to avoid running out
                </div>
            )}

            {/* Pharmacy Info */}
            {medication.pharmacy?.name ? (
                <div className="pharmacy-section">
                    <div className="pharmacy-info">
                        <span className="pharmacy-icon">📍</span>
                        <div>
                            <strong>{medication.pharmacy.name}</strong>
                            {medication.pharmacy.phone && (
                                <a href={`tel:${medication.pharmacy.phone}`} className="pharmacy-phone">
                                    📞 {formatPhone(medication.pharmacy.phone)}
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="integration-badge connected">
                        🔗 Connected
                    </div>
                </div>
            ) : (
                <div className="pharmacy-section not-connected">
                    <span className="no-pharmacy">No pharmacy linked</span>
                    <button className="find-pharmacy-btn" onClick={onFindPharmacy}>
                        🗺️ Find Pharmacy
                    </button>
                </div>
            )}

            {/* Action Buttons */}
            {daysRemaining <= 7 && (
                <div className="action-buttons">
                    <button
                        className="refill-btn pickup"
                        onClick={() => handleRefill('pickup')}
                        disabled={isRequesting}
                    >
                        {isRequesting ? '⏳' : '🏪'} Request Refill
                    </button>
                    <button
                        className="refill-btn delivery"
                        onClick={() => handleRefill('delivery')}
                        disabled={isRequesting}
                    >
                        {isRequesting ? '⏳' : '🚚'} Get Delivered
                    </button>
                </div>
            )}

            {/* Auto-Refill Toggle */}
            <div className="auto-refill-row">
                <label className="toggle-label">
                    <input
                        type="checkbox"
                        checked={medication.autoRefill || false}
                        onChange={() => onToggleAutoRefill(medication._id, medication.autoRefill)}
                    />
                    <span className="toggle-switch"></span>
                    Auto-refill when low
                </label>
            </div>

            {/* Refill History */}
            {medication.refillHistory?.length > 0 && (
                <div className="history-section">
                    <button
                        className="history-toggle"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        📜 Refill History ({medication.refillHistory.length})
                        <span className={`chevron ${showHistory ? 'open' : ''}`}>▼</span>
                    </button>

                    {showHistory && (
                        <div className="history-list">
                            {medication.refillHistory.slice(0, 5).map((entry, idx) => (
                                <div key={idx} className={`history-item ${entry.status}`}>
                                    <span className="history-date">
                                        {new Date(entry.requestedAt).toLocaleDateString()}
                                    </span>
                                    <span className={`history-status ${entry.status}`}>
                                        {entry.status === 'pending' && '⏳ Pending'}
                                        {entry.status === 'approved' && '✅ Approved'}
                                        {entry.status === 'ready' && '📦 Ready for Pickup'}
                                        {entry.status === 'picked_up' && '✓ Picked Up'}
                                        {entry.status === 'delivered' && '🚚 Delivered'}
                                    </span>
                                    <span className="history-method">
                                        {entry.deliveryMethod === 'delivery' ? '🏠' : '🏪'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RefillCard;
