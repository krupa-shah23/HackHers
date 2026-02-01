import { useState, useEffect } from 'react';
import './MedicationList.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MedicationList = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch medications from API
    useEffect(() => {
        const fetchMedications = async () => {
            try {
                // Hardcoded careProfileId for now
                const careProfileId = "507f1f77bcf86cd799439011"; 
                const response = await axios.get(`http://localhost:5000/api/medications/care-profile/${careProfileId}`);
                setMedications(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching medications:", err);
                setError("Failed to load medications");
                setLoading(false);
            }
        };

        fetchMedications();
    }, []);

    const filteredMeds = medications.filter(med => {
        const matchesSearch = (med.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (med.type || '').toLowerCase().includes(searchQuery.toLowerCase());
        // Filter logic can be expanded
        return matchesSearch;
    });

    const takenCount = medications.filter(m => m.active).length; // Just using active for now
    const pendingCount = 0; // consistent mock for now

    return (
        <div className="medication-list-screen">
            {/* Header - Same style as CaregiverDashboard */}
            <header className="med-page-header">
                <div className="page-title-section">
                    <h1>Medications</h1>
                    <p>Manage your family's medication schedule</p>
                </div>
                <div className="header-actions">
                    <div className="search-wrapper">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search medications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary" onClick={() => navigate('/medications/add')}>
                        ➕ Add Medication
                    </button>
                </div>
            </header>

            {/* Stats */}
            <div className="stats-row">
                <span className="stat-badge">✓ {takenCount} Active</span>
                <span className="stat-badge">⏰ {pendingCount} Pending</span>
            </div>

            {/* Quick Filters */}
            <div className="quick-filters">
                {['all', 'dad', 'mom'].map(filter => (
                    <button
                        key={filter}
                        className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                ))}
            </div>

            {loading && <p>Loading medications...</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Medications Grid */}
            <div className="meds-grid">
                {!loading && filteredMeds.length === 0 && <p>No medications found.</p>}
                
                {filteredMeds.map(med => (
                    <div key={med._id} className="med-card">
                        <div className="card-header">
                            <div className="pill-icon">{med.type === 'Syrup' ? '🍼' : '💊'}</div>
                            <span className={`status-badge due-soon`}>
                                {med.schedule?.times?.[0] || 'No time'}
                            </span>
                        </div>

                        <div className="person-badge">
                             {/* Placeholder for person avatar */}
                            <img src={`https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff`} alt="User" className="person-avatar" />
                            <span className="person-name">User</span>
                        </div>

                        <h3 className="med-name">{med.name}</h3>
                        <p className="med-medical-name">{med.type} - {med.dosage}</p>
                        
                        {med.imageUrl && (
                            <div className="med-image-container">
                                <img src={med.imageUrl} alt={med.name} className="med-image" style={{maxWidth: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px'}}/>
                            </div>
                        )}

                        {med.notes && (
                            <div className="warning-badge" style={{backgroundColor: '#f0f9ff', color: '#0369a1', borderColor: '#bae6fd'}}>
                                ℹ️ {med.notes}
                            </div>
                        )}

                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="detail-label">Dosage</span>
                                <span className="detail-value">{med.dosage}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Frequency</span>
                                <span className="detail-value">{med.schedule?.frequency}</span>
                            </div>
                        </div>

                        <div className="card-actions">
                            <button className="action-btn">✏️ Edit</button>
                            <button className="action-btn primary">✓ Mark Taken</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MedicationList;
