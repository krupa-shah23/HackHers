import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './PharmacyFinder.css';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons
const pharmacyIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Recenter map component
const RecenterMap = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 14);
    }, [center, map]);
    return null;
};

const PharmacyFinder = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchMedicine = searchParams.get('medicine') || '';

    const [userLocation, setUserLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchMedicine);
    const [selectedRadius, setSelectedRadius] = useState(2); // km
    const [pharmacies, setPharmacies] = useState([]);

    // Mock nearby pharmacies - in production, fetch from API based on location
    const mockNearbyPharmacies = [
        {
            _id: '1',
            name: 'Apollo Pharmacy - MG Road',
            phone: '080-4123-4567',
            address: '123 MG Road, 0.3 km away',
            distance: 0.3,
            location: { lat: 12.9720, lng: 77.5950 },
            isConnected: true,
            deliveryAvailable: true,
            deliveryFee: 0,
            inventory: [
                { medicationName: 'Lisinopril', price: 120, inStock: true },
                { medicationName: 'Metformin', price: 85, inStock: true },
                { medicationName: 'Vitamin D3', price: 150, inStock: true }
            ]
        },
        {
            _id: '2',
            name: 'MedPlus - Brigade Road',
            phone: '080-4234-5678',
            address: '45 Brigade Road, 0.5 km away',
            distance: 0.5,
            location: { lat: 12.9750, lng: 77.6066 },
            isConnected: false,
            deliveryAvailable: true,
            deliveryFee: 25,
            inventory: [
                { medicationName: 'Lisinopril', price: 135, inStock: true },
                { medicationName: 'Metformin', price: 80, inStock: true },
                { medicationName: 'Omeprazole', price: 65, inStock: true }
            ]
        },
        {
            _id: '3',
            name: 'Wellness Forever',
            phone: '080-4345-6789',
            address: '78 Church Street, 0.8 km away',
            distance: 0.8,
            location: { lat: 12.9700, lng: 77.6000 },
            isConnected: true,
            deliveryAvailable: true,
            deliveryFee: 20,
            inventory: [
                { medicationName: 'Lisinopril', price: 110, inStock: true },
                { medicationName: 'Vitamin D3', price: 140, inStock: true },
                { medicationName: 'Amlodipine', price: 95, inStock: false }
            ]
        },
        {
            _id: '4',
            name: '1mg Store - Indiranagar',
            phone: '080-4456-7890',
            address: '22 100ft Road, 1.2 km away',
            distance: 1.2,
            location: { lat: 12.9784, lng: 77.6408 },
            isConnected: true,
            deliveryAvailable: true,
            deliveryFee: 0,
            inventory: [
                { medicationName: 'Metformin', price: 78, inStock: true },
                { medicationName: 'Omeprazole', price: 58, inStock: true },
                { medicationName: 'Vitamin D3', price: 135, inStock: true }
            ]
        },
        {
            _id: '5',
            name: 'Netmeds Store',
            phone: '080-4567-8901',
            address: '55 Koramangala, 1.5 km away',
            distance: 1.5,
            location: { lat: 12.9352, lng: 77.6245 },
            isConnected: true,
            deliveryAvailable: true,
            deliveryFee: 0,
            inventory: [
                { medicationName: 'Lisinopril', price: 105, inStock: true },
                { medicationName: 'Amlodipine', price: 88, inStock: true }
            ]
        }
    ];

    useEffect(() => {
        getUserLocation();
    }, []);

    const getUserLocation = () => {
        setLocationLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLocationLoading(false);
                    // Filter pharmacies by radius
                    filterPharmaciesByRadius(mockNearbyPharmacies, selectedRadius);
                },
                (error) => {
                    console.log("Location access denied, using default");
                    // Default to Bangalore
                    setUserLocation({ lat: 12.9716, lng: 77.5946 });
                    setLocationLoading(false);
                    filterPharmaciesByRadius(mockNearbyPharmacies, selectedRadius);
                }
            );
        }
    };

    const filterPharmaciesByRadius = (allPharmacies, radius) => {
        const filtered = allPharmacies.filter(p => p.distance <= radius);
        setPharmacies(filtered.sort((a, b) => a.distance - b.distance));
    };

    const handleRadiusChange = (radius) => {
        setSelectedRadius(radius);
        filterPharmaciesByRadius(mockNearbyPharmacies, radius);
    };

    const handleNavigate = (pharmacy) => {
        // Use search query for better accuracy with real places
        const query = encodeURIComponent(`${pharmacy.name}, ${pharmacy.address}`);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        window.open(url, '_blank');
    };

    const handleCall = (phone) => {
        window.location.href = `tel:${phone}`;
    };

    const getMatchedMedicine = (pharmacy, query) => {
        if (!query) return null;
        return pharmacy.inventory.find(item =>
            item.medicationName.toLowerCase().includes(query.toLowerCase())
        );
    };

    const getBestPrice = (medicineName) => {
        const prices = pharmacies
            .map(p => p.inventory.find(i => i.medicationName.toLowerCase().includes(medicineName.toLowerCase())))
            .filter(Boolean)
            .map(i => i.price);
        return Math.min(...prices);
    };

    if (locationLoading) {
        return (
            <div className="pharmacy-finder">
                <div className="location-loading">
                    <div className="spinner">📍</div>
                    <h3>Finding your location...</h3>
                    <p>Please allow location access to find nearby pharmacies</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pharmacy-finder">
            {/* Header */}
            <header className="finder-header">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                <h1>📍 Find Nearby Pharmacies</h1>
                <p>Locate medicines at pharmacies near you</p>
            </header>

            {/* Search & Filters */}
            <div className="search-filters">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search for a medicine..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="clear-btn" onClick={() => setSearchQuery('')}>✕</button>
                    )}
                </div>

                <div className="radius-filter">
                    <span>Distance:</span>
                    {[1, 2, 5].map(r => (
                        <button
                            key={r}
                            className={`radius-btn ${selectedRadius === r ? 'active' : ''}`}
                            onClick={() => handleRadiusChange(r)}
                        >
                            {r} km
                        </button>
                    ))}
                </div>
            </div>

            {/* Map */}
            <div className="map-container">
                <MapContainer
                    center={[userLocation.lat, userLocation.lng]}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <RecenterMap center={[userLocation.lat, userLocation.lng]} />

                    {/* Radius circle */}
                    <Circle
                        center={[userLocation.lat, userLocation.lng]}
                        radius={selectedRadius * 1000}
                        pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }}
                    />

                    {/* User marker */}
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                        <Popup>
                            <div className="user-popup">
                                <strong>📍 Your Location</strong>
                            </div>
                        </Popup>
                    </Marker>

                    {/* Pharmacy markers */}
                    {pharmacies.map(pharmacy => {
                        const matchedMed = getMatchedMedicine(pharmacy, searchQuery);
                        return (
                            <Marker
                                key={pharmacy._id}
                                position={[pharmacy.location.lat, pharmacy.location.lng]}
                                icon={pharmacyIcon}
                            >
                                <Popup>
                                    <div className="pharmacy-popup">
                                        <h4>{pharmacy.name}</h4>
                                        <p className="distance-tag">📍 {pharmacy.distance} km away</p>

                                        {matchedMed && (
                                            <div className={`price-box ${matchedMed.inStock ? 'in-stock' : 'out-stock'}`}>
                                                <span className="med-name">{matchedMed.medicationName}</span>
                                                {matchedMed.inStock ? (
                                                    <span className="price">
                                                        ₹{matchedMed.price}
                                                        {matchedMed.price === getBestPrice(searchQuery) && (
                                                            <span className="best-price">Best Price!</span>
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="out-of-stock">Out of Stock</span>
                                                )}
                                            </div>
                                        )}

                                        {pharmacy.deliveryAvailable && (
                                            <p className="delivery-info">
                                                🚚 {pharmacy.deliveryFee === 0 ? 'FREE Delivery' : `₹${pharmacy.deliveryFee} delivery`}
                                            </p>
                                        )}

                                        <div className="popup-buttons">
                                            <button onClick={() => handleCall(pharmacy.phone)}>📞 Call</button>
                                            <button onClick={() => handleNavigate(pharmacy)}>🧭 Navigate</button>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>

            {/* Pharmacy List */}
            <div className="pharmacy-results">
                <h3>🏪 {pharmacies.length} Pharmacies within {selectedRadius} km</h3>

                {pharmacies.length === 0 ? (
                    <div className="no-results">
                        <p>No pharmacies found within {selectedRadius} km. Try increasing the radius.</p>
                    </div>
                ) : (
                    <div className="pharmacy-list">
                        {pharmacies.map(pharmacy => {
                            const matchedMed = getMatchedMedicine(pharmacy, searchQuery);
                            return (
                                <div key={pharmacy._id} className="pharmacy-item">
                                    <div className="item-header">
                                        <div>
                                            <h4>{pharmacy.name}</h4>
                                            <p className="address">{pharmacy.address}</p>
                                        </div>
                                        <span className="distance-badge">{pharmacy.distance} km</span>
                                    </div>

                                    {matchedMed && (
                                        <div className={`price-highlight ${matchedMed.inStock ? '' : 'unavailable'}`}>
                                            <span>{matchedMed.medicationName}</span>
                                            {matchedMed.inStock ? (
                                                <span className="price">₹{matchedMed.price}</span>
                                            ) : (
                                                <span className="unavailable-text">Unavailable</span>
                                            )}
                                        </div>
                                    )}

                                    <div className="item-footer">
                                        <div className="tags">
                                            {pharmacy.isConnected && <span className="tag connected">🔗 Connected</span>}
                                            {pharmacy.deliveryFee === 0 && <span className="tag free-delivery">🚚 Free Delivery</span>}
                                        </div>
                                        <div className="item-actions">
                                            <button onClick={() => handleCall(pharmacy.phone)}>📞</button>
                                            <button onClick={() => handleNavigate(pharmacy)}>🧭</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PharmacyFinder;
