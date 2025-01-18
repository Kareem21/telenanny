// src/components/Contact.jsx
import React from 'react';
import './Contact.css';

function Contact() {
    return (
        <main className="contact-container">
            <section className="contact-header">
                <h1>Contact Us</h1>
                <p>We’d love to hear from you! Feel free to reach out to us using the form below or via the provided contact details.</p>
            </section>

            <section className="contact-details">
                <div className="details">
                    <h2>Get in Touch</h2>
                    <p><strong>Phone:</strong> +971 58 563 9166</p>
                    <p><strong>Address:</strong> Dubai, UAE</p>
                </div>
                <div className="contact-form">
                    <h2>Send Us a Message</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" placeholder="Your Name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="Your Email" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" name="message" placeholder="Your Message" rows="5" required></textarea>
                        </div>
                        <button type="submit" className="submit-btn">Send Message</button>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default Contact;
