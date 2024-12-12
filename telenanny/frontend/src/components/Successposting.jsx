// src/components/PostingSuccess.jsx
import { Link } from 'react-router-dom';

function PostingSuccess({ postingId }) {
    return (
        <div className="posting-success-container">
            <div className="success-message">
                <h1>🎉 Posting Successful!</h1>
                <p>Your job posting has been published successfully.</p>
                <div className="action-buttons">
                    <Link to={`/posting/${postingId}`} className="btn-primary">
                        View Your Posting
                    </Link>
                    <Link to="/postings" className="btn-secondary">
                        Browse All Postings
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default PostingSuccess;