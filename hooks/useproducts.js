import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/product');
      return response.data; 
    },
  });
};
