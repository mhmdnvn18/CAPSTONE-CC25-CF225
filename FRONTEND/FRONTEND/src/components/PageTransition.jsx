import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  useEffect(() => {
    // Force scroll to top when component mounts
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    in: {
      opacity: 1,
      y: 0
    },
    out: {
      opacity: 0,
      y: -20
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      onAnimationStart={() => {
        // Ensure scroll is at top when animation starts
        window.scrollTo(0, 0);
      }}
      style={{ minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
