import ECGHeart from './ECGHeart';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero" id="home">
            {/* Background orbs */}
            <div className="hero-bg-orb hero-bg-orb-1"></div>
            <div className="hero-bg-orb hero-bg-orb-2"></div>

            <div className="hero-container">
                {/* Left - Content */}
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="hero-badge-dot"></span>
                        Now with AI-powered diagnostics
                    </div>

                    <h1 className="hero-headline">
                        Healthcare, but<br />
                        make it <span className="highlight">smart.</span>
                    </h1>

                    <p className="hero-subtext">
                        Manage patients, appointments, and care — all in one clean dashboard.
                        Built for modern hospitals that move fast.
                    </p>

                    <div className="hero-cta">
                        <button className="btn btn-primary">
                            Get Started
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="hero-stat-value">50<span>K+</span></div>
                            <div className="hero-stat-label">Patients Managed</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-value">99<span>%</span></div>
                            <div className="hero-stat-label">Uptime Guaranteed</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-value">4.9<span>★</span></div>
                            <div className="hero-stat-label">User Rating</div>
                        </div>
                    </div>
                </div>

                {/* Right - Visual */}
                <div className="hero-visual">
                    <div className="hero-glass-card"></div>
                    <ECGHeart />
                </div>
            </div>
        </section>
    );
};

export default Hero;
