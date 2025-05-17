// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Doctors from './components/Doctors';
import BlogDetail from './components/blogs/BlogDetail';
import Blog from './components/blogs/MedBlog';
import CreateBlog from "./components/blogs/BlogDashboard";
import EditBlog from "./components/blogs/EditBlog";
import SleepDisorder from './pages/SleepDisorder';
import AnxietyPrediction from './pages/AnxietyPrediction';
import DepressionPrediction from './pages/DepressionPrediction';
import NutritionalPrediction from './pages/BMIPrediction';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Contact from './components/contact';
import SleepResult from './pages/SleepResults';
import SleepHistory from './pages/SleepHistory';
// import Login from './components/account/Login';

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
       
        {/* <Route path="/create-blog" element={<CreateBlog />} /> */}
        <Route path="/edit-blog/:id" element={<EditBlog />} />
        {/* Removing the BlogList route since the component doesn't exist */}
        <Route path="/admin/blog/create" element={<CreateBlog />} />
        <Route path="/admin/blog/edit/:id" element={<EditBlog />} />
            
        <Route path="/sleep-disorder" element={<SleepDisorder />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/anxiety-prediction" element={<AnxietyPrediction />} />
        <Route path="/depression-prediction" element={<DepressionPrediction />} />
        <Route path="/nutritional-prediction" element={<NutritionalPrediction />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sleep-results/:id" element={<SleepResult />} />
        <Route path="/sleep-history" element={<SleepHistory />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* Add more routes as needed */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
