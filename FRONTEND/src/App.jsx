import React from 'react';
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

// Wrap routes with AnimatePresence for transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
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
  );
};

function App() {
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
