import React, { useState, useEffect, useRef } from 'react';
import { getCategoryExplanation } from './scoring';
import { questionsConfig } from './questionsConfig';

const GOOGLE_SCRIPT_URL = process.env.REACT_APP_GOOGLE_SCRIPT_URL;

function ResultPage({ result }) {
    const { totalScore, finalCategory, answers, name, phone, isOverride, triggeredFlags } = result;
    const explanation = getCategoryExplanation(finalCategory);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const hasSubmitted = useRef(false);

    useEffect(() => {
        // Auto-submit to Google Sheets when results page loads
        // Only submit once using ref to prevent duplicate submissions
        if (!hasSubmitted.current) {
            hasSubmitted.current = true;
            submitToGoogleSheets();
        }
    }, []);

    const submitToGoogleSheets = async () => {
        setIsSubmitting(true);

        try {
            const answersData = {};

            questionsConfig.forEach((question) => {
                const answer = answers[question.id];

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
                name: name,
                phone: phone,
                ...answersData,
                totalScore: totalScore,
                baseCategory: result.baseCategory,
                finalCategory: finalCategory,
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
            setIsSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getCategoryColor = () => {
        if (finalCategory.includes('BASE')) return { bg: '#e8f5e9', border: '#4caf50', text: '#2e7d32', icon: '🟢' };
        if (finalCategory.includes('TRANSFORM')) return { bg: '#fff3e0', border: '#ff9800', text: '#e65100', icon: '🔶' };
        return { bg: '#ffebee', border: '#f44336', text: '#c62828', icon: '🔴' };
    };

    const colors = getCategoryColor();

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <div style={{ ...styles.heroCard, backgroundColor: colors.bg, borderColor: colors.border }}>
                <div style={styles.heroContent}>
                    <div style={styles.iconBadge}>{colors.icon}</div>
                    <div style={styles.heroText}>
                        <h1 style={{ ...styles.heroTitle, color: colors.text }}>
                            {explanation.title.split(' ').map((word, index) => {
                                if (word.includes('BASE™️') || word.includes('TRANSFORM™️') || word.includes('EXIT™️')) {
                                    return <span key={index} style={styles.planNameHighlight}>{word} </span>;
                                }
                                return word + ' ';
                            })}
                        </h1>
                        <div style={styles.scoreInline}>
                            <span style={{ ...styles.scoreValue, color: colors.text }}>{totalScore}</span>
                            <span style={{ ...styles.scoreLabel, color: colors.text }}>points</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analysis Section */}
            <div style={styles.resultCard}>
                <h2 style={styles.sectionTitle}>
                    <span style={styles.sectionIcon}>📊</span>
                    {explanation.subtitle}
                </h2>

                <div style={styles.analysisGrid}>
                    <div style={styles.analysisBox}>
                        <h3 style={styles.analysisTitle}>
                            <span style={styles.emoji}>🔍</span> What This Means
                        </h3>
                        <ul style={styles.list}>
                            {explanation.meaning.map((item, index) => (
                                <li key={index} style={styles.listItem}>
                                    <span style={styles.checkmark}>✓</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div style={styles.analysisBox}>
                        <h3 style={styles.analysisTitle}>
                            <span style={styles.emoji}>💪</span> What You Need
                        </h3>
                        <ul style={styles.list}>
                            {explanation.youNeed.map((item, index) => (
                                <li key={index} style={styles.listItem}>
                                    <span style={styles.checkmark}>→</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {explanation.note && (
                    <div style={styles.noteBox}>
                        <span style={styles.noteIcon}>💡</span>
                        <p style={styles.noteText}>{explanation.note}</p>
                    </div>
                )}
            </div>

            {/* Recommended Plan Section */}
            <div style={styles.planCard}>
                <div style={styles.planHeader}>
                    <h2 style={styles.planTitle}>
                        <span style={styles.planIcon}></span>
                        Your Recommended Action Plan
                    </h2>
                    <p style={styles.planSubtitle}>
                        Personalized for your <span style={styles.categoryBadge}>{finalCategory}</span> category
                    </p>
                </div>

                <div style={styles.planContent}>
                    {finalCategory.includes('BASE') && (
                        <>
                            <div style={styles.planStep}>
                                <div style={styles.stepNumber}>1</div>
                                <div style={styles.stepContent}>
                                    <h4 style={styles.stepTitle}>
                                        <span style={styles.planHighlight}>Foundation Building</span>
                                    </h4>
                                    <p style={styles.stepText}>Start with gut preparation and establish a solid protein intake routine (1g/kg body weight daily)</p>
                                </div>
                            </div>
                            <div style={styles.planStep}>
                                <div style={styles.stepNumber}>2</div>
                                <div style={styles.stepContent}>
                                    <h4 style={styles.stepTitle}>
                                        <span style={styles.planHighlight}>Strength Training Setup</span>
                                    </h4>
                                    <p style={styles.stepText}>Begin basic strength training 2-3x per week to preserve muscle mass during weight loss</p>
                                </div>
                            </div>
                            <div style={styles.planStep}>
                                <div style={styles.stepNumber}>3</div>
                                <div style={styles.stepContent}>
                                    <h4 style={styles.stepTitle}>
                                        <span style={styles.planHighlight}>Weekly Monitoring</span>
                                    </h4>
                                    <p style={styles.stepText}>Track your progress weekly to catch any issues early and adjust your approach</p>
                                </div>
                            </div>
                        </>
                    )}

                    {finalCategory.includes('TRANSFORM') && (
                        <>
                            <div style={styles.planStep}>
                                <div style={styles.stepNumber}>1</div>
                                <div style={styles.stepContent}>
                                    <h4 style={styles.stepTitle}>
                                        <span style={styles.planHighlight}>Lean Mass Restoration</span>
                                    </h4>
                                    <p style={styles.stepText}>Implement structured EMS/strength training program to rebuild lost muscle tissue</p>
                                </div>
                            </div>
                            <div style={styles.planStep}>
                                <div style={styles.stepNumber}>2</div>
                                <div style={styles.stepContent}>
                                    <h4 style={styles.stepTitle}>
                                        <span style={styles.planHighlight}>Gut & Metabolic Correction</span>
                                    </h4>
                                    <p style={styles.stepText}>Address digestive issues and optimize micronutrient intake for better energy and metabolism</p>
                                </div>
                            </div>
                            <div style={styles.planStep}>
                                <div style={styles.stepNumber}>3</div>
                                <div style={styles.stepContent}>
                                    <h4 style={styles.stepTitle}>
                                        <span style={styles.planHighlight}>Body Sculpting & Tightening</span>
                                    </h4>
                                    <p style={styles.stepText}>Focus on targeted exercises and treatments to improve body composition and skin elasticity</p>
                                </div>
                            </div>
                            <div style={styles.planStep}>
                                <div style={styles.stepNumber}>4</div>
                                <div style={styles.stepContent}>
                                    <h4 style={styles.stepTitle}>
                                        <span style={styles.planHighlight}>Plateau Breaking Strategy</span>
                                    </h4>
                                    <p style={styles.stepText}>Adjust your approach to overcome weight loss plateaus and continue progress</p>
                                </div>
                            </div>
                        </>
                    )}

                    {finalCategory.includes('EXIT') && (
                        <>
                            <div style={styles.planStep}>
                                <div style={styles.stepNumber}>1</div>
                                <div style={styles.stepContent}>
                                    <h4 style={styles.stepTitle}>
                                        <span style={styles.planHighlight}>Safe GLP-1 Tapering Protocol</span>
                                    </h4>
                                    <p style={styles.stepText}>Gradually reduce medication under supervision to minimize rebound weight gain risk</p>
                                </div>
                            </div>
                            <div style={styles.planStep}>
                                <div style={styles.stepNumber}>2</div>
                                <div style={styles.stepContent}>
                                    <h4 style={styles.stepTitle}>
                                        <span style={styles.planHighlight}>Reverse Diet & Appetite Training</span>
                                    </h4>
                                    <p style={styles.stepText}>Slowly increase caloric intake while retraining natural hunger signals</p>
                                </div>
                            </div>
                            <div style={styles.planStep}>
                                <div style={styles.stepNumber}>3</div>
                                <div style={styles.stepContent}>
                                    <h4 style={styles.stepTitle}>
                                        <span style={styles.planHighlight}>Metabolic Stabilization</span>
                                    </h4>
                                    <p style={styles.stepText}>Restore metabolic rate through strategic nutrition and exercise programming</p>
                                </div>
                            </div>
                            <div style={styles.planStep}>
                                <div style={styles.stepNumber}>4</div>
                                <div style={styles.stepContent}>
                                    <h4 style={styles.stepTitle}>
                                        <span style={styles.planHighlight}>Strength Rebuilding & Gut Reset</span>
                                    </h4>
                                    <p style={styles.stepText}>Intensive strength training combined with gut health restoration for long-term success</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div style={styles.planCTA}>
                    <div style={styles.ctaContent}>
                        <h3 style={styles.ctaTitle}>Ready to Start Your Journey?</h3>
                        <p style={styles.ctaText}>
                            Our team will contact you at <strong>{phone}</strong> to discuss your personalized plan and next steps.
                        </p>
                    </div>
                </div>
            </div>

            {/* Confirmation Section */}
            <div style={styles.confirmationCard}>
                <div style={styles.confirmationIcon}>✓</div>
                <h3 style={styles.confirmationTitle}>Results Submitted Successfully</h3>
                <p style={styles.confirmationText}>
                    Thank you, <strong>{name}</strong>! Your assessment has been saved and our specialists will review your results shortly.
                </p>
                {isSubmitting && (
                    <p style={styles.submittingText}>Submitting your results...</p>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f5f7fa',
        minHeight: '100vh'
    },
    heroCard: {
        padding: '25px 30px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        border: '3px solid',
        animation: 'fadeIn 0.5s ease-in'
    },
    heroContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '25px'
    },
    iconBadge: {
        fontSize: '70px',
        flexShrink: 0
    },
    heroText: {
        textAlign: 'left'
    },
    heroTitle: {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '8px',
        lineHeight: '1.2'
    },
    scoreInline: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '8px'
    },
    scoreValue: {
        fontSize: '42px',
        fontWeight: 'bold',
        lineHeight: '1'
    },
    scoreLabel: {
        fontSize: '16px',
        opacity: '0.8',
        fontWeight: '500'
    },
    resultCard: {
        backgroundColor: '#fff',
        padding: '35px',
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        marginBottom: '30px'
    },
    sectionTitle: {
        fontSize: '26px',
        color: '#333',
        marginBottom: '25px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    sectionIcon: {
        fontSize: '28px'
    },
    analysisGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '25px',
        marginBottom: '25px'
    },
    analysisBox: {
        padding: '25px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '2px solid #e9ecef'
    },
    analysisTitle: {
        fontSize: '20px',
        color: '#2c5aa0',
        marginBottom: '15px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    emoji: {
        fontSize: '24px'
    },
    list: {
        listStyleType: 'none',
        paddingLeft: '0',
        margin: '0'
    },
    listItem: {
        fontSize: '15px',
        color: '#555',
        marginBottom: '12px',
        lineHeight: '1.6',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px'
    },
    checkmark: {
        color: '#4caf50',
        fontWeight: 'bold',
        fontSize: '16px',
        flexShrink: 0
    },
    noteBox: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '15px',
        padding: '20px',
        backgroundColor: '#fff9e6',
        borderRadius: '12px',
        borderLeft: '5px solid #ffc107'
    },
    noteIcon: {
        fontSize: '28px',
        flexShrink: 0
    },
    noteText: {
        fontSize: '16px',
        color: '#666',
        margin: '0',
        lineHeight: '1.6'
    },
    planCard: {
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 6px 25px rgba(44, 90, 160, 0.15)',
        marginBottom: '30px',
        overflow: 'hidden',
        border: '3px solid #2c5aa0'
    },
    planHeader: {
        background: 'linear-gradient(135deg, #2c5aa0 0%, #1e3a6f 100%)',
        padding: '35px 30px',
        textAlign: 'center',
        color: '#fff'
    },
    planTitle: {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
    },
    planIcon: {
        fontSize: '36px'
    },
    planSubtitle: {
        fontSize: '18px',
        opacity: '0.9',
        margin: '0'
    },
    planContent: {
        padding: '35px 30px'
    },
    planStep: {
        display: 'flex',
        gap: '20px',
        marginBottom: '25px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '2px solid #e9ecef',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default'
    },
    stepNumber: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#2c5aa0',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        flexShrink: 0,
        boxShadow: '0 3px 10px rgba(44, 90, 160, 0.3)'
    },
    stepContent: {
        flex: 1
    },
    stepTitle: {
        fontSize: '20px',
        color: '#333',
        marginBottom: '8px',
        fontWeight: 'bold'
    },
    planHighlight: {
        background: 'linear-gradient(120deg, #e3f2fd 0%, #bbdefb 100%)',
        padding: '4px 12px',
        borderRadius: '6px',
        color: '#1565c0',
        fontWeight: 'bold',
        display: 'inline-block',
        border: '1px solid #90caf9'
    },
    planNameHighlight: {
        background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
        padding: '6px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        border: '2px solid currentColor',
        display: 'inline-block',
        fontWeight: 'bold',
        letterSpacing: '0.5px'
    },
    categoryBadge: {
        background: 'rgba(255,255,255,0.2)',
        padding: '4px 12px',
        borderRadius: '6px',
        fontWeight: 'bold',
        border: '1px solid rgba(255,255,255,0.3)',
        display: 'inline-block',
        letterSpacing: '0.5px'
    },
    stepText: {
        fontSize: '16px',
        color: '#666',
        lineHeight: '1.6',
        margin: '0'
    },
    planCTA: {
        padding: '30px',
        backgroundColor: '#e8f5e9',
        borderTop: '3px solid #4caf50'
    },
    ctaContent: {
        textAlign: 'center'
    },
    ctaTitle: {
        fontSize: '24px',
        color: '#2e7d32',
        marginBottom: '12px',
        fontWeight: 'bold'
    },
    ctaText: {
        fontSize: '17px',
        color: '#555',
        margin: '0',
        lineHeight: '1.6'
    },
    confirmationCard: {
        backgroundColor: '#fff',
        padding: '35px',
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        textAlign: 'center',
        border: '2px solid #4caf50'
    },
    confirmationIcon: {
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        backgroundColor: '#4caf50',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '40px',
        margin: '0 auto 20px',
        boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
    },
    confirmationTitle: {
        fontSize: '24px',
        color: '#2e7d32',
        marginBottom: '12px',
        fontWeight: 'bold'
    },
    confirmationText: {
        fontSize: '16px',
        color: '#555',
        margin: '0',
        lineHeight: '1.6'
    },
    submittingText: {
        fontSize: '14px',
        color: '#999',
        marginTop: '10px',
        fontStyle: 'italic'
    }
};

export default ResultPage;
