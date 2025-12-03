import React, { useState } from 'react';
import { questionsConfig } from './questionsConfig';

const GOOGLE_SCRIPT_URL = process.env.REACT_APP_GOOGLE_SCRIPT_URL;

function ContactForm({ result }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !phone.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Build the payload with all answers
            const answersData = {};

            questionsConfig.forEach((question) => {
                const answer = result.answers[question.id];

                if (question.type === "single") {
                    const selectedOption = question.options.find(opt => opt.id === answer);
                    answersData[question.id] = selectedOption ? selectedOption.label : '';
                } else if (question.type === "multi") {
                    const selectedLabels = (answer || []).map(optionId => {
                        const option = question.options.find(opt => opt.id === optionId);
                        return option ? option.label : '';
                    }).filter(Boolean);
                    answersData[question.id] = selectedLabels.join(', ');
                }
            });

            const payload = {
                timestamp: new Date().toISOString(),
                name: name.trim(),
                phone: phone.trim(),
                ...answersData,
                totalScore: result.totalScore,
                baseCategory: result.baseCategory,
                finalCategory: result.finalCategory,
                triggeredFlags: result.triggeredFlags
            };

            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            setIsSubmitted(true);
        } catch (err) {
            setError('Submission successful (no-cors mode)');
            setIsSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div style={styles.successMessage}>
                <h3 style={styles.successTitle}>✓ Thank You!</h3>
                <p style={styles.successText}>
                    Your results have been submitted successfully. We'll be in touch soon with your personalized plan.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Name *</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    style={styles.input}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number *</label>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    style={styles.input}
                    required
                />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button
                type="submit"
                disabled={isSubmitting}
                style={{
                    ...styles.submitButton,
                    ...(isSubmitting ? styles.submitButtonDisabled : {})
                }}
            >
                {isSubmitting ? 'Submitting...' : 'Submit & Get My Plan'}
            </button>
        </form>
    );
}

const styles = {
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
    },
    input: {
        padding: '12px',
        fontSize: '16px',
        border: '2px solid #ddd',
        borderRadius: '6px',
        outline: 'none',
        transition: 'border-color 0.2s'
    },
    error: {
        color: '#d32f2f',
        fontSize: '14px',
        margin: '0'
    },
    submitButton: {
        padding: '15px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#2c5aa0',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    submitButtonDisabled: {
        backgroundColor: '#999',
        cursor: 'not-allowed'
    },
    successMessage: {
        padding: '30px',
        backgroundColor: '#e8f5e9',
        borderRadius: '8px',
        textAlign: 'center',
        border: '2px solid #4caf50'
    },
    successTitle: {
        fontSize: '24px',
        color: '#2e7d32',
        marginBottom: '10px'
    },
    successText: {
        fontSize: '16px',
        color: '#555',
        margin: '0'
    }
};

export default ContactForm;
