import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PredictionPage from './pages/PredictionPage';
import ResultPage from './pages/ResultPage';
import DataViewer from './components/DataViewer';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import PageTransition from './components/PageTransition';

// Component to handle scroll restoration
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Disable automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Scroll to top immediately when location changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

    // Additional fallback
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
  }, [location.pathname]);

  return null;
};

// Wrap routes with AnimatePresence for transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route 
            path="/" 
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            } 
          />
          <Route 
            path="/prediction" 
            element={
              <PageTransition>
                <PredictionPage />
              </PageTransition>
            } 
          />
          <Route 
            path="/result" 
            element={
              <PageTransition>
                <ResultPage />
              </PageTransition>
            } 
          />
          <Route 
            path="/data" 
            element={
              <PageTransition>
                <DataViewer />
              </PageTransition>
            } 
          />
          <Route 
            path="/about" 
            element={
              <PageTransition>
                <AboutPage />
              </PageTransition>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <PageTransition>
                <ContactPage />
              </PageTransition>
            } 
          />
        </Routes>
      </AnimatePresence>
    </>
  );
};

function App() {
  // Disable scroll restoration globally
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
