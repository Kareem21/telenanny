// frontend/src/components/HomePage.jsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function HomePage({ onUserTypeSelect }) {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    // Dummy featured profiles
    const featuredProfiles = [
        {
            id: 1,
            name: "Maria S.",
            nationality: "Filipino",
            experience: "5 years",
            languages: ["English", "Filipino", "Arabic"],
            rating: 4.9,
            photo: "/api/placeholder/100/100",
            location: "Dubai Marina",
            specialties: ["Newborn Care", "Cooking", "First Aid Certified"]
        },
        {
            id: 2,
            name: "Anna K.",
            nationality: "Russian",
            experience: "7 years",
            languages: ["English", "Russian"],
            rating: 4.8,
            photo: "/api/placeholder/100/100",
            location: "Palm Jumeirah",
            specialties: ["Child Development", "Swimming", "Educational Activities"]
        },
        {
            id: 3,
            name: "Sarah M.",
            nationality: "Ethiopian",
            experience: "4 years",
            languages: ["English", "Arabic"],
            rating: 4.7,
            photo: "/api/placeholder/100/100",
            location: "Downtown Dubai",
            specialties: ["Special Needs Care", "Homework Help", "Arts & Crafts"]
        }
    ];

    // Dummy testimonials
    const testimonials = [
        {
            text: "Found an amazing nanny through TeleNanny. The platform made it so easy to find the perfect match for our family!",
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
            {/* Hero Section */}
            <div className="hero-section">
                <h1>Welcome to TeleNanny</h1>
                <p>Please select your account type to continue</p>
                <div className="user-type-buttons">
                    <button
                        onClick={() => onUserTypeSelect('NANNY')}
                        className="btn-primary"
                    >
                        I'm a Nanny
                    </button>
                    <button
                        onClick={() => onUserTypeSelect('EMPLOYER')}
                        className="btn-secondary"
                    >
                        Looking for a Nanny
                    </button>
                </div>
            </div>

            {/* Featured Profiles Section */}
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

            {/* Testimonials Section */}
            <section className="testimonials">
                <h2>What Our Users Say</h2>
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