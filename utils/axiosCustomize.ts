import axios from 'axios';
import useAuthStore from '@/store/authStore';
import { router } from 'expo-router';

const instance = axios.create({
    baseURL: `https://apilandinvest.gachmen.org`,
   
});

const handleRefreshToken = async () => {
  try {
      const { userId, refreshToken } = useAuthStore.getState();
      if (!userId || !refreshToken) {
          throw new Error('Missing userId or refreshToken');
      }

      const res = await instance.post(`/refresh_token/${userId}`);
      if (res && res.data) {
          const newAccessToken = res.data.access_token;
          
          // Cập nhật chỉ access token mới trong Zustand store
          useAuthStore.getState().setTokens(newAccessToken, refreshToken);
          return newAccessToken;
      }
      return null;
  } catch (error) {
      console.error('Token refresh failed', error);
      return null;
  }
};

instance.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const NO_RETRY_HEADER = 'x-no-retry';

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalConfig = error.config;

        if (error.response && error.response.status === 401 && !originalConfig.headers[NO_RETRY_HEADER]) {
            const newAccessToken = await handleRefreshToken();
            if (newAccessToken) {
                originalConfig.headers[NO_RETRY_HEADER] = 'true';
                originalConfig.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return instance.request(originalConfig);
            }
        }

        if (error.response && error.response.status === 400 && originalConfig.url.includes('/refresh_token/')) {
            useAuthStore.getState().clearAuthState();
            router.navigate('/(modals)/auth/')
        }

        return Promise.reject(error.response ? error.response.data : error);
    }
);

export default instance; 