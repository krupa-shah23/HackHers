import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './PharmacyMap.css';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom pharmacy icon
const pharmacyIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// User location icon
const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to recenter map
const RecenterMap = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 13);
    }, [center, map]);
    return null;
};

const PharmacyMap = ({ pharmacies, userLocation, selectedMedication, onClose }) => {
    const handleNavigate = (pharmacy) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.location.lat},${pharmacy.location.lng}`;
        window.open(url, '_blank');
    };

    const handleCall = (phone) => {
        window.location.href = `tel:${phone}`;
    };

    // Mock pharmacies if none provided
    const displayPharmacies = pharmacies.length > 0 ? pharmacies : [
        {
            _id: '1',
            name: 'Apollo Pharmacy',
            phone: '1800-123-4567',
            address: '123 MG Road, Bangalore',
            location: { lat: 12.9716, lng: 77.5946 },
            isConnected: true,
            deliveryAvailable: true,
            deliveryFee: 30,
            matchedMedication: selectedMedication ? { price: 120, inStock: true } : null
        },
        {
            _id: '2',
            name: 'MedPlus',
            phone: '1800-234-5678',
            address: '45 Brigade Road, Bangalore',
            location: { lat: 12.9750, lng: 77.6066 },
            isConnected: false,
            deliveryAvailable: true,
            deliveryFee: 25,
            matchedMedication: selectedMedication ? { price: 135, inStock: true } : null
        },
        {
            _id: '3',
            name: 'Netmeds Store',
            phone: '1800-345-6789',
            address: '78 Indiranagar, Bangalore',
            location: { lat: 12.9784, lng: 77.6408 },
            isConnected: true,
            deliveryAvailable: true,
            deliveryFee: 0,
            matchedMedication: selectedMedication ? { price: 110, inStock: true } : null
        },
        {
            _id: '4',
            name: '1mg Pharmacy',
            phone: '1800-456-7890',
            address: '22 Koramangala, Bangalore',
            location: { lat: 12.9352, lng: 77.6245 },
            isConnected: true,
            deliveryAvailable: true,
            deliveryFee: 20,
            matchedMedication: selectedMedication ? { price: 98, inStock: false } : null
        }
    ];

    return (
        <div className="pharmacy-map-container">
            <div className="map-header">
                <div className="map-title">
                    <h2>🗺️ Nearby Pharmacies</h2>
                    {selectedMedication && (
                        <span className="searching-for">
                            Searching for: <strong>{selectedMedication.name}</strong>
                        </span>
                    )}
                </div>
                <button className="close-map-btn" onClick={onClose}>✕</button>
            </div>

            <div className="map-wrapper">
                <MapContainer
                    center={[userLocation.lat, userLocation.lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <RecenterMap center={[userLocation.lat, userLocation.lng]} />

                    {/* User location marker */}
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                        <Popup>
                            <div className="user-popup">
                                <strong>📍 You are here</strong>
                            </div>
                        </Popup>
                    </Marker>

                    {/* Pharmacy markers */}
                    {displayPharmacies.map(pharmacy => (
                        <Marker
                            key={pharmacy._id}
                            position={[pharmacy.location.lat, pharmacy.location.lng]}
                            icon={pharmacyIcon}
                        >
                            <Popup>
                                <div className="pharmacy-popup">
                                    <h4>{pharmacy.name}</h4>
                                    <p className="address">{pharmacy.address}</p>

                                    {pharmacy.matchedMedication && (
                                        <div className={`price-tag ${pharmacy.matchedMedication.inStock ? 'in-stock' : 'out-of-stock'}`}>
                                            {pharmacy.matchedMedication.inStock ? (
                                                <>
                                                    <span className="price">₹{pharmacy.matchedMedication.price}</span>
                                                    <span className="stock-status">✓ In Stock</span>
                                                </>
                                            ) : (
                                                <span className="stock-status">✗ Out of Stock</span>
                                            )}
                                        </div>
                                    )}

                                    {pharmacy.isConnected && (
                                        <div className="connected-badge">🔗 Connected Pharmacy</div>
                                    )}

                                    {pharmacy.deliveryAvailable && (
                                        <div className="delivery-info">
                                            🚚 Delivery: {pharmacy.deliveryFee === 0 ? 'FREE' : `₹${pharmacy.deliveryFee}`}
                                        </div>
                                    )}

                                    <div className="popup-actions">
                                        <button
                                            className="popup-btn call"
                                            onClick={() => handleCall(pharmacy.phone)}
                                        >
                                            📞 Call
                                        </button>
                                        <button
                                            className="popup-btn navigate"
                                            onClick={() => handleNavigate(pharmacy)}
                                        >
                                            🧭 Navigate
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Pharmacy List */}
            <div className="pharmacy-list">
                <h3>📋 {displayPharmacies.length} Pharmacies Found</h3>
                <div className="list-scroll">
                    {displayPharmacies.map(pharmacy => (
                        <div key={pharmacy._id} className="pharmacy-list-item">
                            <div className="list-item-main">
                                <strong>{pharmacy.name}</strong>
                                <span className="distance">{pharmacy.distance ? `${pharmacy.distance.toFixed(1)} km` : ''}</span>
                            </div>
                            <p className="list-address">{pharmacy.address}</p>
                            {pharmacy.matchedMedication && (
                                <div className="list-price">
                                    {pharmacy.matchedMedication.inStock ? (
                                        <span className="price-text">₹{pharmacy.matchedMedication.price}</span>
                                    ) : (
                                        <span className="out-text">Out of Stock</span>
                                    )}
                                </div>
                            )}
                            <div className="list-actions">
                                <button onClick={() => handleCall(pharmacy.phone)}>📞</button>
                                <button onClick={() => handleNavigate(pharmacy)}>🧭</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PharmacyMap;
