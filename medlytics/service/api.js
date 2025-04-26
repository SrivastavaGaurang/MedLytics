import axios from 'axios';
import { API_NOTIFICATION_MESSAGES, SERVICE_URL, SERVER_URL } from '../src/constants/config'; // Correct import

const API_URL = SERVER_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response) {
        return processResponse(response);
    },
    function (error) {
        return Promise.reject(processError(error));
    }
);

const processResponse = (response) => {
    if (response.status === 200) {
        return { isSucess: true, data: response.data };
    } else {
        return {
            isFailure: true,
            status: response.status,
            msg: response?.msg,
            code: response?.code,
        };
    }
};

const processError = (error) => {
    if (error.response) {
        console.log('ERROR IN RESPONSE:', error.toJSON());
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.responseFailure,
            code: error.response.status,
        };
    } else if (error.request) {
        console.log('ERROR IN REQUEST:', error.toJSON());
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.requestFailure,
            code: '',
        };
    } else {
        console.log('ERROR IN NETWORK:', error.toJSON());
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.networkError,
            code: '',
        };
    }
};

const API = {};

// Use SERVICE_URL instead of SERVICE_URLS
for (const [key, value] of Object.entries(SERVICE_URL)) {
    API[key] = function (body, showUploadProgress, showDownloadProgress) {
        return axiosInstance({
            method: value.method,
            url: value.url,
            responseType: value.responseType,
            onUploadProgress: function (progressEvent) {
                if (showUploadProgress) {
                    let percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    showUploadProgress(percentCompleted);
                }
            },
            onDownloadProgress: function (progressEvent) {
                if (showDownloadProgress) {
                    let percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    showDownloadProgress(percentCompleted);
                }
            },
        });
    };
}

export { API };