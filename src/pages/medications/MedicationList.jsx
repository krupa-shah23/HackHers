import { useState } from 'react';
import './MedicationList.css';

const MedicationList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    // Mock medication data
    const medications = [
        {
            id: 1,
            nickname: 'BP wali',
            medicalName: 'Lisinopril 10mg',
            person: 'Dad',
            personAvatar: 'https://ui-avatars.com/api/?name=Dad&background=3b82f6&color=fff',
            pillIcon: '💊',
            nextDose: 'in 2 hours',
            status: 'due-soon',
            dosage: '1 tablet',
            frequency: 'Twice daily',
            refillDays: 12,
            hasWarning: false
        },
        {
            id: 2,
            nickname: 'Vitamin D',
            medicalName: '1000 IU Capsule',
            person: 'Mom',
            personAvatar: 'https://ui-avatars.com/api/?name=Mom&background=ec4899&color=fff',
            pillIcon: '🟡',
            nextDose: 'Due now!',
            status: 'due-now',
            dosage: '1 capsule',
            frequency: 'Daily',
            refillDays: 25,
            hasWarning: false
        },
        {
            id: 3,
            nickname: 'Sugar medicine',
            medicalName: 'Metformin 500mg',
            person: 'Dad',
            personAvatar: 'https://ui-avatars.com/api/?name=Dad&background=3b82f6&color=fff',
            pillIcon: '⚪',
            nextDose: 'in 5 hours',
            status: 'due-soon',
            dosage: '1 tablet',
            frequency: 'With meals',
            refillDays: 8,
            hasWarning: true,
            warningText: 'Take 2 hours apart from BP medicine'
        },
        {
            id: 4,
            nickname: 'Heart tablet',
            medicalName: 'Aspirin 75mg',
            person: 'Dad',
            personAvatar: 'https://ui-avatars.com/api/?name=Dad&background=3b82f6&color=fff',
            pillIcon: '❤️',
            nextDose: 'Taken ✓',
            status: 'taken',
            dosage: '1 tablet',
            frequency: 'Evening',
            refillDays: 30,
            hasWarning: false
        }
    ];

    const filteredMeds = medications.filter(med => {
        const matchesSearch = med.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            med.medicalName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' ||
            med.person.toLowerCase() === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const takenCount = medications.filter(m => m.status === 'taken').length;
    const pendingCount = medications.filter(m => m.status !== 'taken').length;

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
                    <button className="btn-primary">
                        ➕ Add Medication
                    </button>
                </div>
            </header>

            {/* Stats - Same style as status-badge-calm */}
            <div className="stats-row">
                <span className="stat-badge">✓ {takenCount} Taken Today</span>
                <span className="stat-badge">⏰ {pendingCount} Pending</span>
            </div>

            {/* Quick Filters - Same as CaregiverDashboard */}
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

            {/* Medications Grid */}
            <div className="meds-grid">
                {filteredMeds.map(med => (
                    <div key={med.id} className="med-card">
                        <div className="card-header">
                            <div className="pill-icon">{med.pillIcon}</div>
                            <span className={`status-badge ${med.status}`}>
                                {med.nextDose}
                            </span>
                        </div>

                        <div className="person-badge">
                            <img src={med.personAvatar} alt={med.person} className="person-avatar" />
                            <span className="person-name">{med.person}</span>
                        </div>

                        <h3 className="med-name">"{med.nickname}"</h3>
                        <p className="med-medical-name">{med.medicalName}</p>

                        {med.hasWarning && (
                            <div className="warning-badge">
                                ⚠️ {med.warningText}
                            </div>
                        )}

                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="detail-label">Dosage</span>
                                <span className="detail-value">{med.dosage}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Frequency</span>
                                <span className="detail-value">{med.frequency}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Refill In</span>
                                <span className="detail-value">{med.refillDays} days</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Status</span>
                                <span className="detail-value">
                                    {med.status === 'taken' ? '✓ Taken' : 'Pending'}
                                </span>
                            </div>
                        </div>

                        <div className="card-actions">
                            <button className="action-btn">✏️ Edit</button>
                            <button className="action-btn">📜 History</button>
                            <button className="action-btn primary">✓ Mark Taken</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MedicationList;
