// utils/analyzeDepression.js
/**
 * Enhanced Depression Assessment using PHQ-9 Standard
 * Professional-grade screening with crisis intervention
 */

const analyzeDepression = (formData) => {
    const {
        // Demographics
        age,
        gender,
        maritalStatus,
        employmentStatus,

        // Lifestyle factors
        stressLevel,
        sleepQuality,
        socialSupport,
        physicalActivity,
        dietQuality,
        geneticHistory,
        medicalConditions = [],

        // PHQ-9 Questions (0-3 scale: 0=not at all, 1=several days, 2=more than half the days, 3=nearly every day)
        littleInterest = 0,          // Little interest or pleasure in doing things
        feelingDown = 0,             // Feeling down, depressed, or hopeless
        troubleSleeping = 0,         // Trouble falling/staying asleep, or sleeping too much
        feelingTired = 0,            // Feeling tired or having little energy
        poorAppetite = 0,            // Poor appetite or overeating
        feelingBad = 0,              // Feeling bad about yourself or that you're a failure
        troubleConcentrating = 0,    // Trouble concentrating on things
        movingSlow = 0,              // Moving or speaking slowly, or being fidgety/restless
        suicidalThoughts = 0,        // Thoughts that you would be better off dead or hurting yourself

        // Additional assessment
        functionalImpairment = 0,    // 0-3: How difficult have problems made life
        currentTreatment = false,
        previousDepression = false,
        substanceUse = false,
        traumaHistory = false,
        chronicPain = false,
        recentLifeEvents = []        // job loss, divorce, death, etc.
    } = formData;

    let phq9Score = 0;
    let depressionSeverity = '';
    let riskLevel = '';
    let keyFactors = [];
    let recommendations = [];
    let crisisIntervention = false;
    let professionalHelpUrgency = 'none';

    // 1. Calculate PHQ-9 Score (0-27)
    phq9Score =
        littleInterest +
        feelingDown +
        troubleSleeping +
        feelingTired +
        poorAppetite +
        feelingBad +
        troubleConcentrating +
        movingSlow +
        suicidalThoughts;

    // 2. Determine Depression Severity
    if (phq9Score <= 4) {
        depressionSeverity = 'None-Minimal';
        riskLevel = 'low';
    } else if (phq9Score <= 9) {
        depressionSeverity = 'Mild';
        riskLevel = 'low';
        professionalHelpUrgency = 'consider';
    } else if (phq9Score <= 14) {
        depressionSeverity = 'Moderate';
        riskLevel = 'moderate';
        professionalHelpUrgency = 'recommended';
    } else if (phq9Score <= 19) {
        depressionSeverity = 'Moderately Severe';
        riskLevel = 'high';
        professionalHelpUrgency = 'strongly recommended';
    } else {
        depressionSeverity = 'Severe';
        riskLevel = 'high';
        professionalHelpUrgency = 'urgent';
    }

    // 3. CRITICAL: Suicidal Ideation Check
    if (suicidalThoughts >= 1) {
        crisisIntervention = true;
        professionalHelpUrgency = 'emergency';
        keyFactors.push({ name: '⚠️ SUICIDAL THOUGHTS DETECTED', impact: 'Critical' });

        recommendations.unshift('🚨 CRISIS: Call National Suicide Prevention Lifeline: 988 (US) or 112 (India)');
        recommendations.unshift('🚨 EMERGENCY: Seek immediate help from a mental health professional or emergency room');
        recommendations.unshift('🚨 Tell someone you trust immediately - do not stay alone');
    }

    // 4. Analyze Key Factors

    // Core PHQ-9 symptoms
    if (littleInterest >= 2) {
        keyFactors.push({ name: 'Loss of Interest/Pleasure (Anhedonia)', impact: 'High' });
    }

    if (feelingDown >= 2) {
        keyFactors.push({ name: 'Persistent Low Mood', impact: 'High' });
    }

    if (feelingBad >= 2) {
        keyFactors.push({ name: 'Low Self-Esteem/Guilt', impact: 'High' });
    }

    if (troubleConcentrating >= 2) {
        keyFactors.push({ name: 'Cognitive Impairment', impact: 'Moderate' });
    }

    // Sleep and energy
    if (troubleSleeping >= 2) {
        keyFactors.push({ name: 'Sleep Disturbance', impact: 'High' });
        recommendations.push('Address sleep issues - poor sleep worsens depression significantly');
    }

    if (feelingTired >= 2) {
        keyFactors.push({ name: 'Fatigue/Low Energy', impact: 'High' });
    }

    // Appetite and psychomotor
    if (poorAppetite >= 2) {
        keyFactors.push({ name: 'Appetite Changes', impact: 'Moderate' });
    }

    if (movingSlow >= 2) {
        keyFactors.push({ name: 'Psychomotor Changes', impact: 'Moderate' });
    }

    // Lifestyle factors
    if (stressLevel >= 7) {
        keyFactors.push({ name: 'Chronic High Stress', impact: 'High' });
        recommendations.push('Stress management is critical - consider therapy or stress reduction techniques');
    }

    if (sleepQuality <= 4) {
        keyFactors.push({ name: 'Poor Sleep Quality', impact: 'High' });
    }

    if (socialSupport <= 3) {
        keyFactors.push({ name: 'Insufficient Social Support', impact: 'High' });
        recommendations.push('Social isolation worsens depression - reach out to friends, family, or support groups');
    }

    if (physicalActivity < 30) {
        keyFactors.push({ name: 'Physical Inactivity', impact: 'Moderate' });
        recommendations.push('Regular exercise is proven to reduce depression - start with 20-30 min walks daily');
    }

    // Risk factors
    if (geneticHistory) {
        keyFactors.push({ name: 'Family History of Depression', impact: 'Moderate' });
    }

    if (previousDepression) {
        keyFactors.push({ name: 'Previous Depressive Episodes', impact: 'High' });
    }

    if (substanceUse) {
        keyFactors.push({ name: 'Substance Use', impact: 'High' });
        recommendations.push('Substance use can worsen depression - seek help for both conditions');
    }

    if (traumaHistory) {
        keyFactors.push({ name: 'Trauma History', impact: 'High' });
        recommendations.push('Trauma-informed therapy (EMDR, trauma-focused CBT) may be beneficial');
    }

    if (chronicPain) {
        keyFactors.push({ name: 'Chronic Pain', impact: 'High' });
        recommendations.push('Chronic pain and depression often co-occur - treat both simultaneously');
    }

    // Recent life stressors
    if (recentLifeEvents.length > 0) {
        keyFactors.push({ name: `Recent Life Stressors (${recentLifeEvents.length})`, impact: 'High' });
    }

    // Functional impairment
    if (functionalImpairment >= 2) {
        keyFactors.push({ name: 'Significant Functional Impairment', impact: 'High' });
        recommendations.push('Depression is affecting your daily functioning - professional help is important');
    }

    // 5. Generate Recommendations based on severity

    if (phq9Score >= 15) {
        // Moderately severe to severe
        recommendations.push('⚠️ URGENT: Schedule an appointment with a psychiatrist or mental health professional immediately');
        recommendations.push('Consider antidepressant medication - consult with a psychiatrist');
        recommendations.push('Psychotherapy (CBT, IPT, or psychodynamic therapy) is highly recommended');

        if (!currentTreatment) {
            recommendations.push('You need professional treatment - do not try to manage this alone');
        }
    } else if (phq9Score >= 10) {
        // Moderate
        recommendations.push('Consult a mental health professional (therapist, psychologist, or psychiatrist)');
        recommendations.push('Cognitive Behavioral Therapy (CBT) is highly effective for moderate depression');
        recommendations.push('Consider whether medication might help - discuss with a doctor');
    } else if (phq9Score >= 5) {
        // Mild
        recommendations.push('Monitor your symptoms - if they persist or worsen, seek professional help');
        recommendations.push('Self-help strategies may be sufficient at this stage');
        recommendations.push('Consider preventive therapy or counseling');
    }

    // Universal recommendations
    if (phq9Score >= 5) {
        // Lifestyle interventions
        recommendations.push('Exercise regularly - 30 min of moderate activity 5x/week reduces depression');
        recommendations.push('Maintain a consistent sleep schedule - 7-9 hours per night');
        recommendations.push('Practice healthy eating habits - Mediterranean diet shows benefits');

        // Social connection
        if (socialSupport < 5) {
            recommendations.push('Increase social connections - join clubs, volunteer, or reconnect with friends');
            recommendations.push('Consider support groups for depression (online or in-person)');
        }

        // Mindfulness and self-care
        recommendations.push('Try mindfulness meditation or yoga - proven to help with depression');
        recommendations.push('Set small, achievable goals each day to build momentum');
        recommendations.push('Avoid alcohol and recreational drugs - they worsen depression');

        // Behavioral activation
        recommendations.push('Schedule pleasant activities - engage in hobbies you used to enjoy');
        recommendations.push('Get sunlight exposure - especially important in winter months');
    }

    // Treatment adherence
    if (currentTreatment && phq9Score >= 10) {
        recommendations.push('Your current treatment may need adjustment - discuss with your provider');
    }

    // 6. Determine appropriate depression subtype (if applicable)
    let depressionType = '';
    let depressionTypeDescription = '';

    if (phq9Score >= 10) {
        if (littleInterest >= 2 && feelingDown >= 2) {
            depressionType = 'Major Depressive Episode';
            depressionTypeDescription = 'You meet criteria suggesting a major depressive episode. Professional evaluation is recommended.';
        } else if (phq9Score >= 5 && phq9Score <= 14) {
            depressionType = 'Persistent Depressive Disorder (Dysthymia)';
            depressionTypeDescription = 'Chronic low-grade depression that may have lasted months or years.';
        }

        if (troubleSleeping >= 2 && (poorAppetite >= 2 || feelingTired >= 2)) {
            depressionType += ' with Melancholic Features';
            depressionTypeDescription += ' Sleep and appetite disturbances are prominent.';
        }
    }

    // 7. Crisis resources
    const crisisResources = crisisIntervention ? [
        {
            name: 'National Suicide Prevention Lifeline',
            contact: '988 (US)',
            available: '24/7'
        },
        {
            name: 'Crisis Text Line',
            contact: 'Text "HELLO" to 741741',
            available: '24/7'
        },
        {
            name: 'International Association for Suicide Prevention',
            contact: 'https://www.iasp.info/resources/Crisis_Centres/',
            available: 'Find local crisis centers'
        }
    ] : [];

    // 8. Treatment recommendations by severity
    const treatmentPlan = {
        psychotherapy: phq9Score >= 10,
        medication: phq9Score >= 15,
        combinedTreatment: phq9Score >= 15,
        hospitalization: crisisIntervention || phq9Score >= 20,
        selfHelp: phq9Score < 10
    };

    return {
        phq9Score,
        depressionSeverity,
        riskLevel,
        depressionType,
        depressionTypeDescription,
        keyFactors,
        recommendations: [...new Set(recommendations)], // Remove duplicates
        crisisIntervention,
        professionalHelpUrgency,
        crisisResources,
        treatmentPlan,
        functionalImpact: functionalImpairment >= 2 ? 'Significant' : functionalImpairment >= 1 ? 'Moderate' : 'Minimal',
        symptomBreakdown: {
            emotionalSymptoms: littleInterest + feelingDown + feelingBad,
            cognitiveSymptoms: troubleConcentrating,
            physicalSymptoms: troubleSleeping + feelingTired + poorAppetite + movingSlow,
            suicidalIdeation: suicidalThoughts
        }
    };
};

export default analyzeDepression;
