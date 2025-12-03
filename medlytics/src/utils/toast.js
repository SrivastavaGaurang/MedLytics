// src/utils/toast.js
import { toast as toastify } from 'react-toastify';

/**
 * Centralized toast notification utility for better UX
 */
const toast = {
    success: (message, options = {}) => {
        toastify.success(message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            ...options,
        });
    },

    error: (message, options = {}) => {
        toastify.error(message, {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            ...options,
        });
    },

    info: (message, options = {}) => {
        toastify.info(message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            ...options,
        });
    },

    warning: (message, options = {}) => {
        toastify.warning(message, {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            ...options,
        });
    },

    promise: async (promise, messages = {}) => {
        return toastify.promise(
            promise,
            {
                pending: messages.pending || 'Processing...',
                success: messages.success || 'Success!',
                error: messages.error || 'An error occurred',
            },
            {
                position: 'top-right',
            }
        );
    },
};

export default toast;
