// Footer.jsx
import { Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <Link to="/" className="footer-logo">Dubai Nannies</Link>
                    <p className="footer-tagline">Connecting families with trusted nannies in Dubai</p>
                </div>

                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <div className="contact-item">
                        <a href="https://wa.me/971585639166"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whatsapp-link"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                            </svg>
                            +971 58 513 8376
                        </a>
                    </div>
                    <div className="contact-item">
                        <MapPin size={16}/>
                        <span>Dubai, UAE</span>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Dubai Nannies. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer