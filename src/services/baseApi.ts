import axios, { AxiosInstance } from 'axios';
import objectToCamelCase from '../utils/objectToCamelCase';

export type ProcosysApiSettings = {
    baseUrl: string;
    apiVersion: string;
    scope: string[];
};

type baseApiProps = {
    apiSettings: ProcosysApiSettings;
    getAccessToken: (scope: string[]) => Promise<string>;
};

const baseApiService = ({
    apiSettings,
    getAccessToken,
}: baseApiProps): AxiosInstance => {
    const axiosInstance = axios.create();
    axiosInstance.defaults.baseURL = apiSettings.baseUrl;
    axiosInstance.interceptors.request.use(async (request) => {
        try {
            const token = await getAccessToken(apiSettings.scope);
            request.headers['Authorization'] = `Bearer ${token}`;
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
            console.dir(error);
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
