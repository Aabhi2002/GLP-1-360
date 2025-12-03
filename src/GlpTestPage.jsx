import React, { useState } from 'react';
import { questionsConfig } from './questionsConfig';
import { calculateScore, getFinalCategory } from './scoring';
import ResultPage from './ResultPage';

function GlpTestPage() {
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [contactRequested, setContactRequested] = useState(true); // Default to true
    const [showContactForm, setShowContactForm] = useState(false);
    const [result, setResult] = useState(null);

    // Determine which questions to show based on override logic
    const shouldShowQuestion = (index) => {
        const question = questionsConfig[index];

        // Always show Q1-Q11
        if (index < 11) return true;

        // Q12 always shows
        if (question.id === 'q12') return true;

        // Q13 only shows if Q12 is "None"
        if (question.id === 'q13') {
            const q12Answer = answers['q12'];
            if (!q12Answer || q12Answer.length === 0) return true;
            const q12Question = questionsConfig.find(q => q.id === 'q12');
            const noneOption = q12Question?.options.find(opt => opt.label === "None");
            return q12Answer.length === 1 && q12Answer[0] === noneOption?.id;
        }

        // Q14 only shows if Q12 and Q13 are both "None"
        if (question.id === 'q14') {
            const q12Answer = answers['q12'];
            const q13Answer = answers['q13'];

            const q12Question = questionsConfig.find(q => q.id === 'q12');
            const q13Question = questionsConfig.find(q => q.id === 'q13');
            const q12None = q12Question?.options.find(opt => opt.label === "None");
            const q13None = q13Question?.options.find(opt => opt.label === "None");

            const q12IsNone = q12Answer?.length === 1 && q12Answer[0] === q12None?.id;
            const q13IsNone = q13Answer?.length === 1 && q13Answer[0] === q13None?.id;

            return q12IsNone && q13IsNone;
        }

        return true;
    };

    const currentQuestion = questionsConfig[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questionsConfig.length - 1 ||
        (currentQuestionIndex < questionsConfig.length - 1 &&
            !shouldShowQuestion(currentQuestionIndex + 1));

    const handleSingleChoice = (questionId, optionId) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleMultiChoice = (questionId, optionId) => {
        setAnswers(prev => {
            const current = prev[questionId] || [];

            // If "None" is selected, clear all others
            const noneOption = questionsConfig.find(q => q.id === questionId)
                ?.options.find(opt => opt.label === "None");

            if (noneOption && optionId === noneOption.id) {
                return { ...prev, [questionId]: [optionId] };
            }

            // If selecting other options, remove "None"
            let newSelection = current.includes(optionId)
                ? current.filter(id => id !== optionId)
                : [...current.filter(id => noneOption ? id !== noneOption.id : true), optionId];

            return { ...prev, [questionId]: newSelection };
        });
    };

    const isCurrentQuestionAnswered = () => {
        const answer = answers[currentQuestion.id];
        if (currentQuestion.type === "single") {
            return !!answer;
        } else {
            return answer && answer.length > 0;
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            setShowContactForm(true);
        } else {
            // Find next question that should be shown
            let nextIndex = currentQuestionIndex + 1;
            while (nextIndex < questionsConfig.length && !shouldShowQuestion(nextIndex)) {
                nextIndex++;
            }

            if (nextIndex >= questionsConfig.length) {
                setShowContactForm(true);
            } else {
                setCurrentQuestionIndex(nextIndex);
            }
        }
    };

    const handlePrevious = () => {
        if (showContactForm) {
            setShowContactForm(false);
        } else if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !phone.trim()) {
            alert('Please fill in your name and phone number');
            return;
        }

        const totalScore = calculateScore(answers, questionsConfig);
        const categoryResult = getFinalCategory(totalScore, answers, questionsConfig);

        setResult({
            answers,
            totalScore,
            baseCategory: categoryResult.category,
            finalCategory: categoryResult.category,
            isOverride: categoryResult.isOverride,
            triggeredBy: categoryResult.triggeredBy,
            triggeredFlags: categoryResult.flags,
            name: name.trim(),
            phone: phone.trim(),
            contactRequested: contactRequested
        });
    };

    if (result) {
        return <ResultPage result={result} />;
    }

    // Calculate total questions that will be shown
    const totalQuestionsToShow = questionsConfig.filter((_, index) => shouldShowQuestion(index)).length;
    const answeredCount = Object.keys(answers).length;
    const progress = ((answeredCount + 1) / (totalQuestionsToShow + 1)) * 100; // +1 for contact form

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}> GLP-1 360™️ RISK SCORE TEST</h1>
                <p style={styles.subtitle}>Answer each question to receive your personalized category</p>

                <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
                </div>
                <p style={styles.progressText}>
                    Question {currentQuestionIndex + 1} of {questionsConfig.length}
                </p>
            </div>

            {!showContactForm ? (
                <div style={styles.form}>
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>{currentQuestion.section}</h2>

                        <div style={styles.questionBlock}>
                            <p style={styles.questionText}>
                                {currentQuestionIndex + 1}. {currentQuestion.question}
                            </p>

                            <div style={styles.optionsContainer}>
                                {currentQuestion.options.map((option) => {
                                    const isSelected = currentQuestion.type === "single"
                                        ? answers[currentQuestion.id] === option.id
                                        : (answers[currentQuestion.id] || []).includes(option.id);

                                    return (
                                        <label
                                            key={option.id}
                                            style={{
                                                ...styles.optionLabel,
                                                ...(isSelected ? styles.optionLabelSelected : {})
                                            }}
                                        >
                                            <input
                                                type={currentQuestion.type === "single" ? "radio" : "checkbox"}
                                                name={currentQuestion.id}
                                                value={option.id}
                                                checked={isSelected}
                                                onChange={() => {
                                                    if (currentQuestion.type === "single") {
                                                        handleSingleChoice(currentQuestion.id, option.id);
                                                    } else {
                                                        handleMultiChoice(currentQuestion.id, option.id);
                                                    }
                                                }}
                                                style={styles.input}
                                            />
                                            <span>{option.label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div style={styles.buttonContainer}>
                        {currentQuestionIndex > 0 && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                style={styles.previousButton}
                            >
                                ← Previous
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={!isCurrentQuestionAnswered()}
                            style={{
                                ...styles.nextButton,
                                ...(!isCurrentQuestionAnswered() ? styles.buttonDisabled : {})
                            }}
                        >
                            {isLastQuestion ? 'Continue →' : 'Next →'}
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Final Step: Your Contact Information</h2>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Name *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                style={styles.textInput}
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
                                style={styles.textInput}
                                required
                            />
                        </div>

                        <div style={styles.checkboxGroup}>
                            <label style={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={contactRequested}
                                    onChange={(e) => setContactRequested(e.target.checked)}
                                    style={styles.checkbox}
                                />
                                <span style={styles.checkboxText}>
                                    I want your team to contact me to discuss my personalized plan
                                </span>
                            </label>
                        </div>
                    </div>

                    <div style={styles.buttonContainer}>
                        <button
                            type="button"
                            onClick={handlePrevious}
                            style={styles.previousButton}
                        >
                            ← Previous
                        </button>

                        <button
                            type="submit"
                            style={styles.submitButton}
                        >
                            Get My Results
                        </button>
                    </div>
                </form>
            )}
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
    header: {
        textAlign: 'center',
        marginBottom: '30px',
        padding: '35px 30px',
        background: 'linear-gradient(135deg, #2c5aa0 0%, #1e3a6f 100%)',
        borderRadius: '16px',
        boxShadow: '0 6px 25px rgba(44, 90, 160, 0.2)',
        color: '#fff'
    },
    title: {
        fontSize: '36px',
        fontWeight: 'bold',
        marginBottom: '12px',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    subtitle: {
        fontSize: '18px',
        marginBottom: '25px',
        opacity: '0.95'
    },
    progressBar: {
        width: '100%',
        height: '12px',
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: '6px',
        overflow: 'hidden',
        marginBottom: '12px',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)',
        transition: 'width 0.4s ease',
        boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)'
    },
    progressText: {
        fontSize: '15px',
        fontWeight: '500',
        margin: '0',
        opacity: '0.9'
    },
    form: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e9ecef'
    },
    section: {
        marginBottom: '35px'
    },
    sectionTitle: {
        fontSize: '22px',
        color: '#2c5aa0',
        marginBottom: '25px',
        paddingBottom: '12px',
        borderBottom: '3px solid #2c5aa0',
        fontWeight: 'bold'
    },
    questionBlock: {
        marginBottom: '25px'
    },
    questionText: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '20px',
        lineHeight: '1.4'
    },
    optionsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    optionLabel: {
        display: 'flex',
        alignItems: 'center',
        padding: '18px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '2px solid #e9ecef',
        fontSize: '16px',
        color: '#555'
    },
    optionLabelSelected: {
        backgroundColor: '#e3f2fd',
        border: '2px solid #2c5aa0',
        boxShadow: '0 4px 12px rgba(44, 90, 160, 0.15)',
        transform: 'translateX(5px)',
        color: '#2c5aa0',
        fontWeight: '500'
    },
    input: {
        marginRight: '15px',
        cursor: 'pointer',
        width: '20px',
        height: '20px',
        accentColor: '#2c5aa0'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '15px',
        marginTop: '35px'
    },
    previousButton: {
        padding: '14px 28px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#2c5aa0',
        backgroundColor: '#fff',
        border: '2px solid #2c5aa0',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    nextButton: {
        flex: 1,
        padding: '14px 28px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#fff',
        background: 'linear-gradient(135deg, #2c5aa0 0%, #1e3a6f 100%)',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(44, 90, 160, 0.3)'
    },
    buttonDisabled: {
        background: '#ccc',
        cursor: 'not-allowed',
        boxShadow: 'none'
    },
    submitButton: {
        flex: 1,
        padding: '16px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#fff',
        background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
    },
    formGroup: {
        marginBottom: '25px'
    },
    label: {
        display: 'block',
        fontSize: '17px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px'
    },
    textInput: {
        width: '100%',
        padding: '15px',
        fontSize: '16px',
        border: '2px solid #e9ecef',
        borderRadius: '10px',
        outline: 'none',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
        backgroundColor: '#f8f9fa'
    },
    checkboxGroup: {
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#e8f5e9',
        borderRadius: '10px',
        border: '2px solid #4caf50'
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        cursor: 'pointer'
    },
    checkbox: {
        width: '20px',
        height: '20px',
        cursor: 'pointer',
        accentColor: '#2c5aa0',
        marginTop: '2px',
        flexShrink: 0
    },
    checkboxText: {
        fontSize: '16px',
        color: '#2e7d32',
        lineHeight: '1.5',
        fontWeight: '500'
    }
};

export default GlpTestPage;
