// App.jsx with code splitting, lazy loading, and UX enhancements
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';

// Import components that should load immediately
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingFallback from './components/LoadingFallback';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load route components for code splitting
const Home = lazy(() => import('./components/Home'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const Services = lazy(() => import('./components/Services'));
const Doctors = lazy(() => import('./components/Doctors'));
const BlogDetail = lazy(() => import('./components/blogs/BlogDetail'));
const Blog = lazy(() => import('./components/blogs/MedBlog'));
const CreateBlog = lazy(() => import('./components/blogs/BlogDashboard'));
const EditBlog = lazy(() => import('./components/blogs/EditBlog'));
const SleepDisorder = lazy(() => import('./pages/SleepDisorder'));
const AnxietyPrediction = lazy(() => import('./pages/AnxietyPrediction'));
const AnxietyResults = lazy(() => import('./pages/AnxietyResults'));
const DepressionPrediction = lazy(() => import('./pages/DepressionPredictionEnhanced'));
const DepressionResults = lazy(() => import('./pages/DepressionResult'));
const NutritionalPrediction = lazy(() => import('./pages/ImprovedBMIPrediction'));
const BMIResults = lazy(() => import('./pages/BMIResults'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Contact = lazy(() => import('./components/ImprovedContact'));
const SleepResult = lazy(() => import('./pages/SleepResults'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Navbar />
        <Suspense fallback={<LoadingFallback message="Loading page..." />}>
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
            <Route path="/bmi-results/:id" element={<BMIResults />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sleep-results/:id" element={<SleepResult />} />
          </Routes>
        </Suspense>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </ErrorBoundary>
  );
}

export default App;