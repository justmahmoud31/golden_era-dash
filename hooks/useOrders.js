import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const token = Cookies.get('token');
      const response = await api.get('/order', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
};
