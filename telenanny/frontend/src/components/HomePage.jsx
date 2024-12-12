// HomePage.jsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function HomePage({ onUserTypeSelect }) {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const navigate = useNavigate();

    const featuredProfiles = [
        {
            id: 1,
            name: "Maria S.",
            nationality: "Nigerian",
            experience: "5 years",
            languages: ["English", "Filipino", "Arabic"],
            rating: 4.9,
            photo: "https://excellencecenter.ae/wp-content/uploads/2024/07/Light-Blue-Travel-to-Dubai-Instagram-Post-42.jpg",
            location: "Dubai Marina",
            specialties: ["Newborn Care", "Cooking", "First Aid Certified"]
        },
        {
            id: 2,
            name: "Anna K.",
            nationality: "Ethiopian",
            experience: "7 years",
            languages: ["English", "Russian"],
            rating: 4.8,
            photo: "https://maidfinder.ae/maid/assets/profiles/446052508_1919538038500256_6255546291029296217_n.webp",
            location: "Palm Jumeirah",
            specialties: ["Child Development", "Swimming", "Educational Activities"]
        },
        {
            id: 3,
            name: "Sarah M.",
            nationality: "Filipino",
            experience: "4 years",
            languages: ["English", "Arabic"],
            rating: 4.7,
            photo: "https://find-nanny-and-maid.com/MaidImage/WhatsApp%20Image%202024-05-02%20at%205_IM_2024050707351630.jpeg",
            location: "Downtown Dubai",
            specialties: ["Special Needs Care", "Homework Help", "Arts & Crafts"]
        }
    ];

    const testimonials = [
        {
            text: "Found an amazing nanny through Dubai Nannies. The platform made it so easy to find the perfect match for our family!",
            author: "Sarah Thompson",
            role: "Mother of two",
            location: "Dubai Marina"
        },
        {
            text: "As a nanny, this platform helped me find a wonderful family to work with. The process was smooth and professional.",
            author: "Maria Garcia",
            role: "Professional Nanny",
            location: "Palm Jumeirah"
        },
        {
            text: "Exceptional service! We were able to find a qualified nanny within a week. Highly recommend!",
            author: "Ahmed Hassan",
            role: "Parent",
            location: "Downtown Dubai"
        }
    ];

    const handleNannyClick = () => {
        onUserTypeSelect('NANNY');
        navigate('/register-nanny');
    };

    const handleEmployerClick = () => {
        onUserTypeSelect('EMPLOYER');
        navigate('/find-nanny');
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
    const handleStartNow = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);  // Reset scroll position before navigation
        navigate('/post-job');
    };

    return (
        <div className="homepage">
            {/* Hero Section */}
            {/* Hero Section */}
            <div className="hero-section">
                <h1 className="hero-title">Welcome to Dubai Nannies!</h1>
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
                        Looking for a Nanny
                    </button>
                </div>
            </div>

            <div className="dual-section-container">
                <section className="get-started-section">
                    <h2>Get Started for FREE</h2>
                    <p>It’s easy to share what you need in a job post. Families who post are <strong>5x</strong> more likely to find the nanny they need!</p>
                    <div className="steps-container">
                        <div className="step-card">
                            <span className="step-number">1</span>
                            <h3>You post it</h3>
                        </div>
                        <div className="step-arrow">&#8594;</div>
                        <div className="step-card">
                            <span className="step-number">2</span>
                            <h3>Nannies apply</h3>
                        </div>
                        <div className="step-arrow">&#8594;</div>
                        <div className="step-card">
                            <span className="step-number">3</span>
                            <h3>Start connecting</h3>
                        </div>
                    </div>
                    <button className="btn-primary" onClick={handleStartNow}>START NOW</button>
              </section>

                <section className="featured-profiles">
                    <h2>Featured Nannies</h2>
                    <div className="profiles-grid">
                        {featuredProfiles.map(profile => (
                            <div key={profile.id} className="profile-card">
                                <img src={profile.photo} alt={profile.name} className="profile-photo" />
                                <div className="profile-info">
                                    <h3>{profile.name}</h3>
                                    <p className="nationality">{profile.nationality}</p>
                                    <p className="experience">{profile.experience} experience</p>
                                    <div className="languages">
                                        {profile.languages.map(lang => (
                                            <span key={lang} className="language-tag">
                                               {lang}
                                           </span>
                                        ))}
                                    </div>
                                    <div className="specialties">
                                        {profile.specialties.map(specialty => (
                                            <span key={specialty} className="specialty-tag">
                                               {specialty}
                                           </span>
                                        ))}
                                    </div>
                                    <div className="location">
                                        <span>{profile.location}</span>
                                    </div>
                                    <div className="rating">
                                        ⭐ {profile.rating}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Testimonials Section */}
            <section className="testimonials">
                <h2>Why Parents Use Dubai nannies Instead</h2>
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
        </div>
    );
}

export default HomePage;
