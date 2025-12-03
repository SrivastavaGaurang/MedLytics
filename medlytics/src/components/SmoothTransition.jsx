// src/components/SmoothTransition.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable smooth transition wrapper component
 */
const SmoothTransition = ({
    children,
    duration = 0.3,
    delay = 0,
    type = 'fade', // fade, slide, scale
    direction = 'up' // up, down, left, right (for slide type)
}) => {
    const variants = {
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 }
        },
        slide: {
            initial: {
                opacity: 0,
                x: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
                y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
            },
            animate: {
                opacity: 1,
                x: 0,
                y: 0,
            },
            exit: {
                opacity: 0,
                x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0,
                y: direction === 'up' ? -20 : direction === 'down' ? 20 : 0,
            }
        },
        scale: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 }
        }
    };

    const selectedVariant = variants[type] || variants.fade;

    return (
        <motion.div
            initial={selectedVariant.initial}
            animate={selectedVariant.animate}
            exit={selectedVariant.exit}
            transition={{ duration, delay, ease: 'easeInOut' }}
        >
            {children}
        </motion.div>
    );
};

export default SmoothTransition;
