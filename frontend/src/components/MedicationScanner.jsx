import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import './MedicationScanner.css';

const MedicationScanner = ({ onScanComplete }) => {
    const fileInputRef = useRef(null);
    const [image, setImage] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
        startScan(file);
    };

    const startScan = async (file) => {
        setScanning(true);
        setProgress(0);

        try {
            const result = await Tesseract.recognize(
                file,
                'eng',
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            setProgress(Math.round(m.progress * 100));
                        }
                    }
                }
            );

            const text = result.data.text;
            console.log('Scanned Text:', text);

            // Basic heuristics to find potential medication name
            // (In a real app, this would use simpler Regex or NLP)
            const extractedName = extractMedName(text);

            onScanComplete(extractedName, text);
        } catch (err) {
            console.error('Scan failed:', err);
            alert('Could not scan image. Please try again.');
        } finally {
            setScanning(false);
        }
    };

    const extractMedName = (fullText) => {
        // Simple heuristic: Look for first capitalized word line that isn't a common label
        const lines = fullText.split('\n').filter(l => l.trim().length > 3);
        const ignoreWords = ['RX', 'PHARMACY', 'TABLET', 'CAPSULE', 'TAKE', 'DAILY', 'MG', 'EXP'];

        for (let line of lines) {
            const upperLine = line.toUpperCase();
            if (!ignoreWords.some(w => upperLine.includes(w)) && /^[A-Z]/.test(line)) {
                return line.trim(); // Return best guess
            }
        }
        return lines[0] || ''; // Fallback
    };

    const clearScan = () => {
        setImage(null);
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="medication-scanner">

            {!image ? (
                <div
                    className="scanner-dropzone"
                    onClick={() => fileInputRef.current.click()}
                >
                    <div className="scanner-icon">📸</div>
                    <p>Scan Bottle Label</p>
                    <span className="scanner-subtext">AI will read the name for you</span>
                </div>
            ) : (
                <div className="scanner-preview">
                    <img src={image} alt="Medication Label" />

                    {scanning && (
                        <div className="scan-overlay">
                            <div className="scan-bar"></div>
                            <div className="scan-status">
                                Scanning... {progress}%
                            </div>
                        </div>
                    )}

                    {!scanning && (
                        <button className="re-scan-btn" onClick={clearScan}>
                            Scan New Photo
                        </button>
                    )}
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default MedicationScanner;
