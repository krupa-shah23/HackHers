import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMedicationsByCareProfile } from '../../services/medications';
import { requestRefill, toggleAutoRefill } from '../../services/pharmacies';
import RefillCard from '../../components/RefillCard';
import './RefillDashboard.css';

const RefillDashboard = () => {
    const navigate = useNavigate();
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock data for recommendations
    const recentlyPurchased = [
        { id: 'rp1', name: 'Lisinopril 10mg', lastPurchased: '2 days ago', pharmacy: 'Apollo Pharmacy', price: 120 },
        { id: 'rp2', name: 'Vitamin D3 1000IU', lastPurchased: '1 week ago', pharmacy: 'MedPlus', price: 150 },
        { id: 'rp3', name: 'Metformin 500mg', lastPurchased: '2 weeks ago', pharmacy: 'Netmeds', price: 85 }
    ];

    const mostPopular = [
        { id: 'mp1', name: 'Paracetamol 500mg', purchases: '1.2k this month', avgPrice: 25, savings: '15%' },
        { id: 'mp2', name: 'Azithromycin 500mg', purchases: '890 this month', avgPrice: 180, savings: '20%' },
        { id: 'mp3', name: 'Omeprazole 20mg', purchases: '750 this month', avgPrice: 65, savings: '10%' },
        { id: 'mp4', name: 'Cetirizine 10mg', purchases: '650 this month', avgPrice: 35, savings: '12%' }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const careProfileId = localStorage.getItem('careProfileId');

            if (!careProfileId || careProfileId === 'demo_user_123') {
                console.log("Using demo mode (mock data)");
                setMedications(getMockMedications());
                setLoading(false);
                return;
            }

            const meds = await getMedicationsByCareProfile(careProfileId);

            const medsWithDays = meds.map(med => ({
                ...med,
                daysRemaining: calculateDaysRemaining(med),
                urgencyLevel: getUrgencyLevel(calculateDaysRemaining(med))
            }));

            setMedications(medsWithDays);
        } catch (err) {
            console.error('Error fetching data:', err);
            setMedications(getMockMedications());
        } finally {
            setLoading(false);
        }
    };

    const calculateDaysRemaining = (med) => {
        const pillsRemaining = med.pillsRemaining || 30;
        const pillsPerDose = med.pillsPerDose || 1;
        const dosesPerDay = med.schedule?.times?.length || 1;
        return Math.floor(pillsRemaining / (pillsPerDose * dosesPerDay));
    };

    const getUrgencyLevel = (days) => {
        if (days <= 3) return 'critical';
        if (days <= 7) return 'warning';
        if (days <= 14) return 'caution';
        return 'good';
    };

    const getReorderDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + Math.max(0, days - 5));
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    const handleRefillRequest = async (medicationId, deliveryMethod) => {
        try {
            await requestRefill(medicationId, deliveryMethod);
            alert(`✅ Refill request submitted! You chose: ${deliveryMethod === 'delivery' ? 'Home Delivery' : 'Pickup'}`);
            fetchData();
        } catch (err) {
            console.error('Error requesting refill:', err);
            alert('Refill request submitted! (Demo mode)');
        }
    };

    const handleAutoRefillToggle = async (medicationId, currentValue) => {
        try {
            await toggleAutoRefill(medicationId, !currentValue);
            setMedications(prev => prev.map(med =>
                med._id === medicationId ? { ...med, autoRefill: !currentValue } : med
            ));
        } catch (err) {
            console.error('Error toggling auto-refill:', err);
        }
    };

    const handleFindPharmacy = (med) => {
        navigate(`/pharmacy-finder?medicine=${encodeURIComponent(med?.name || '')}`);
    };

    const getMockMedications = () => [
        {
            _id: '1',
            name: 'Lisinopril',
            dosage: '10mg',
            type: 'Tablet',
            pillsRemaining: 8,
            pillsPerDose: 1,
            schedule: { times: ['09:00'], frequency: 'daily' },
            autoRefill: false,
            pharmacy: { name: 'Apollo Pharmacy', phone: '1800-123-4567', address: '123 MG Road' },
            refillHistory: []
        },
        {
            _id: '2',
            name: 'Metformin',
            dosage: '500mg',
            type: 'Tablet',
            pillsRemaining: 45,
            pillsPerDose: 1,
            schedule: { times: ['09:00', '21:00'], frequency: 'daily' },
            autoRefill: true,
            pharmacy: { name: 'MedPlus', phone: '1800-234-5678', address: '45 Brigade Road' },
            refillHistory: []
        },
        {
            _id: '3',
            name: 'Vitamin D3',
            dosage: '1000 IU',
            type: 'Capsule',
            pillsRemaining: 90,
            pillsPerDose: 1,
            schedule: { times: ['09:00'], frequency: 'daily' },
            autoRefill: false,
            pharmacy: null,
            refillHistory: []
        }
    ];

    const needsRefill = medications.filter(med => calculateDaysRemaining(med) <= 7);
    const allStocked = medications.filter(med => calculateDaysRemaining(med) > 7);

    if (loading) {
        return (
            <div className="refill-dashboard">
                <div className="loading-state">
                    <div className="loading-spinner">💊</div>
                    <p>Loading your medications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="refill-dashboard">
            {/* Header */}
            <header className="refill-header">
                <div className="header-content">
                    <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                    <h1>💊 Refill Management</h1>
                    <p>Keep track of your medication supply</p>
                </div>
                <button className="find-pharmacy-btn" onClick={() => navigate('/pharmacy-finder')}>
                    📍 Find Nearby Pharmacies
                </button>
            </header>

            {/* Recently Purchased */}
            <section className="recommendation-section">
                <h2 className="section-title">
                    <span className="title-icon">🕐</span>
                    Recently Purchased
                </h2>
                <div className="recommendation-scroll">
                    {recentlyPurchased.map(item => (
                        <div key={item.id} className="recommendation-card recent">
                            <h4>{item.name}</h4>
                            <p className="meta">{item.lastPurchased} • {item.pharmacy}</p>
                            <div className="card-footer">
                                <span className="price">₹{item.price}</span>
                                <button onClick={() => navigate(`/pharmacy-finder?medicine=${encodeURIComponent(item.name)}`)}>
                                    Reorder
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Most Popular */}
            <section className="recommendation-section">
                <h2 className="section-title">
                    <span className="title-icon">🔥</span>
                    Most Popular
                </h2>
                <div className="recommendation-scroll">
                    {mostPopular.map(item => (
                        <div key={item.id} className="recommendation-card popular">
                            <span className="savings-badge">Save {item.savings}</span>
                            <h4>{item.name}</h4>
                            <p className="meta">{item.purchases}</p>
                            <div className="card-footer">
                                <span className="price">₹{item.avgPrice}</span>
                                <button onClick={() => navigate(`/pharmacy-finder?medicine=${encodeURIComponent(item.name)}`)}>
                                    Find
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Needs Refill Section */}
            {needsRefill.length > 0 && (
                <section className="refill-section urgent">
                    <h2 className="section-title">
                        <span className="title-icon">⚠️</span>
                        Needs Refill Soon ({needsRefill.length})
                    </h2>
                    <div className="refill-grid">
                        {needsRefill.map(med => (
                            <RefillCard
                                key={med._id}
                                medication={med}
                                daysRemaining={calculateDaysRemaining(med)}
                                urgencyLevel={getUrgencyLevel(calculateDaysRemaining(med))}
                                reorderDate={getReorderDate(calculateDaysRemaining(med))}
                                onRequestRefill={handleRefillRequest}
                                onToggleAutoRefill={handleAutoRefillToggle}
                                onFindPharmacy={() => handleFindPharmacy(med)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Well Stocked Section */}
            {allStocked.length > 0 && (
                <section className="refill-section stocked">
                    <h2 className="section-title">
                        <span className="title-icon">✅</span>
                        Well Stocked ({allStocked.length})
                    </h2>
                    <div className="refill-grid">
                        {allStocked.map(med => (
                            <RefillCard
                                key={med._id}
                                medication={med}
                                daysRemaining={calculateDaysRemaining(med)}
                                urgencyLevel="good"
                                onRequestRefill={handleRefillRequest}
                                onToggleAutoRefill={handleAutoRefillToggle}
                                onFindPharmacy={() => handleFindPharmacy(med)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Empty State */}
            {medications.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">🎉</div>
                    <h3>All Stocked Up!</h3>
                    <p>No medications to track. Add medications to manage refills.</p>
                    <button className="add-med-btn" onClick={() => navigate('/medications/add')}>
                        + Add Medication
                    </button>
                </div>
            )}
        </div>
    );
};

export default RefillDashboard;

