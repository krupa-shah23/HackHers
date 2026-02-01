import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLogsByCareProfile, createMedicationLog } from '../../api/medicationLogs';
import { getMedicationsByCareProfile } from '../../api/medications';
import { getUpcomingRefills } from '../../api/refills';
import { getRecentCheckIns, createCheckIn } from '../../api/dailyCheckins';
import { getInsights, acceptInsight, dismissInsight, getRiskScore } from '../../api/insights';
import SmartInsightsBanner from '../../components/SmartInsightsBanner';
import CheckInModal from '../../components/CheckInModal';
import { analyzeDosePatterns } from '../../utils/patternAnalysis';
import './CaregiverDashboard.css';

const CaregiverDashboard = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('today');
    const [timeline, setTimeline] = useState([]);
    const [adherenceData, setAdherenceData] = useState([80, 100, 100, 60, 100, 90, 85]);
    const [refillInfo, setRefillInfo] = useState({ days: 5 });
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Caregiver');
    const [insights, setInsights] = useState([]);
    const [riskData, setRiskData] = useState(null);

    // Check-in State
    const [isCheckInOpen, setIsCheckInOpen] = useState(false);

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const careProfileId = localStorage.getItem('careProfileId') || 'demo_user_123';

                // Fetch data in parallel
                const [logs, meds, refills, serverInsights, risk] = await Promise.all([
                    getLogsByCareProfile(careProfileId).catch(() => []),
                    getMedicationsByCareProfile(careProfileId).catch(() => []),
                    getUpcomingRefills().catch(() => []),
                    getInsights(careProfileId).catch(() => []),
                    getRiskScore(careProfileId).catch(() => null)
                ]);

                if (risk) setRiskData(risk);

                // 1. Process Timeline
                const formattedTimeline = logs.slice(0, 5).map(log => ({
                    id: log._id,
                    time: formatTime(log.scheduledTime || log.takenAt || log.createdAt),
                    pillName: log.medicationName || 'Medication',
                    pillDetails: log.dosage || '',
                    status: log.status,
                    statusType: log.status?.toLowerCase() || 'due',
                    person: {
                        name: log.personName || 'Family',
                        avatar: `https://ui-avatars.com/api/?name=${log.personName || 'F'}&background=bfdbfe&color=1e3a8a`
                    },
                    message: getStatusMessage(log)
                }));
                if (formattedTimeline.length > 0) setTimeline(formattedTimeline);

                // 2. Process Refills
                if (refills?.length > 0) setRefillInfo({ days: refills[0].daysUntilRefill || 5 });

                // 3. Run Client-Side Pattern Analysis (Zero Latency)
                const localInsights = analyzeDosePatterns(logs, meds);

                // Combine Server + Local Insights
                // Filter out duplicates if necessary (using title/message)
                setInsights([...serverInsights, ...localInsights]);

                // User Name
                const storedName = localStorage.getItem('userName');
                if (storedName) setUserName(storedName);

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                // Fallback mock insights
                setInsights([
                    {
                        _id: 'mock-1',
                        type: 'late_pattern',
                        title: '🧠 Smart Insight',
                        message: 'You tend to take your evening medicine around 10 PM instead of 9 PM.',
                        suggestion: 'Would you like to adjust the schedule?',
                        patternData: { occurrences: 4, total: 7 },
                        actionType: 'adjust_time',
                        status: 'pending'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Helper functions
    const formatTime = (dateStr) => {
        if (!dateStr) return 'Now';
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const getStatusMessage = (log) => {
        const name = log.personName || 'Family member';
        if (log.status === 'taken') return `${name} took their dose ✓`;
        if (log.status === 'missed') return `${name} missed this. Gentle alert sent.`;
        return `Upcoming: ${name}'s ${log.medicationName || 'medication'}`;
    };

    // Mark medication as taken
    const handleMarkTaken = async (itemId) => {
        try {
            await createMedicationLog({
                medicationId: itemId,
                status: 'taken',
                takenAt: new Date().toISOString()
            });

            setTimeline(prev => prev.map(item =>
                item.id === itemId
                    ? { ...item, statusType: 'taken', message: item.message.replace('Upcoming:', 'Taken ✓') }
                    : item
            ));
        } catch (err) {
            console.error('Error marking as taken:', err);
        }
    };

    const handleCheckInSubmit = async (data) => {
        console.log('Check-in submitted:', data);
        // In real app: await createCheckIn(data);
        alert('Check-in saved! Thanks for sharing. 🌟');
    };

    // Mock timeline for fallback
    const mockTimeline = [
        {
            id: 1,
            time: '9:00 AM',
            pillName: 'Morning Dose',
            pillDetails: 'Lisinopril • 10mg',
            status: 'Taken',
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
            message: "Upcoming: Mom's Vitamin D"
        }
    ];

    const displayTimeline = timeline.length > 0 ? timeline : mockTimeline;

    if (loading) {
        return (
            <div className="caregiver-dashboard">
                <div className="loading-state">
                    <div className="loading-spinner">💊</div>
                    <p>Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="caregiver-dashboard">
            {/* Header */}
            <header className="dashboard-header-modern">
                <div className="greeting-section">
                    <h1>{getGreeting()}, {userName}. ☀️</h1>
                    <p>Everything's on track today. You're doing great!</p>
                </div>
                <div className="status-badge-calm">
                    ✨ Peace of Mind: Active
                </div>
            </header>

            {/* Smart Insights Banner */}
            {insights.length > 0 && (
                <SmartInsightsBanner
                    insights={insights}
                    onAccept={acceptInsight}
                    onDismiss={dismissInsight}
                />
            )}

            {/* Quick Filters */}
            <div className="quick-filters">
                <button className={`filter-btn ${filter === 'today' ? 'active' : ''}`} onClick={() => setFilter('today')}>Today</button>
                <button className={`filter-btn ${filter === 'week' ? 'active' : ''}`} onClick={() => setFilter('week')}>This Week</button>
                <button className={`filter-btn ${filter === 'person' ? 'active' : ''}`} onClick={() => setFilter('person')}>By Person</button>
            </div>

            <div className="dashboard-grid">
                {/* Left: River Timeline */}
                <div className="timeline-river">
                    {displayTimeline.map(item => (
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

                            {/* Gentle Actions */}
                            {item.statusType === 'due' && (
                                <button
                                    onClick={() => handleMarkTaken(item.id)}
                                    style={{
                                        background: 'none', border: 'none', color: '#3b82f6', fontWeight: '600', cursor: 'pointer', padding: '0'
                                    }}
                                >
                                    Mark as taken
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right: Widgets */}
                <div className="widgets-column">
                    {/* Risk Score (ML) */}
                    <div className="widget-card">
                        <div className="widget-title">🔮 Adherence Prediction</div>
                        {riskData ? (
                            <div className="risk-widget" style={{ textAlign: 'center', padding: '10px' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: riskData.riskColor }}>
                                    {riskData.riskLevel} Risk
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '8px' }}>
                                    Risk Score: {riskData.riskScore}/100
                                </div>
                                <div style={{
                                    background: '#f1f5f9',
                                    borderRadius: '8px',
                                    height: '8px',
                                    width: '100%',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${riskData.riskScore}%`,
                                        height: '100%',
                                        background: riskData.riskColor,
                                        transition: 'width 0.5s ease'
                                    }}></div>
                                </div>
                                <p style={{ fontSize: '0.8rem', marginTop: '10px', color: '#475569' }}>
                                    {riskData.message}
                                </p>
                            </div>
                        ) : (
                            <p style={{ color: '#94a3b8', textAlign: 'center' }}>Gathering data for prediction...</p>
                        )}
                    </div>

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
                        <div className="widget-title">💓 Family Mood</div>
                        <div className="care-pulse">
                            <div className="sentiment-dot" title="Dad">👴</div>
                            <div className="sentiment-line"></div>
                            <div className="sentiment-dot active" title="Mom">👵</div>
                            <div className="sentiment-line"></div>
                            <div className="sentiment-dot" title="You">👩</div>
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
                            <p>Next refill due in {refillInfo.days} days</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Actions */}
            <div className="quick-manage">
                <button className="manage-btn primary" onClick={() => navigate('/medications/add')}>➕ Add Med</button>
                <button className="manage-btn" onClick={() => navigate('/refills')}>
                    💊 Refill
                </button>
                <button className="manage-btn" onClick={() => setIsCheckInOpen(true)}>
                    💬 Check-in
                </button>
            </div>

            {/* Check-in Modal */}
            <CheckInModal
                isOpen={isCheckInOpen}
                onClose={() => setIsCheckInOpen(false)}
                onSubmit={handleCheckInSubmit}
                userName={userName}
            />
        </div>
    );
};

export default CaregiverDashboard;
