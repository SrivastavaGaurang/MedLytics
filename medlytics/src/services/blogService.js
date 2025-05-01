// services/blogService.js
import axios from 'axios';

// Mock data for demonstration
const mockBlogs = [
  {
    _id: "1",
    title: "Understanding Blood Pressure: What Your Numbers Mean",
    content: "High blood pressure is often called the silent killer because it usually has no warning signs or symptoms, and many people do not know they have it. Understanding your blood pressure readings is an important part of maintaining cardiovascular health.\n\nBlood pressure is the force of blood pushing against the walls of arteries as the heart pumps blood. It is measured using two numbers: The first number, called systolic blood pressure, represents the pressure in your blood vessels when your heart beats. The second number, called diastolic blood pressure, represents the pressure in your blood vessels when your heart rests between beats.\n\nNormal blood pressure is less than 120/80 mm Hg. If your results fall into this category, stick with heart-healthy habits like following a balanced diet and getting regular exercise. Elevated blood pressure is when readings consistently range from 120-129 systolic and less than 80 mm Hg diastolic. People with elevated blood pressure are likely to develop high blood pressure unless steps are taken to control it.",
    summary: "Learn how to interpret your blood pressure readings and what they mean for your overall health.",
    image: "https://via.placeholder.com/600x350?text=Blood+Pressure",
    date: "2025-04-15T12:00:00.000Z",
    author: "Dr. Sarah Chen",
    authorTitle: "Cardiologist",
    authorImage: "https://via.placeholder.com/50x50",
    category: "Cardiology",
    featured: true,
    tags: ["Blood Pressure", "Heart Health", "Prevention"]
  },
  {
    _id: "2",
    title: "Mindfulness Meditation for Stress Reduction",
    content: "Mindfulness meditation is a mental training practice that teaches you to slow down racing thoughts, let go of negativity, and calm both your mind and body. It combines meditation with the practice of mindfulness, which is being intensely aware of what you're sensing and feeling in the moment, without interpretation or judgment.\n\nPracticing mindfulness meditation involves breathing methods, guided imagery, and other practices to relax the body and mind and help reduce stress. Spending too much time planning, problem-solving, daydreaming, or thinking negative or random thoughts can be draining. It can also make you more likely to experience stress, anxiety and symptoms of depression. Practicing mindfulness exercises can help you direct your attention away from this kind of thinking and engage with the world around you.",
    summary: "Discover how mindfulness meditation techniques can help manage stress and improve mental wellbeing.",
    image: "https://via.placeholder.com/600x350?text=Meditation",
    date: "2025-04-10T12:00:00.000Z",
    author: "Dr. Michael Rivera",
    authorTitle: "Psychiatrist",
    authorImage: "https://via.placeholder.com/50x50",
    category: "Mental Health",
    featured: true,
    tags: ["Meditation", "Stress Management", "Mental Health"]
  },
  {
    _id: "3",
    title: "Nutrition Basics: Building a Balanced Diet",
    content: "A balanced diet is essential for maintaining good health and preventing chronic diseases. The key components of a balanced diet include proteins, carbohydrates, fats, vitamins, minerals, and water.\n\nProteins are the building blocks of the body and are essential for growth, repair, and maintenance of body tissues. Good sources of protein include lean meat, fish, poultry, eggs, dairy products, legumes, nuts, and seeds.\n\nCarbohydrates are the body's main source of energy. They are found in foods like grains, fruits, vegetables, and legumes. Choose complex carbohydrates like whole grains over simple carbohydrates like refined sugar for sustained energy and better nutrition.\n\nFats are essential for many bodily functions, including vitamin absorption, brain health, and hormone production. Focus on healthy fats found in avocados, nuts, seeds, and olive oil, while limiting saturated and trans fats.",
    summary: "Learn the fundamentals of nutrition and how to create a balanced diet that supports your health goals.",
    image: "https://via.placeholder.com/600x350?text=Nutrition",
    date: "2025-04-05T12:00:00.000Z",
    author: "Emma Johnson",
    authorTitle: "Registered Dietitian",
    authorImage: "https://via.placeholder.com/50x50",
    category: "Nutrition",
    featured: false,
    tags: ["Nutrition", "Diet", "Healthy Eating"]
  },
  {
    _id: "4",
    title: "Exercise Guidelines for Heart Health",
    content: "Regular physical activity is one of the most important things you can do for your heart health. The American Heart Association recommends at least 150 minutes per week of moderate-intensity aerobic activity or 75 minutes per week of vigorous aerobic activity, or a combination of both, preferably spread throughout the week.\n\nAerobic exercises, such as walking, jogging, swimming, or cycling, are ideal for improving cardiovascular health. These activities increase your heart rate and breathing, which helps strengthen your heart and improve its efficiency.\n\nStrength training is also beneficial for heart health. The AHA recommends moderate- to high-intensity muscle-strengthening activity (such as resistance or weights) at least twice per week. Strength training helps reduce body fat, increase lean muscle mass, and burn calories more efficiently.",
    summary: "Understand the recommended exercise guidelines for maintaining optimal heart health and preventing cardiovascular disease.",
    image: "https://via.placeholder.com/600x350?text=Exercise",
    date: "2025-03-28T12:00:00.000Z",
    author: "Dr. James Wilson",
    authorTitle: "Sports Medicine Specialist",
    authorImage: "https://via.placeholder.com/50x50",
    category: "Cardiology",
    featured: false,
    tags: ["Exercise", "Heart Health", "Physical Activity"]
  },
  {
    _id: "5",
    title: "Understanding Diabetes: Types, Symptoms, and Management",
    content: "Diabetes is a chronic health condition that affects how your body turns food into energy. Most of the food you eat is broken down into sugar (glucose) and released into your bloodstream. When your blood sugar goes up, it signals your pancreas to release insulin, which acts like a key to let the blood sugar into your body's cells for use as energy.\n\nThere are three main types of diabetes: Type 1, Type 2, and gestational diabetes. Type 1 diabetes is an autoimmune disease where the body attacks the cells in the pancreas that make insulin, so the body cannot produce insulin. People with Type 1 diabetes need to take insulin every day. Type 2 diabetes occurs when the body becomes resistant to insulin or doesn't make enough insulin. Type 2 diabetes is often linked to lifestyle factors such as obesity and lack of physical activity. Gestational diabetes develops in pregnant women who have never had diabetes.",
    summary: "Learn about the different types of diabetes, their symptoms, and effective strategies for management.",
    image: "https://via.placeholder.com/600x350?text=Diabetes",
    date: "2025-03-20T12:00:00.000Z",
    author: "Dr. Lisa Patel",
    authorTitle: "Endocrinologist",
    authorImage: "https://via.placeholder.com/50x50",
    category: "Endocrinology",
    featured: false,
    tags: ["Diabetes", "Blood Sugar", "Chronic Disease"]
  },
  {
    _id: "6",
    title: "Sleep Hygiene: Tips for Better Rest",
    content: "Sleep hygiene refers to healthy sleep habits that can improve your ability to fall asleep and stay asleep. Good sleep hygiene is important for both physical and mental health, helping to improve productivity, quality of life, and preventing various chronic health conditions.\n\nOne of the most important sleep hygiene practices is maintaining a consistent sleep schedule. Try to go to bed and wake up at the same time every day, even on weekends. This helps regulate your body's internal clock and can help you fall asleep and stay asleep for the night.\n\nCreating a restful environment is also crucial. Your bedroom should be cool, quiet, and dark. Consider using earplugs, an eye mask, or a white noise machine if needed. Make sure your mattress and pillows are comfortable and supportive.",
    summary: "Discover practical sleep hygiene practices that can help improve your sleep quality and overall health.",
    image: "https://via.placeholder.com/600x350?text=Sleep+Hygiene",
    date: "2025-03-15T12:00:00.000Z",
    author: "Dr. Robert Thompson",
    authorTitle: "Sleep Specialist",
    authorImage: "https://via.placeholder.com/50x50",
    category: "Sleep Medicine",
    featured: false,
    tags: ["Sleep", "Rest", "Health Tips"]
  },
];

