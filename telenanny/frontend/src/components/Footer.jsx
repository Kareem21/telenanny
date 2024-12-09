// Footer.jsx
import { Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <Link to="/" className="footer-logo">Dubai Nannies</Link>
                    <p className="footer-tagline">Connecting families with trusted childcare professionals in Dubai</p>
                </div>

                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <div className="contact-item">
                        <Mail size={16} />
                        <a href="mailto:contact@dubainannies.com">contact@dubainannies.com</a>
                    </div>
                    <div className="contact-item">
                        <Phone size={16} />
                        <a href="tel:+97150000000">+971 50 000 0000</a>
                    </div>
                    <div className="contact-item">
                        <MapPin size={16} />
                        <span>Dubai, UAE</span>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms of Service</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Dubai Nannies. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer