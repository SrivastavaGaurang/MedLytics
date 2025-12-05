// App.jsx with code splitting, lazy loading, and custom authentication
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';

// Import components that should load immediately
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingFallback from './components/LoadingFallback';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './contexts/useAuth';

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
const Login = lazy(() => import('./components/account/Login'));

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingFallback message="Loading application..." />;
  }

  return (
    <ErrorBoundary>
      <Router>
        {isAuthenticated && <Navbar />}
        <Suspense fallback={<LoadingFallback message="Loading page..." />}>
          <Routes>
            {/* Public route - Login */}
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
              }
            />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/about"
              element={
                <PrivateRoute>
                  <AboutUs />
                </PrivateRoute>
              }
            />
            <Route
              path="/services"
              element={
                <PrivateRoute>
                  <Services />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <PrivateRoute>
                  <Doctors />
                </PrivateRoute>
              }
            />
            <Route
              path="/blog"
              element={
                <PrivateRoute>
                  <Blog />
                </PrivateRoute>
              }
            />
            <Route
              path="/blog/:id"
              element={
                <PrivateRoute>
                  <BlogDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/blog/edit/:id"
              element={
                <PrivateRoute>
                  <EditBlog />
                </PrivateRoute>
              }
            />
            <Route
              path="/sleep-disorder"
              element={
                <PrivateRoute>
                  <SleepDisorder />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/not-found"
              element={
                <PrivateRoute>
                  <NotFound />
                </PrivateRoute>
              }
            />
            <Route
              path="/anxiety-prediction"
              element={
                <PrivateRoute>
                  <AnxietyPrediction />
                </PrivateRoute>
              }
            />
            <Route
              path="/anxiety-results/:id"
              element={
                <PrivateRoute>
                  <AnxietyResults />
                </PrivateRoute>
              }
            />
            <Route
              path="/depression-prediction"
              element={
                <PrivateRoute>
                  <DepressionPrediction />
                </PrivateRoute>
              }
            />
            <Route
              path="/depression-results/:id"
              element={
                <PrivateRoute>
                  <DepressionResults />
                </PrivateRoute>
              }
            />
            <Route
              path="/nutritional-prediction"
              element={
                <PrivateRoute>
                  <NutritionalPrediction />
                </PrivateRoute>
              }
            />
            <Route
              path="/bmi-results/:id"
              element={
                <PrivateRoute>
                  <BMIResults />
                </PrivateRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <PrivateRoute>
                  <Contact />
                </PrivateRoute>
              }
            />
            <Route
              path="/sleep-results/:id"
              element={
                <PrivateRoute>
                  <SleepResult />
                </PrivateRoute>
              }
            />

            {/* Catch all - redirect to home or login */}
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
            />
          </Routes>
        </Suspense>
        {isAuthenticated && <Footer />}
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