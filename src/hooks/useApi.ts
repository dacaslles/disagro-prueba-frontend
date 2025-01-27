import { useState, useCallback } from "react";
import api from "../api/apiService";
import { message } from "antd";

const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);


    const request = useCallback(async (method: string, url: string, data?: any, config?:any) => {
        setLoading(true);
        setError(false);

        try {
            const response = await api({method, url, data, ...config});
            return response.data;
        } catch (error:any) {
            const errorMessage = error.response?.data?.message || "Error en la petición"
            setError(errorMessage);
            message.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }

    }, []);

    return { request, loading, error };
}

export default useApi;
