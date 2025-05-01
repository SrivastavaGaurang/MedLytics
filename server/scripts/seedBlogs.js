// scripts/seedBlogs.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from '../models/Blog.js';

dotenv.config();

// Sample blog data
const sampleBlogs = [
  {
    title: 'Understanding Sleep Disorders',
    content: `Sleep disorders affect millions of people worldwide and can have a significant impact on health and quality of life. Common sleep disorders include insomnia, sleep apnea, restless legs syndrome, and narcolepsy.

Insomnia is characterized by difficulty falling asleep, staying asleep, or both. It can be caused by stress, anxiety, depression, or certain medications. Treatment options include cognitive behavioral therapy for insomnia (CBT-I), relaxation techniques, and sometimes medication.

Sleep apnea is a potentially serious sleep disorder in which breathing repeatedly stops and starts during sleep. The most common type is obstructive sleep apnea, which occurs when throat muscles relax and block the airway during sleep. Continuous positive airway pressure (CPAP) therapy is the most common treatment.

Restless legs syndrome causes uncomfortable sensations in the legs and an irresistible urge to move them. These sensations typically occur in the evening or during periods of rest.

Narcolepsy is a chronic sleep disorder characterized by overwhelming daytime drowsiness and sudden attacks of sleep. It's a neurological disorder that affects the brain's ability to control sleep-wake cycles.

If you suspect you have a sleep disorder, it's important to consult with a healthcare provider who can help diagnose and treat the condition.`,
    summary: 'An overview of common sleep disorders, their symptoms, and treatment options.',
    image: 'https://via.placeholder.com/600x300?text=Sleep+Disorders',
    author: 'Dr. Sarah Johnson',
    tags: ['sleep disorders', 'insomnia', 'sleep apnea', 'health']
  },
  {
    title: 'The Connection Between Anxiety and Physical Health',
    content: `Anxiety doesn't just affect your mental health—it can have profound effects on your physical wellbeing too. When you experience anxiety, your body activates its "fight or flight" response, releasing stress hormones that prepare you to respond to perceived threats.

While this response is helpful in genuinely dangerous situations, chronic activation of this system due to persistent anxiety can lead to various physical health problems over time.

Some physical manifestations of anxiety include:

1. Cardiovascular effects: Increased heart rate, palpitations, and elevated blood pressure. Long-term anxiety may contribute to heart disease risk.

2. Digestive issues: Many people experience stomach discomfort, nausea, or changes in bowel habits when anxious. Conditions like irritable bowel syndrome (IBS) are strongly linked to anxiety.

3. Respiratory effects: Anxiety can cause rapid, shallow breathing and may worsen symptoms of asthma or other respiratory conditions.

4. Immune system suppression: Chronic stress and anxiety can weaken your immune system, making you more susceptible to infections.

5. Muscle tension: Anxiety often leads to muscle tension, which can cause pain, especially in the neck, shoulders, and back.

6. Sleep disturbances: Difficulty falling or staying asleep is common with anxiety, creating a cycle where lack of sleep worsens anxiety symptoms.

Managing anxiety through techniques like mindfulness, cognitive-behavioral therapy, regular exercise, and sometimes medication can help alleviate both the mental and physical symptoms. If you're experiencing significant anxiety, consider speaking with a healthcare provider about treatment options.`,
    summary: 'Exploring how anxiety affects physical health and the importance of managing stress.',
    image: 'https://via.placeholder.com/600x300?text=Anxiety+and+Health',
    author: 'Dr. Michael Chen',
    tags: ['anxiety', 'mental health', 'physical health', 'stress management']
  },
  {
    title: 'Nutrition Essentials for Mental Wellbeing',
    content: `What you eat doesn't just affect your physical health—it plays a crucial role in your mental wellbeing too. Research increasingly shows that diet quality is linked to mental health outcomes, including depression and anxiety.

Key nutrients that support brain health include:

Omega-3 fatty acids: Found in fatty fish (like salmon and sardines), walnuts, and flaxseeds, these essential fats are critical for brain function and may help reduce symptoms of depression.

B vitamins: Particularly B12 and folate, which support the production of neurotransmitters that regulate mood. Good sources include leafy greens, legumes, eggs, and fortified cereals.

Antioxidants: Colorful fruits and vegetables contain antioxidants that protect the brain from oxidative stress. Berries, dark chocolate, and green tea are especially rich in brain-protective compounds.

Probiotics: Emerging research suggests that gut health significantly impacts mental health through the "gut-brain axis." Fermented foods like yogurt, kefir, and sauerkraut support a healthy gut microbiome.

Complex carbohydrates: Whole grains provide steady energy to the brain and support the production of serotonin, a mood-regulating neurotransmitter.

Limiting or avoiding certain foods can also benefit mental health:

Processed foods high in refined sugars and unhealthy fats can contribute to inflammation, which is linked to depression and cognitive decline.

Excessive alcohol can disrupt sleep, deplete nutrients, and worsen anxiety and depression over time.

Caffeine, while beneficial in moderation for some people, can exacerbate anxiety and sleep problems in others.

Following a Mediterranean-style diet—rich in vegetables, fruits, whole grains, lean proteins, and healthy fats—has been associated with lower rates of depression and better overall mental health outcomes.

Remember that nutrition is just one piece of the mental health puzzle. Physical activity, sleep, stress management, and social connection all play important roles as well.`,
    summary: 'How diet and specific nutrients affect brain health and mental wellbeing.',
    image: 'https://via.placeholder.com/600x300?text=Nutrition+and+Mental+Health',
    author: 'Emma Rodriguez, RD',
    tags: ['nutrition', 'mental health', 'diet', 'brain health']
  }
];

// Connect to MongoDB
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');
    
    // Clear existing blogs
    await Blog.deleteMany({});
    console.log('Cleared existing blog data');
    
    // Insert sample blogs
    await Blog.insertMany(sampleBlogs);
    console.log('Sample blogs added successfully');
    
    mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();