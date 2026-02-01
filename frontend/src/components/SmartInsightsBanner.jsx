import React from 'react';
import './SmartInsightsBanner.css';

const SmartInsightsBanner = ({ insights, onAccept, onDismiss }) => {
    if (!insights || insights.length === 0) return null;

    // Show only the top priority insight
    const insight = insights[0];

    return (
        <div className={`smart-insight-banner ${insight.type}`}>
            <div className="insight-icon">
                {insight.title.includes('Smart') ? '🧠' : '🎉'}
            </div>
            <div className="insight-content">
                <h4>{insight.title}</h4>
                <p>{insight.message}</p>
                {insight.suggestion && (
                    <p className="insight-suggestion">{insight.suggestion}</p>
                )}
            </div>
            <div className="insight-actions">
                 {insight.actionType === 'adjust_time' && (
                    <button className="btn-accept" onClick={() => onAccept(insight._id)}>
                        Yes, Adjust
                    </button>
                 )}
                <button className="btn-dismiss" onClick={() => onDismiss(insight._id)}>
                    Dismiss
                </button>
            </div>
        </div>
    );
};

export default SmartInsightsBanner;
