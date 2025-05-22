// App.jsx with updated BMI Routes
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Doctors from './components/Doctors';
import BlogDetail from './components/blogs/BlogDetail';
import Blog from './components/blogs/MedBlog';
import CreateBlog from './components/blogs/BlogDashboard';
import EditBlog from './components/blogs/EditBlog';
import SleepDisorder from './pages/SleepDisorder';
import AnxietyPrediction from './pages/AnxietyPrediction';
import AnxietyResults from './pages/AnxietyResults';
import DepressionPrediction from './pages/DepressionPredictionEnhanced';
import DepressionResults from './pages/DepressionResult';
import NutritionalPrediction from './pages/ImprovedBMIPrediction';
import BMIResults from './pages/BMIResults';  // Import the BMI results component
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Contact from './components/ImprovedContact';

import SleepResult from './pages/SleepResults';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/admin/blog/edit/:id" element={<EditBlog />} />
        <Route path="/sleep-disorder" element={<SleepDisorder />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/anxiety-prediction" element={<AnxietyPrediction />} />
        <Route path="/anxiety-results/:id" element={<AnxietyResults />} />
        <Route path="/depression-prediction" element={<DepressionPrediction />} />
        <Route path="/depression-results/:id" element={<DepressionResults />} />
        <Route path="/nutritional-prediction" element={<NutritionalPrediction />} />
        <Route path="/bmi-results/:id" element={<BMIResults />} />  {/* Added this route */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/sleep-results/:id" element={<SleepResult />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;