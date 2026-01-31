import { useState } from 'react';
import './CaregiverDashboard.css';

const CaregiverDashboard = () => {
    const [filter, setFilter] = useState('today'); // today, week, person

    // Mock Data
    const timeline = [
        {
            id: 1,
            time: '9:00 AM',
            pillName: 'Morning Dose',
            pillDetails: 'Lisinopril • 10mg',
            status: 'Taken', // taken, due, missed
            statusType: 'taken',
            person: { name: 'Dad', avatar: 'https://ui-avatars.com/api/?name=Dad&background=bfdbfe&color=1e3a8a' },
            message: 'Dad took his 9 AM dose ✓'
        },
        {
            id: 2,
            time: '12:00 PM',
            pillName: 'Vitamin D',
            pillDetails: '1000 IU',
            status: 'Due',
            statusType: 'due',
            person: { name: 'Mom', avatar: 'https://ui-avatars.com/api/?name=Mom&background=fce7f3&color=831843' },
            message: 'Upcoming: Mom’s Vitamin D'
        },
        {
            id: 3,
            time: 'Yesterday',
            pillName: 'Evening Meds',
            pillDetails: 'Metformin',
            status: 'Missed',
            statusType: 'missed',
            person: { name: 'Dad', avatar: 'https://ui-avatars.com/api/?name=Dad&background=bfdbfe&color=1e3a8a' },
            message: 'Dad missed this. Gentle alert sent.'
        }
    ];

    const adherenceData = [80, 100, 100, 60, 100, 90, 85]; // percentages

    return (
        <div className="caregiver-dashboard">
            {/* Header */}
            <header className="dashboard-header-modern">
                <div className="greeting-section">
                    <h1>Good Morning, Asha. ☀️</h1>
                    <p>Everything's on track today. You're doing great!</p>
                </div>
                <div className="status-badge-calm">
                    ✨ Peace of Mind: Active
                </div>
            </header>

            {/* Quick Filters */}
            <div className="quick-filters">
                <button className={`filter-btn ${filter === 'today' ? 'active' : ''}`} onClick={() => setFilter('today')}>Today</button>
                <button className={`filter-btn ${filter === 'week' ? 'active' : ''}`} onClick={() => setFilter('week')}>This Week</button>
                <button className={`filter-btn ${filter === 'person' ? 'active' : ''}`} onClick={() => setFilter('person')}>By Person</button>
            </div>

            <div className="dashboard-grid">
                {/* Left: River Timeline */}
                <div className="timeline-river">
                    {timeline.map(item => (
                        <div key={item.id} className="river-card">
                            <div className={`river-connector ${item.statusType}`}></div>

                            <div className="river-header">
                                <div className="pill-info">
                                    <div className="pill-nickname">{item.pillName}</div>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.pillDetails}</span>
                                </div>
                                <div className="pill-time">{item.time}</div>
                            </div>

                            <div className="river-person">
                                <img src={item.person.avatar} alt={item.person.name} className="river-avatar" />
                                <span className="river-message">{item.message}</span>
                            </div>

                            {/* Gentle Actions (only if needed) */}
                            {item.statusType === 'due' && (
                                <button style={{
                                    background: 'none', border: 'none', color: '#3b82f6', fontWeight: '600', cursor: 'pointer', padding: '0'
                                }}>
                                    Mark as taken
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right: Widgets */}
                <div className="widgets-column">
                    {/* Weekly Adherence */}
                    <div className="widget-card">
                        <div className="widget-title">📊 Weekly Adherence</div>
                        <div className="adherence-graph">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                                <div key={idx} className="graph-bar-container">
                                    <div
                                        className={`graph-bar ${adherenceData[idx] >= 100 ? 'filled' : ''}`}
                                        style={{ height: `${adherenceData[idx]}%`, opacity: adherenceData[idx] >= 100 ? 1 : 0.5 }}
                                    ></div>
                                    <span className="graph-day">{day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Care Pulse */}
                    <div className="widget-card">
                        <div className="widget-title">💓 Care Pulse (Family Mood)</div>
                        <div className="care-pulse">
                            <div className="sentiment-dot" title="Dad">👴</div>
                            <div className="sentiment-line"></div>
                            <div className="sentiment-dot active" title="Mom">👵</div>
                            <div className="sentiment-line"></div>
                            <div className="sentiment-dot" title="Asha">👩</div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', marginTop: '0.5rem' }}>
                            Mom is feeling great today!
                        </p>
                    </div>

                    {/* Pharmacy Sync */}
                    <div className="pharmacy-sync">
                        <div className="sync-icon">💊</div>
                        <div className="sync-info">
                            <h4>Pharmacy Sync</h4>
                            <p>Next refill due in 5 days</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Actions */}
            <div className="quick-manage">
                <button className="manage-btn primary">➕ Add Med</button>
                <button className="manage-btn">💊 Refill</button>
                <button className="manage-btn">💬 Check-in</button>
            </div>
        </div>
    );
};

export default CaregiverDashboard;
