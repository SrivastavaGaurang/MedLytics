// Animation configuration utilities for framer-motion
export const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeInOut" }
};

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
};

export const slideUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

export const slideDown = {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

export const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: "easeOut" }
};

export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
};

export const hoverLift = {
    whileHover: { y: -5, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 }
};

export const buttonPress = {
    whileTap: { scale: 0.95 }
};

export const cardHover = {
    whileHover: {
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        transition: { duration: 0.3 }
    }
};
