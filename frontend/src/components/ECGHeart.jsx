import './ECGHeart.css';

const ECGHeart = () => {
    // ECG waveform pattern - realistic heartbeat pattern
    const ecgPath = `
    M 0,50 
    L 40,50 
    L 50,50 
    L 55,35 
    L 60,50 
    L 70,50 
    L 75,20 
    L 80,80 
    L 85,40 
    L 90,50 
    L 100,50 
    L 140,50 
    L 150,50 
    L 155,35 
    L 160,50 
    L 170,50 
    L 175,20 
    L 180,80 
    L 185,40 
    L 190,50 
    L 200,50
  `;

    return (
        <div className="ecg-heart-container">
            {/* Floating particles */}
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>

            {/* Background glow */}
            <div className="heart-glow"></div>

            {/* Heart SVG with floating animation */}
            <div className="heart-wrapper">
                <svg className="heart-svg heart-beat" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF4757" />
                            <stop offset="50%" stopColor="#FF6B81" />
                            <stop offset="100%" stopColor="#C0392B" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Anatomical heart shape */}
                    <path
                        className="heart-path"
                        d="M50 88 
               C25 70, 10 55, 10 35 
               C10 20, 20 10, 35 10 
               C42 10, 48 15, 50 20 
               C52 15, 58 10, 65 10 
               C80 10, 90 20, 90 35 
               C90 55, 75 70, 50 88Z"
                        filter="url(#glow)"
                    />

                    {/* Inner heart detail lines */}
                    <path
                        d="M50 75 C35 60, 25 50, 25 38 C25 28, 32 22, 42 22"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="1"
                    />
                    <path
                        d="M50 75 C65 60, 75 50, 75 38 C75 28, 68 22, 58 22"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="1"
                    />
                </svg>
            </div>

            {/* ECG Lifeline */}
            <div className="ecg-line-container">
                <svg className="ecg-svg" viewBox="0 0 200 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="20%" stopColor="#4169E1" />
                            <stop offset="80%" stopColor="#4169E1" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                    <path className="ecg-line" d={ecgPath} />
                </svg>
            </div>
        </div>
    );
};

export default ECGHeart;
