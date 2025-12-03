export const questionsConfig = [
    // SECTION A — GLP-1 USAGE PROFILE
    {
        id: "q1",
        section: "SECTION A — GLP-1 USAGE PROFILE",
        question: "Which GLP-1 medication are you on or planning to start?",
        type: "single",
        options: [
            { id: "q1_a", label: "Not started yet", score: 1 },
            { id: "q1_b", label: "Rybelsus / Oral Semaglutide", score: 2 },
            { id: "q1_c", label: "Ozempic / Wegovy", score: 3 },
            { id: "q1_d", label: "Mounjaro / Tirzepatide", score: 4 }
        ]
    },
    {
        id: "q2",
        section: "SECTION A — GLP-1 USAGE PROFILE",
        question: "Duration of GLP-1 use",
        type: "single",
        options: [
            { id: "q2_a", label: "Not started yet", score: 0 },
            { id: "q2_b", label: "< 1 month", score: 1 },
            { id: "q2_c", label: "1–3 months", score: 2 },
            { id: "q2_d", label: "3–6 months", score: 3 },
            { id: "q2_e", label: "6 months", score: 4 }
        ]
    },
    {
        id: "q3",
        section: "SECTION A — GLP-1 USAGE PROFILE",
        question: "Weight changes since starting",
        type: "single",
        options: [
            { id: "q3_a", label: "No change yet", score: 1 },
            { id: "q3_b", label: "Lost 1–4 kg", score: 2 },
            { id: "q3_c", label: "Lost 5–10 kg", score: 3 },
            { id: "q3_d", label: "Lost > 10 kg", score: 4 }
        ]
    },
    // SECTION B — MUSCLE LOSS RISK & STRENGTH STATUS
    {
        id: "q4",
        section: "SECTION B — MUSCLE LOSS RISK & STRENGTH STATUS",
        question: "Are you experiencing weakness, fatigue, or reduced stamina?",
        type: "single",
        options: [
            { id: "q4_a", label: "No", score: 0 },
            { id: "q4_b", label: "Mild", score: 2 },
            { id: "q4_c", label: "Moderate", score: 3 },
            { id: "q4_d", label: "Severe", score: 4 }
        ]
    },
    {
        id: "q5",
        section: "SECTION B — MUSCLE LOSS RISK & STRENGTH STATUS",
        question: "Strength training frequency",
        type: "single",
        options: [
            { id: "q5_a", label: "3+ days per week", score: 0 },
            { id: "q5_b", label: "1–2 days", score: 2 },
            { id: "q5_c", label: "Rarely", score: 3 },
            { id: "q5_d", label: "Never", score: 4 }
        ]
    },
    {
        id: "q6",
        section: "SECTION B — MUSCLE LOSS RISK & STRENGTH STATUS",
        question: "Daily protein intake",
        type: "single",
        options: [
            { id: "q6_a", label: "≥ 1 g/kg", score: 0 },
            { id: "q6_b", label: "0.7–1 g/kg", score: 2 },
            { id: "q6_c", label: "< 0.7 g/kg", score: 4 },
            { id: "q6_d", label: "Not sure", score: 3 }
        ]
    },
    {
        id: "q7",
        section: "SECTION B — MUSCLE LOSS RISK & STRENGTH STATUS",
        question: "Body Composition Scan Result (if known)",
        type: "single",
        options: [
            { id: "q7_a", label: "Muscle mass stable / increased", score: 0 },
            { id: "q7_b", label: "Slight drop", score: 2 },
            { id: "q7_c", label: "Significant drop", score: 4 },
            { id: "q7_d", label: "No scan done", score: 3 }
        ]
    },
    // SECTION C — SIDE EFFECT BURDEN
    {
        id: "q8",
        section: "SECTION C — SIDE EFFECT BURDEN",
        question: "Which side effects do you experience? (Select all that apply)",
        type: "multi",
        options: [
            { id: "q8_a", label: "Nausea", score: 1 },
            { id: "q8_b", label: "Constipation", score: 1 },
            { id: "q8_c", label: "Bloating / reflux", score: 1 },
            { id: "q8_d", label: "Hair thinning", score: 1 },
            { id: "q8_e", label: "Low appetite (< 800 kcal/day)", score: 2 },
            { id: "q8_f", label: "Weakness/light-headedness", score: 1 },
            { id: "q8_g", label: "None", score: 0 }
        ]
    },
    {
        id: "q9",
        section: "SECTION C — SIDE EFFECT BURDEN",
        question: "How would you describe your appetite?",
        type: "single",
        options: [
            { id: "q9_a", label: "Normal", score: 0 },
            { id: "q9_b", label: "Mildly reduced", score: 1 },
            { id: "q9_c", label: "Very low", score: 2 },
            { id: "q9_d", label: "Almost absent / skipping meals", score: 3 }
        ]
    },
    // SECTION D — METABOLIC BACKGROUND
    {
        id: "q10",
        section: "SECTION D — METABOLIC BACKGROUND",
        question: "Do you have any of these conditions? (Select all that apply)",
        type: "multi",
        options: [
            { id: "q10_a", label: "Pre-diabetes", score: 1 },
            { id: "q10_b", label: "Type 2 diabetes", score: 2 },
            { id: "q10_c", label: "PCOS", score: 1 },
            { id: "q10_d", label: "Fatty liver / high GGT", score: 2 },
            { id: "q10_e", label: "High triglycerides", score: 2 },
            { id: "q10_f", label: "None", score: 0 }
        ]
    },
    // SECTION E — GOAL PRIORITY
    {
        id: "q11",
        section: "SECTION E — GOAL PRIORITY",
        question: "What is your immediate goal?",
        type: "single",
        options: [
            { id: "q11_a", label: "Start GLP-1 safely", score: 1 },
            { id: "q11_b", label: "Reduce side effects", score: 2 },
            { id: "q11_c", label: "Improve strength & metabolism", score: 3 },
            { id: "q11_d", label: "Break a plateau", score: 3 },
            { id: "q11_e", label: "Sculpt body / tighten skin", score: 2 },
            { id: "q11_f", label: "Prepare to stop GLP-1", score: 4 },
            { id: "q11_g", label: "Avoid rebound after stopping", score: 4 }
        ]
    },
    // Additional Assessment Questions
    {
        id: "q12",
        section: "SECTION F — ADDITIONAL ASSESSMENT",
        question: "Select if applicable:",
        type: "multi",
        isOverride: true,
        overrideCategory: "GLP-1 360: EXIT™️",
        options: [
            { id: "q12_a", label: "Appetite < 600 kcal/day", score: 0 },
            { id: "q12_b", label: "Planning to stop GLP-1 within 30 days", score: 0 },
            { id: "q12_c", label: "Already regained > 3 kg after stopping", score: 0 },
            { id: "q12_d", label: "None", score: 0 }
        ]
    },
    {
        id: "q13",
        section: "SECTION F — ADDITIONAL ASSESSMENT",
        question: "Select if applicable:",
        type: "multi",
        isOverride: true,
        overrideCategory: "GLP-1 360: TRANSFORM™️",
        options: [
            { id: "q13_a", label: "Muscle loss > 1.5–2.0 kg on BCA", score: 0 },
            { id: "q13_b", label: "Plateau > 4 weeks", score: 0 },
            { id: "q13_c", label: "Persistent weakness", score: 0 },
            { id: "q13_d", label: "Moderate gut issues", score: 0 },
            { id: "q13_e", label: "None", score: 0 }
        ]
    },
    {
        id: "q14",
        section: "SECTION F — ADDITIONAL ASSESSMENT",
        question: "Select if applicable:",
        type: "multi",
        isOverride: true,
        overrideCategory: "GLP-1 360: BASE™️",
        options: [
            { id: "q14_a", label: "Completely new starter", score: 0 },
            { id: "q14_b", label: "No side effects", score: 0 },
            { id: "q14_c", label: "Normal strength levels", score: 0 },
            { id: "q14_d", label: "None", score: 0 }
        ]
    }
];
