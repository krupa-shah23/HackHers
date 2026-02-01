import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-logo">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <span className="logo-text">CareFlow</span>
      </a>
      
      <ul className="navbar-links">
        <li><a href="#home" className="active">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#about">About</a></li>
      </ul>
      
      <div className="navbar-auth">
        <button className="btn btn-outline">Log in</button>
        <button className="btn btn-filled">Sign up</button>
      </div>
    </nav>
  );
};

export default Navbar;
