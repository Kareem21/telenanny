import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import NannyList from './NannyList';

function HomePage({ onUserTypeSelect, jobs, nannies }) {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [lastScrollY, setLastScrollY] = useState(0);
    const navigate = useNavigate();


    // Track scroll to move floating WhatsApp button
    useEffect(() => {
        const handleScroll = () => {
            setLastScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Floating WhatsApp button
    const WhatsAppButton = () => {
        return (
            <a
                href="https://wa.me/971585639166"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-button"
                aria-label="Chat on WhatsApp"
                style={{
                    position: 'fixed',
                    bottom: '40px',
                    right: '40px',
                    backgroundColor: '#25D366',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '2px 2px 6px rgba(0,0,0,0.4)',
                    zIndex: 1000,
                    transition: 'all 0.3s ease',
                    transform: `translateY(${Math.min(
                        Math.max(lastScrollY * 0.1, 0),
                        100
                    )}px)`,
                }}
            >
                <svg
                    viewBox="0 0 24 24"
                    width="35"
                    height="35"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a9.882 9.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
            </a>
        );
    };

    // Remove the featuredNannies state and useEffect

    // Simple testimonials
    const testimonials = [
        {
            text: 'Found an amazing nanny through Dubai Nannies. The platform made it so easy!',
            author: 'Sarah Thompson',
            role: 'Mother of two',
            location: 'Dubai Marina',
        },
        {
            text: 'As a nanny, I found a wonderful family to work with. Smooth and professional!',
            author: 'Maria Garcia',
            role: 'Professional Nanny',
            location: 'Palm Jumeirah',
        },
        {
            text: 'Exceptional service! We found a qualified nanny within a week. Highly recommend!',
            author: 'Ahmed Hassan',
            role: 'Parent',
            location: 'Downtown Dubai',
        },
    ];

    const handleNannyClick = () => {
        onUserTypeSelect('NANNY');
        navigate('/register-nanny');
    };

    const handleEmployerClick = () => {
        onUserTypeSelect('EMPLOYER');
        navigate('/post-job');
    };

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) =>
            prev === testimonials.length - 1 ? 0 : prev + 1
        );
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) =>
            prev === 0 ? testimonials.length - 1 : prev - 1
        );
    };

    return (
        <div className="homepage">
            <div className="hero-section">
                <div className="flex items-center justify-center gap-2">
                    <h1 className="hero-title">Welcome to Dubai Nannies!</h1>
                </div>

                <p className="hero-subtitle">Please select your account type to continue</p>

                <div className="user-type-buttons">
                    <button
                        onClick={handleNannyClick}
                        className="user-type-btn btn-primary"
                    >
                        I'm a Nanny
                    </button>

                    <button
                        onClick={handleEmployerClick}
                        className="user-type-btn btn-secondary"
                    >
                        I'm looking for a Nanny
                    </button>
                </div>
            </div>

            <section className="featured-profiles px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Featured Nannies</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <NannyList nannies={nannies} />
                </div>
                <div className="mt-6 text-center">
                    <Link to="/allnannies" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded text-xl">
                        <strong>SHOW ALL 50+ ACTIVE NANNIES</strong>
                    </Link>
                </div>
            </section>

            <section className="job-feed-section">
                <h2>Job Postings</h2>
                {jobs.length === 0 ? (
                    <p>No job postings yet. Be the first to post a job!</p>
                ) : (
                    <div className="profiles-grid">
                        {jobs.map((job, index) => (
                            <div key={index} className="profile-card job-card">
                                <div className="profile-info">
                                    <h3>{job.employer_name}</h3>
                                    <p>
                                        <strong>Rate:</strong> {job.rate} AED/month
                                    </p>
                                    <p>
                                        <strong>Location:</strong> {job.location}
                                    </p>
                                    <p>
                                        <strong>Number of Kids:</strong> {job.kids_count}
                                    </p>
                                    {job.notes && (
                                        <p>
                                            <strong>Notes:</strong> {job.notes}
                                        </p>
                                    )}
                                    <p>
                                        <strong>Contact Email:</strong> {job.contact_email}
                                    </p>
                                    <p>
                                        <strong>Contact Phone:</strong> {job.contact_phone}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="testimonials">
                <h2>Why UAE families use Dubai Nannies:</h2>
                <div className="testimonial-slider">
                    <button onClick={prevTestimonial} className="slider-button">
                        <ChevronLeft />
                    </button>
                    <div className="testimonial-content">
                        <p>"{testimonials[currentTestimonial].text}"</p>
                        <div className="testimonial-author">
                            <strong>{testimonials[currentTestimonial].author}</strong>
                            <span>{testimonials[currentTestimonial].role}</span>
                            <span>{testimonials[currentTestimonial].location}</span>
                        </div>
                    </div>
                    <button onClick={nextTestimonial} className="slider-button">
                        <ChevronRight />
                    </button>
                </div>
            </section>

            <WhatsAppButton />
        </div>
    );
}

export default HomePage;