// Base API URL - replace with your actual API endpoint in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173/api';

// Get all blogs
export const getAllBlogs = async () => {
  try {
    // Uncomment this in production and comment out the mockBlogs return
    // const response = await axios.get(`${API_BASE_URL}/blogs`);
    // return response.data;
    
    // For demo purposes, return mock data
    return mockBlogs;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

// Get featured blogs
export const getFeaturedBlogs = async () => {
  try {
    // Uncomment this in production and comment out the mockBlogs filter
    // const response = await axios.get(`${API_BASE_URL}/blogs/featured`);
    // return response.data;
    
    // For demo purposes, filter mock data
    return mockBlogs.filter(blog => blog.featured);
  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    throw error;
  }
};

// Get blog by ID
export const getBlogById = async (id) => {
  try {
    // Uncomment this in production and comment out the mockBlogs find
    // const response = await axios.get(`${API_BASE_URL}/blogs/${id}`);
    // return response.data;
    
    // For demo purposes, find in mock data
    const blog = mockBlogs.find(blog => blog._id === id);
    if (!blog) {
      throw new Error('Blog not found');
    }
    return blog;
  } catch (error) {
    console.error(`Error fetching blog with ID ${id}:`, error);
    throw error;
  }
};

// Get blogs by category
export const getBlogsByCategory = async (category) => {
  try {
    // Uncomment this in production and comment out the mockBlogs filter
    // const response = await axios.get(`${API_BASE_URL}/blogs/category/${category}`);
    // return response.data;
    
    // For demo purposes, filter mock data
    return mockBlogs.filter(blog => blog.category === category);
  } catch (error) {
    console.error(`Error fetching blogs for category ${category}:`, error);
    throw error;
  }
};

// Search blogs
export const searchBlogs = async (query) => {
  try {
    // Uncomment this in production and comment out the mockBlogs filter
    // const response = await axios.get(`${API_BASE_URL}/blogs/search?q=${query}`);
    // return response.data;
    
    // For demo purposes, search in mock data
    const searchTerm = query.toLowerCase();
    return mockBlogs.filter(blog => 
      blog.title.toLowerCase().includes(searchTerm) || 
      blog.content.toLowerCase().includes(searchTerm) ||
      blog.summary.toLowerCase().includes(searchTerm) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  } catch (error) {
    console.error(`Error searching blogs with query ${query}:`, error);
    throw error;
  }
};

// Create new blog
export const createBlog = async (blogData) => {
  try {
    // Uncomment this in production
    // const response = await axios.post(`${API_BASE_URL}/blogs`, blogData);
    // return response.data;
    
    // For demo purposes, just log and return the data
    console.log('Creating new blog:', blogData);
    return {
      ...blogData,
      _id: Date.now().toString(), // Generate a mock ID
      date: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

// Update blog
export const updateBlog = async (id, blogData) => {
  try {
    // Uncomment this in production
    // const response = await axios.put(`${API_BASE_URL}/blogs/${id}`, blogData);
    // return response.data;
    
    // For demo purposes, just log and return the data
    console.log(`Updating blog ${id}:`, blogData);
    return {
      ...blogData,
      _id: id
    };
  } catch (error) {
    console.error(`Error updating blog with ID ${id}:`, error);
    throw error;
  }
};

// Delete blog
export const deleteBlog = async (id) => {
  try {
    // Uncomment this in production
    // await axios.delete(`${API_BASE_URL}/blogs/${id}`);
    // return true;
    
    // For demo purposes, just log
    console.log(`Deleting blog ${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting blog with ID ${id}:`, error);
    throw error;
  }
};

// Get all categories
export const getAllCategories = async () => {
  try {
    // Uncomment this in production
    // const response = await axios.get(`${API_BASE_URL}/categories`);
    // return response.data;
    
    // For demo purposes, extract unique categories from mock data
    const categorySet = new Set(mockBlogs.map(blog => blog.category));
    return Array.from(categorySet);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get all tags
export const getAllTags = async () => {
  try {
    // Uncomment this in production
    // const response = await axios.get(`${API_BASE_URL}/tags`);
    // return response.data;
    
    // For demo purposes, extract unique tags from mock data
    const tagSet = new Set(mockBlogs.flatMap(blog => blog.tags || []));
    return Array.from(tagSet);
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

// Get recent blogs
export const getRecentBlogs = async (limit = 5) => {
  try {
    // Uncomment this in production
    // const response = await axios.get(`${API_BASE_URL}/blogs/recent?limit=${limit}`);
    // return response.data;
    
    // For demo purposes, sort by date and slice
    return [...mockBlogs]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent blogs:', error);
    throw error;
  }
};

// Get related blogs
export const getRelatedBlogs = async (blogId, limit = a) => {
  try {
    // Uncomment this in production
    // const response = await axios.get(`${API_BASE_URL}/blogs/${blogId}/related?limit=${limit}`);
    // return response.data;
    
    // For demo purposes, find blogs with same category or tags
    const currentBlog = mockBlogs.find(blog => blog._id === blogId);
    if (!currentBlog) {
      throw new Error('Blog not found');
    }
    
    return mockBlogs
      .filter(blog => 
        blog._id !== blogId && 
        (blog.category === currentBlog.category || 
         blog.tags.some(tag => currentBlog.tags.includes(tag)))
      )
      .slice(0, limit);
  } catch (error) {
    console.error(`Error fetching related blogs for blog ID ${blogId}:`, error);
    throw error;
  }
};