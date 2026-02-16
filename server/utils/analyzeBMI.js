// utils/analyzeBMI.js
/**
 * Enhanced BMI and Nutritional Analysis Algorithm
 * Provides comprehensive health assessment with personalized meal plans
 */

const analyzeBMI = (formData) => {
    const {
        // Basic demographics
        age,
        gender,
        height,
        weight,

        // Lifestyle factors
        sleepDuration,
        qualityOfSleep,
        physicalActivityLevel,
        stressLevel,
        bloodPressure,
        heartRate,
        dailySteps,

        // Enhanced nutritional fields
        mealsPerDay = 3,
        waterIntake = 6,              // glasses per day
        vegetableServings = 2,
        fruitServings = 2,
        processedFoodFrequency = 2,    // 0=never, 3=daily
        fastFoodFrequency = 1,         // times per week
        breakfastHabit = true,
        emotionalEating = false,
        bingEating = false,
        lateNightSnacking = false,
        sugarIntake = 2,               // 0-5 scale
        alcoholConsumption = 1,        // drinks per week
        supplementsUsed = [],          // array of strings
        dietaryRestrictions = [],      // vegetarian, vegan, etc.
        cookingFrequency = 3,          // times per week
        mealPreparation = 'home',      // home, restaurant, takeout
        portionControl = 5,            // 0-10 scale
        snackingHabits = 2             // 0-5 scale
    } = formData;

    // Calculate BMI
    const heightInMeters = height / 100;
    const calculatedBMI = weight / (heightInMeters * heightInMeters);

    let nutritionScore = 0;
    let bmiCategory = '';
    let healthRisk = '';
    let keyFactors = [];
    let recommendations = [];
    let mealPlan = {};
    let targetCalories = 0;
    let macronutrients = {};

    // 1. Determine BMI Category
    if (calculatedBMI < 16) {
        bmiCategory = 'Severe Thinness';
        healthRisk = 'Very High';
    } else if (calculatedBMI < 17) {
        bmiCategory = 'Moderate Thinness';
        healthRisk = 'High';
    } else if (calculatedBMI < 18.5) {
        bmiCategory = 'Mild Thinness';
        healthRisk = 'Moderate';
    } else if (calculatedBMI < 25) {
        bmiCategory = 'Normal';
        healthRisk = 'Minimal';
    } else if (calculatedBMI < 30) {
        bmiCategory = 'Overweight';
        healthRisk = 'Moderate';
    } else if (calculatedBMI < 35) {
        bmiCategory = 'Obese Class I';
        healthRisk = 'High';
    } else if (calculatedBMI < 40) {
        bmiCategory = 'Obese Class II';
        healthRisk = 'Very High';
    } else {
        bmiCategory = 'Obese Class III';
        healthRisk = 'Extremely High';
    }

    // 2. Calculate Nutrition Score (0-100)

    // Water intake (15 points)
    if (waterIntake >= 8) {
        nutritionScore += 15;
    } else if (waterIntake >= 6) {
        nutritionScore += 12;
        recommendations.push('Increase water intake to 8 glasses per day');
    } else if (waterIntake >= 4) {
        nutritionScore += 8;
        keyFactors.push({ name: 'Low Water Intake', impact: 'Medium', value: `${waterIntake} glasses/day` });
        recommendations.push('Drink more water - aim for at least 8 glasses daily');
    } else {
        nutritionScore += 4;
        keyFactors.push({ name: 'Very Low Water Intake', impact: 'High', value: `${waterIntake} glasses/day` });
        recommendations.push('CRITICAL: Increase water intake significantly - dehydration affects metabolism');
    }

    // Vegetable servings (15 points)
    if (vegetableServings >= 5) {
        nutritionScore += 15;
    } else if (vegetableServings >= 3) {
        nutritionScore += 12;
        recommendations.push('Try to reach 5 servings of vegetables daily');
    } else {
        nutritionScore += 6;
        keyFactors.push({ name: 'Insufficient Vegetables', impact: 'High', value: `${vegetableServings} servings/day` });
        recommendations.push('Increase vegetable intake to at least 5 servings per day');
    }

    // Fruit servings (10 points)
    if (fruitServings >= 3) {
        nutritionScore += 10;
    } else if (fruitServings >= 2) {
        nutritionScore += 7;
    } else {
        nutritionScore += 4;
        recommendations.push('Include 2-3 servings of fruit daily');
    }

    // Processed food (15 points - inverse scoring)
    if (processedFoodFrequency === 0) {
        nutritionScore += 15;
    } else if (processedFoodFrequency === 1) {
        nutritionScore += 12;
    } else if (processedFoodFrequency === 2) {
        nutritionScore += 8;
        keyFactors.push({ name: 'Moderate Processed Food', impact: 'Medium', value: 'Several times/week' });
        recommendations.push('Reduce processed food consumption - cook fresh meals more often');
    } else {
        nutritionScore += 3;
        keyFactors.push({ name: 'High Processed Food', impact: 'High', value: 'Daily' });
        recommendations.push('IMPORTANT: Minimize processed foods - they increase health risks significantly');
    }

    // Fast food frequency (10 points - inverse)
    if (fastFoodFrequency === 0) {
        nutritionScore += 10;
    } else if (fastFoodFrequency <= 1) {
        nutritionScore += 7;
    } else if (fastFoodFrequency <= 3) {
        nutritionScore += 4;
        keyFactors.push({ name: 'Frequent Fast Food', impact: 'Medium', value: `${fastFoodFrequency} times/week` });
        recommendations.push('Limit fast food to once per week or less');
    } else {
        nutritionScore += 2;
        keyFactors.push({ name: 'Excessive Fast Food', impact: 'High', value: `${fastFoodFrequency} times/week` });
        recommendations.push('CRITICAL: Fast food is sabotaging your health goals - reduce immediately');
    }

    // Breakfast habit (10 points)
    if (breakfastHabit) {
        nutritionScore += 10;
    } else {
        nutritionScore += 4;
        keyFactors.push({ name: 'Skipping Breakfast', impact: 'Medium', value: 'Regularly skipped' });
        recommendations.push('Eat a healthy breakfast to boost metabolism and reduce cravings');
    }

    // Meal frequency (5 points)
    if (mealsPerDay >= 3 && mealsPerDay <= 5) {
        nutritionScore += 5;
    } else if (mealsPerDay < 3) {
        keyFactors.push({ name: 'Irregular Eating', impact: 'Medium', value: `${mealsPerDay} meals/day` });
        recommendations.push('Eat regular meals - skipping meals can slow metabolism');
    }

    // Portion control (10 points)
    if (portionControl >= 7) {
        nutritionScore += 10;
    } else if (portionControl >= 5) {
        nutritionScore += 7;
    } else {
        nutritionScore += 3;
        keyFactors.push({ name: 'Poor Portion Control', impact: 'High', value: 'Needs improvement' });
        recommendations.push('Practice portion control using smaller plates and mindful eating');
    }

    // Sugar intake (10 points - inverse)
    if (sugarIntake <= 1) {
        nutritionScore += 10;
    } else if (sugarIntake <= 2) {
        nutritionScore += 7;
    } else {
        nutritionScore += 3;
        keyFactors.push({ name: 'High Sugar Intake', impact: 'High', value: 'Above recommended' });
        recommendations.push('Reduce added sugars - use natural sweeteners or fruits instead');
    }

    // Negative factors
    if (emotionalEating) {
        nutritionScore = Math.max(0, nutritionScore - 5);
        keyFactors.push({ name: 'Emotional Eating', impact: 'High', value: 'Yes' });
        recommendations.push('Address emotional eating with mindfulness or counseling');
    }

    if (bingEating) {
        nutritionScore = Math.max(0, nutritionScore - 10);
        keyFactors.push({ name: 'Binge Eating', impact: 'High', value: 'Yes' });
        recommendations.push('IMPORTANT: Seek professional help for binge eating disorder');
    }

    if (lateNightSnacking) {
        nutritionScore = Math.max(0, nutritionScore - 3);
        keyFactors.push({ name: 'Late Night Snacking', impact: 'Medium', value: 'Yes' });
        recommendations.push('Avoid eating 2-3 hours before bedtime for better digestion');
    }

    // 3. Calculate Target Calories (Mifflin-St Jeor Equation)
    let bmr;
    if (gender.toLowerCase() === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Activity multiplier
    let activityMultiplier;
    if (dailySteps < 3000) {
        activityMultiplier = 1.2; // Sedentary
    } else if (dailySteps < 7000) {
        activityMultiplier = 1.375; // Lightly active
    } else if (dailySteps < 10000) {
        activityMultiplier = 1.55; // Moderately active
    } else {
        activityMultiplier = 1.725; // Very active
    }

    targetCalories = Math.round(bmr * activityMultiplier);

    // Adjust for weight goals
    let calorieGoal;
    if (calculatedBMI < 18.5) {
        calorieGoal = targetCalories + 300; // Surplus for weight gain
        recommendations.push(`Aim for ${calorieGoal} calories daily to gain weight healthily`);
    } else if (calculatedBMI > 25) {
        calorieGoal = targetCalories - 500; // Deficit for weight loss
        recommendations.push(`Aim for ${calorieGoal} calories daily for steady weight loss (1-2 lbs/week)`);
    } else {
        calorieGoal = targetCalories; // Maintenance
        recommendations.push(`Maintain ${calorieGoal} calories daily to preserve current weight`);
    }

    // 4. Calculate Macronutrient targets
    macronutrients = {
        protein: {
            grams: Math.round(weight * (gender.toLowerCase() === 'male' ? 1.6 : 1.4)),
            calories: Math.round(weight * (gender.toLowerCase() === 'male' ? 1.6 : 1.4) * 4),
            percentage: Math.round((weight * 1.5 * 4) / calorieGoal * 100)
        },
        carbs: {
            grams: Math.round(calorieGoal * 0.45 / 4),
            calories: Math.round(calorieGoal * 0.45),
            percentage: 45
        },
        fats: {
            grams: Math.round(calorieGoal * 0.25 / 9),
            calories: Math.round(calorieGoal * 0.25),
            percentage: 25
        }
    };

    // 5. Generate Meal Plan
    mealPlan = generateMealPlan(calorieGoal, macronutrients, dietaryRestrictions, bmiCategory);

    // 6. Add BMI-specific recommendations
    if (calculatedBMI < 18.5) {
        recommendations.push('Focus on nutrient-dense, calorie-rich foods: nuts, avocados, whole grains');
        recommendations.push('Add strength training to build muscle mass');
        recommendations.push('Eat 5-6 smaller meals throughout the day');
    } else if (calculatedBMI >= 25 && calculatedBMI < 30) {
        recommendations.push('Increase physical activity to 150-300 minutes per week');
        recommendations.push('Focus on whole foods and reduce calorie-dense snacks');
        recommendations.push('Track your food intake to stay accountable');
    } else if (calculatedBMI >= 30) {
        recommendations.push('Consult a doctor or registered dietitian for personalized guidance');
        recommendations.push('Start with small, sustainable changes - walk 30 min daily');
        recommendations.push('Consider seeking support groups for weight management');
        recommendations.push('Get screened for metabolic conditions (diabetes, cholesterol)');
    }

    // 7. Add health risk factors
    if (bloodPressure.systolic > 140 || bloodPressure.diastolic > 90) {
        keyFactors.push({ name: 'Hypertension', impact: 'High', value: `${bloodPressure.systolic}/${bloodPressure.diastolic}` });
        recommendations.push('Reduce sodium intake and follow DASH diet for blood pressure');
    }

    if (stressLevel > 7) {
        keyFactors.push({ name: 'High Stress', impact: 'High', value: `${stressLevel}/10` });
        recommendations.push('Chronic stress affects weight - practice stress management techniques');
    }

    if (sleepDuration < 7) {
        keyFactors.push({ name: 'Insufficient Sleep', impact: 'High', value: `${sleepDuration} hours` });
        recommendations.push('Poor sleep increases hunger hormones - aim for 7-9 hours');
    }

    // 8. Calculate confidence score
    const confidence = Math.min(100, 70 + nutritionScore * 0.3);

    return {
        calculatedBMI: Math.round(calculatedBMI * 10) / 10,
        bmiCategory,
        healthRisk,
        nutritionScore: Math.round(nutritionScore),
        targetCalories: calorieGoal,
        bmr: Math.round(bmr),
        macronutrients,
        keyFactors,
        recommendations: [...new Set(recommendations)], // Remove duplicates
        mealPlan,
        confidence: Math.round(confidence),
        healthMetrics: {
            bodyWeightStatus: calculatedBMI < 18.5 ? 'Below Healthy Range' :
                calculatedBMI < 25 ? 'Healthy Range' :
                    calculatedBMI < 30 ? 'Above Healthy Range' : 'Obese Range',
            nutritionalStatus: nutritionScore >= 80 ? 'Excellent' :
                nutritionScore >= 60 ? 'Good' :
                    nutritionScore >= 40 ? 'Fair' : 'Poor',
            activityLevel: dailySteps >= 10000 ? 'Active' :
                dailySteps >= 7000 ? 'Moderate' :
                    dailySteps >= 5000 ? 'Light' : 'Sedentary'
        }
    };
};

function generateMealPlan(totalCalories, macronutrients, dietaryRestrictions, bmiCategory) {
    const meals = {
        breakfast: {
            calories: Math.round(totalCalories * 0.25),
            suggestions: []
        },
        lunch: {
            calories: Math.round(totalCalories * 0.35),
            suggestions: []
        },
        dinner: {
            calories: Math.round(totalCalories * 0.30),
            suggestions: []
        },
        snacks: {
            calories: Math.round(totalCalories * 0.10),
            suggestions: []
        }
    };

    // Breakfast suggestions
    meals.breakfast.suggestions = [
        'Oatmeal with berries, nuts, and protein powder',
        'Greek yogurt parfait with granola and fruits',
        'Whole grain toast with avocado and eggs',
        'Smoothie bowl with spinach, banana, and protein'
    ];

    // Lunch suggestions
    meals.lunch.suggestions = [
        'Grilled chicken salad with quinoa and mixed vegetables',
        'Salmon with brown rice and steamed broccoli',
        'Lentil soup with whole grain bread',
        'Turkey and vegetable wrap with hummus'
    ];

    // Dinner suggestions
    meals.dinner.suggestions = [
        'Lean beef stir-fry with mixed vegetables and brown rice',
        'Baked fish with sweet potato and green beans',
        'Chicken breast with roasted vegetables and quinoa',
        'Tofu curry with cauliflower rice'
    ];

    // Snack suggestions
    meals.snacks.suggestions = [
        'Apple slices with almond butter',
        'Mixed nuts (handful)',
        'Carrot sticks with hummus',
        'Protein shake or bar'
    ];

    // Adjust for dietary restrictions
    if (dietaryRestrictions.includes('vegetarian') || dietaryRestrictions.includes('vegan')) {
        meals.lunch.suggestions = meals.lunch.suggestions.filter(s => !s.toLowerCase().includes('chicken') && !s.toLowerCase().includes('salmon') && !s.toLowerCase().includes('turkey'));
        meals.lunch.suggestions.unshift('Chickpea buddha bowl with tahini dressing');

        meals.dinner.suggestions = meals.dinner.suggestions.filter(s => !s.toLowerCase().includes('beef') && !s.toLowerCase().includes('fish') && !s.toLowerCase().includes('chicken'));
        meals.dinner.suggestions.unshift('Black bean and vegetable enchiladas');
    }

    return meals;
}

export default analyzeBMI;
