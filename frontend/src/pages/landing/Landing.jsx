import Navbar from "./Navbar";
import Hero from "./Hero";
import "./Landing.css";

const Landing = () => {
  return (
    <>
      <Navbar />
      <Hero />

      {/* HOME SECTION */}
      <section id="home" className="info-section white">
        <h2>CareFlow</h2>
        <p>
          CareFlow is a modern healthcare platform designed to simplify
          everyday care for individuals, families, and caregivers.
        </p>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="info-section light">
        <h2>Features</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>Shared Care</h3>
            <p>Manage your care and your loved ones’ care together.</p>
          </div>
          <div className="info-card">
            <h3>Smart Reminders</h3>
            <p>Adaptive reminders that fit real human routines.</p>
          </div>
          <div className="info-card">
            <h3>Elder Friendly</h3>
            <p>Simple, large actions designed for seniors.</p>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="info-section white">
        <h2>Services</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>Medication Tracking</h3>
            <p>Track daily medicines and missed doses.</p>
          </div>
          <div className="info-card">
            <h3>Pharmacy Sync</h3>
            <p>Refill reminders and pharmacy coordination.</p>
          </div>
          <div className="info-card">
            <h3>Family Updates</h3>
            <p>Keep caregivers informed without stress.</p>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="info-section light">
        <h2>About CareFlow</h2>
        <p>
          CareFlow is built around real life healthcare — shared, changing,
          and deeply human. It adapts as needs evolve over time.
        </p>
      </section>
    </>
  );
};

export default Landing;
