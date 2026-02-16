// utils/analyzeAnxiety.js
/**
 * Enhanced Anxiety Assessment Algorithm
 * Based on GAD-7 (Generalized Anxiety Disorder) scale with additional factors
 */

const analyzeAnxiety = (formData) => {
    const {
        // Basic demographics
        age,
        gender,
        school_year,
        bmi,
        who_bmi,

        // Core GAD-7 questions (0-3 scale each)
        phq_score = 0,
        epworth_score = 0,
        anxiousness = false,
        suicidal = false,

        // Enhanced anxiety assessment fields
        nervousFeeling = 0,           // How often feeling nervous, anxious, or on edge (0-3)
        uncontrollableWorrying = 0,   // Trouble controlling worrying (0-3)
        excessiveWorrying = 0,        // Worrying too much about different things (0-3)
        troubleRelaxing = 0,          // Trouble relaxing (0-3)
        restlessness = 0,             // Being so restless it's hard to sit still (0-3)
        easilyAnnoyed = 0,            // Becoming easily annoyed or irritable (0-3)
        feelingAfraid = 0,            // Feeling afraid something awful might happen (0-3)

        // Physical symptoms
        heartPalpitations = false,
        sweating = false,
        trembling = false,
        shortnessOfBreath = false,
        chestPain = false,
        nausea = false,
        dizziness = false,

        // Social anxiety indicators
        socialAvoidance = false,
        publicSpeakingFear = false,
        smallTalkDifficulty = false,

        // Panic attack history
        panicAttacksFrequency = 0,    // 0=never, 1=rarely, 2=sometimes, 3=often

        // Behavioral factors
        concentrationDifficulty = false,
        sleepDisturbance = false,
        fatigueLevel = 0,             // 0-10 scale
        appetiteChange = false,

        // Coping mechanisms
        exerciseFrequency = 0,        // days per week
        socialSupport = 5,            // 0-10 scale
        professionalHelp = false
    } = formData;

    let anxietyScore = 0;
    let severityLevel = '';
    let riskFactors = [];
    let symptoms = [];
    let recommendations = [];
    let copingStrategies = [];
    let needsProfessionalHelp = false;

    // 1. Calculate GAD-7 Core Score (0-21)
    const gad7Score =
        nervousFeeling +
        uncontrollableWorrying +
        excessiveWorrying +
        troubleRelaxing +
        restlessness +
        easilyAnnoyed +
        feelingAfraid;

    anxietyScore += gad7Score;

    // 2. Add PHQ and Epworth scores (normalized)
    anxietyScore += Math.min(phq_score / 2, 5);  // Max 5 points
    anxietyScore += Math.min(epworth_score / 3, 3);  // Max 3 points

    // 3. Physical symptoms assessment (up to 10 points)
    const physicalSymptoms = [
        heartPalpitations,
        sweating,
        trembling,
        shortnessOfBreath,
        chestPain,
        nausea,
        dizziness
    ];

    const physicalSymptomCount = physicalSymptoms.filter(Boolean).length;
    anxietyScore += physicalSymptomCount * 1.5;

    if (physicalSymptomCount >= 1) {
        symptoms.push('Physical anxiety symptoms');
    }
    if (physicalSymptomCount >= 4) {
        riskFactors.push('Multiple physical anxiety symptoms');
    }

    // 4. Social anxiety factor (up to 5 points)
    const socialAnxietyFactors = [
        socialAvoidance,
        publicSpeakingFear,
        smallTalkDifficulty
    ];

    const socialAnxietyCount = socialAnxietyFactors.filter(Boolean).length;
    anxietyScore += socialAnxietyCount * 1.5;

    if (socialAnxietyCount >= 2) {
        symptoms.push('Social Anxiety');
        riskFactors.push('Significant social anxiety');
    }

    // 5. Panic attack assessment (up to 6 points)
    anxietyScore += panicAttacksFrequency * 2;

    if (panicAttacksFrequency >= 2) {
        symptoms.push('Panic Disorder');
        riskFactors.push('Recurring panic attacks');
        needsProfessionalHelp = true;
    }

    // 6. Behavioral and functional impairment (up to 8 points)
    if (concentrationDifficulty) {
        anxietyScore += 2;
        symptoms.push('Concentration difficulties');
    }
    if (sleepDisturbance) {
        anxietyScore += 2;
        symptoms.push('Sleep disturbance');
    }
    if (fatigueLevel >= 7) {
        anxietyScore += 2;
        symptoms.push('Severe fatigue');
    }
    if (appetiteChange) {
        anxietyScore += 2;
        symptoms.push('Appetite changes');
    }

    // 7. High-risk indicators
    if (anxiousness && suicidal) {
        anxietyScore += 10;
        needsProfessionalHelp = true;
        riskFactors.push('⚠️ CRITICAL: Suicidal ideation detected');
    } else if (suicidal) {
        anxietyScore += 8;
        needsProfessionalHelp = true;
        riskFactors.push('⚠️ CRITICAL: Suicidal thoughts');
    } else if (anxiousness) {
        anxietyScore += 3;
        riskFactors.push('Self-reported high anxiousness');
    }

    // 8. Protective factors (reduce score)
    if (exerciseFrequency >= 3) {
        anxietyScore = Math.max(0, anxietyScore - 2);
        copingStrategies.push('Regular exercise (protective factor)');
    }

    if (socialSupport >= 7) {
        anxietyScore = Math.max(0, anxietyScore - 2);
        copingStrategies.push('Strong social support (protective factor)');
    }

    if (professionalHelp) {
        copingStrategies.push('Currently receiving professional help');
    }

    // Determine severity level based on total score
    if (anxietyScore <= 5) {
        severityLevel = 'Minimal Anxiety';
    } else if (anxietyScore <= 10) {
        severityLevel = 'Mild Anxiety';
    } else if (anxietyScore <= 15) {
        severityLevel = 'Moderate Anxiety';
    } else if (anxietyScore <= 21) {
        severityLevel = 'Moderately Severe Anxiety';
        needsProfessionalHelp = true;
    } else {
        severityLevel = 'Severe Anxiety';
        needsProfessionalHelp = true;
    }

    // Generate personalized recommendations

    // Immediate crisis intervention
    if (suicidal || anxietyScore >= 21) {
        recommendations.push('🚨 URGENT: Contact a mental health crisis line immediately');
        recommendations.push('National Suicide Prevention Lifeline: 988 (US) or your local emergency number');
        recommendations.push('Seek immediate evaluation by a mental health professional');
    } else if (needsProfessionalHelp) {
        recommendations.push('⚠️ Consult a mental health professional (therapist, psychologist, or psychiatrist)');
        recommendations.push('Consider Cognitive Behavioral Therapy (CBT) for anxiety management');
    }

    // Breathing and relaxation techniques
    if (anxietyScore >= 10) {
        recommendations.push('Practice deep breathing: 4-7-8 technique (inhale 4 seconds, hold 7, exhale 8)');
        recommendations.push('Try progressive muscle relaxation exercises daily');
    }

    // Physical symptoms management
    if (physicalSymptomCount >= 2) {
        recommendations.push('Physical symptoms may be anxiety-related - consult a doctor to rule out medical causes');
        recommendations.push('Practice grounding techniques during panic episodes (5-4-3-2-1 method)');
    }

    // Social anxiety specific
    if (socialAnxietyCount >= 2) {
        recommendations.push('Gradual exposure to social situations can help (start small, increase slowly)');
        recommendations.push('Consider joining a social anxiety support group');
    }

    // Lifestyle recommendations
    if (exerciseFrequency < 3) {
        recommendations.push('Regular exercise (30 min, 3-5 times/week) significantly reduces anxiety');
    }

    if (sleepDisturbance) {
        recommendations.push('Establish a consistent sleep routine - poor sleep worsens anxiety');
    }

    // Mindfulness and stress management
    recommendations.push('Try mindfulness meditation apps (Headspace, Calm, Insight Timer)');
    recommendations.push('Limit caffeine and alcohol - both can increase anxiety symptoms');

    if (gad7Score >= 10) {
        recommendations.push('Keep an anxiety journal to identify triggers and patterns');
    }

    // Social support
    if (socialSupport < 5) {
        recommendations.push('Reach out to trusted friends or family - social connection reduces anxiety');
        recommendations.push('Consider online or in-person support groups for anxiety');
    }

    // Self-care
    recommendations.push('Set aside daily "worry time" (15 min) to contain anxious thoughts');
    recommendations.push('Practice self-compassion - be kind to yourself during anxious periods');

    // Return comprehensive analysis
    return {
        anxietyScore: Math.round(anxietyScore),
        gad7Score,
        severityLevel,
        riskFactors: riskFactors.length > 0 ? riskFactors : ['No significant risk factors identified'],
        symptoms: symptoms.length > 0 ? symptoms : ['Minimal symptoms'],
        recommendations: [...new Set(recommendations)],  // Remove duplicates
        copingStrategies,
        needsProfessionalHelp,
        crisisIntervention: suicidal,
        detailedAssessment: {
            psychologicalSymptoms: gad7Score >= 10 ? 'Significant' : gad7Score >= 5 ? 'Moderate' : 'Mild',
            physicalSymptoms: physicalSymptomCount >= 4 ? 'Severe' : physicalSymptomCount >= 2 ? 'Moderate' : 'Mild',
            socialImpact: socialAnxietyCount >= 2 ? 'High' : socialAnxietyCount >= 1 ? 'Moderate' : 'Low',
            functionalImpairment: (concentrationDifficulty || sleepDisturbance || fatigueLevel >= 7) ? 'Yes' : 'No'
        }
    };
};

export default analyzeAnxiety;
