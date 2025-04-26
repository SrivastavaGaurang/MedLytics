// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Doctors from './components/Doctors';
import BlogList from './components/blogs/BlogList'; // ✅ new
import BlogDetail from './components/blogs/BlogDetail'; // ✅ new
import AddBlog from './components/blogs/AddBlog'; // ✅ new
import Blog from './components/blogs/Blog'; // ✅ Updated path for Blog
import CreateBlog from "./components/blogs/CreateBlog";
import EditBlog from "./components/blogs/EditBlog";
import SleepDisorder from './pages/SleepDisorder';
import AnxietyPrediction from './pages/AnxietyPrediction';
import DepressionPrediction from './pages/DepressionPrediction';
import NutritionalPrediction from './pages/NutritionalPrediction';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Contact from './components/contact';
import Login from './components/account/Login';

function App() {
  return (
    
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/blog" element={<Blog />} /> {/* ✅ This renders your blog list */}
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/add-blog" element={<AddBlog />} /> {/* Optional */}
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/edit-blog/:id" element={<EditBlog />} />
        <Route path="/blog-list/:id" element={<BlogList/>} />
        <Route path="/blog/:id" element={<BlogDetail />} />
<Route path="/admin/blog/create" element={<CreateBlog />} />
<Route path="/admin/blog/edit/:id" element={<EditBlog />} />

            


        <Route path="/sleep-disorder" element={<SleepDisorder />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/anxiety-prediction" element={<AnxietyPrediction />} />
        <Route path="/depression-prediction" element={<DepressionPrediction />} />
        <Route path="/nutritional-prediction" element={<NutritionalPrediction />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        {/* Add more routes as needed */}
      </Routes>
      <Footer />
    </Router>
  );
}



export default App;
