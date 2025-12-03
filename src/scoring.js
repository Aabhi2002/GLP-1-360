export function calculateScore(answers, questionsConfig) {
    let totalScore = 0;

    questionsConfig.forEach((question) => {
        const answer = answers[question.id];

        if (!answer) return;

        if (question.type === "single") {
            const selectedOption = question.options.find(opt => opt.id === answer);
            if (selectedOption) {
                totalScore += selectedOption.score;
            }
        } else if (question.type === "multi") {
            answer.forEach((optionId) => {
                const selectedOption = question.options.find(opt => opt.id === optionId);
                if (selectedOption) {
                    totalScore += selectedOption.score;
                }
            });
        }
    });

    return totalScore;
}

export function getBaseCategory(score) {
    if (score >= 0 && score <= 15) {
        return "GLP-1 360: BASE™️";
    } else if (score >= 16 && score <= 30) {
        return "GLP-1 360: TRANSFORM™️";
    } else {
        return "GLP-1 360: EXIT™️";
    }
}

export function applyOverrides(baseCategory, flags, overrideCategories) {
    // No override logic specified in documentation
    return baseCategory;
}

export function getFinalCategory(score, flags, overrideCategories) {
    const baseCategory = getBaseCategory(score);
    return applyOverrides(baseCategory, flags, overrideCategories);
}

export function getCategoryExplanation(category) {
    const explanations = {
        "GLP-1 360: BASE™️": {
            title: "🟢 GLP-1 360: BASE™️",
            subtitle: "You're in the starting or low-risk phase.",
            meaning: [
                "You're early in your GLP-1 journey",
                "Minimal muscle loss so far",
                "Side effects are mild",
                "Strength/metabolism still stable"
            ],
            youNeed: [
                "Gut prep",
                "Protein setup",
                "Basic strength foundation",
                "Weekly monitoring to avoid problems"
            ]
        },
        "GLP-1 360: TRANSFORM™️": {
            title: "🟡 GLP-1 360: TRANSFORM™️",
            subtitle: "You're in the muscle-loss/plateau correction phase.",
            meaning: [
                "Strength is dropping",
                "Muscle loss risk is high",
                "Side effects present",
                "Plateau likely",
                "Appetite too low or inconsistent",
                "Energy fluctuations"
            ],
            youNeed: [
                "Lean mass restoration",
                "Structured EMS/strength",
                "Gut correction",
                "Sculpting & tightening",
                "Micronutrient optimisation",
                "Metabolic repair"
            ],
            note: "This is the most common category."
        },
        "GLP-1 360: EXIT™️": {
            title: "🔴 GLP-1 360: EXIT™️",
            subtitle: "You need tapering, rebound-risk prevention & metabolic reset.",
            meaning: [
                "Severe muscle loss risk",
                "Very low appetite",
                "Significant side effects",
                "Plateau or sudden regain",
                "Planning to stop GLP-1",
                "Losing control of hunger after stopping"
            ],
            youNeed: [
                "Reverse diet",
                "Appetite training",
                "Metabolic stabilisation",
                "Strength rebuilding",
                "Gut reset",
                "Safe GLP-1 taper protocol"
            ]
        }
    };

    return explanations[category] || explanations["GLP-1 360: BASE™️"];
}
