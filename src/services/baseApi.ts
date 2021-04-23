import axios, { AxiosInstance } from 'axios';
import objectToCamelCase from '../utils/objectToCamelCase';

type baseApiProps = {
    accessToken: string;
    baseUrl: string;
};

const baseApiService = ({
    accessToken,
    baseUrl,
}: baseApiProps): AxiosInstance => {
    const axiosInstance = axios.create();
    axiosInstance.defaults.baseURL = baseUrl;
    axiosInstance.interceptors.request.use(async (request) => {
        try {
            request.headers['Authorization'] = `Bearer ${accessToken}`;
            return request;
        } catch (error) {
            throw new Error(error.message);
        }
    });
    axiosInstance.interceptors.response.use(
        (response) => {
            if (
                typeof response.data === 'object' &&
                !(response.data instanceof Blob)
            ) {
                response.data = objectToCamelCase(response.data);
            }
            return response;
        },
        (error) => {
            if (axios.isCancel(error)) {
                throw error;
            }
            if (error.response) {
                throw new Error(error.response.data);
            } else {
                throw new Error(error.message);
            }
        }
    );
    return axiosInstance;
};

export default baseApiService;
