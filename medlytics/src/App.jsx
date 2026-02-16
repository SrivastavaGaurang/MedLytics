// App.jsx with code splitting, lazy loading, and MongoDB Auth
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';

// Import components that should load immediately
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingFallback from './components/LoadingFallback';
import ErrorBoundary from './components/ErrorBoundary';
import Chatbot from './components/Chatbot';

// Lazy load route components for code splitting
const Home = lazy(() => import('./components/Home'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const Services = lazy(() => import('./components/Services'));
const Doctors = lazy(() => import('./components/Doctors'));
const BlogDetail = lazy(() => import('./components/blogs/BlogDetail'));
const Blog = lazy(() => import('./components/blogs/MedBlogPage'));
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
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Navbar />
          <Suspense fallback={<LoadingFallback message="Loading page..." />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/contact" element={<Contact />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Tools - Now Public/Optional Auth */}
              <Route path="/sleep-disorder" element={<SleepDisorder />} />
              <Route path="/sleep-results/:id" element={<SleepResult />} />
              <Route path="/anxiety-prediction" element={<AnxietyPrediction />} />
              <Route path="/anxiety-results/:id" element={<AnxietyResults />} />
              <Route path="/depression-prediction" element={<DepressionPrediction />} />
              <Route path="/depression-results/:id" element={<DepressionResults />} />
              <Route path="/nutritional-prediction" element={<NutritionalPrediction />} />
              <Route path="/bmi-results/:id" element={<BMIResults />} />

              {/* Protected / Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin/blog/edit/:id" element={<EditBlog />} />
              <Route path="/admin/blog/create" element={<CreateBlog />} />

              <Route path="/not-found" element={<NotFound />} />
              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <Footer />
          <Chatbot />
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
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
