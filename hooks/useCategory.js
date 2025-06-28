import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const useCategory = () => {
  return useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      const response = await api.get('/category');
      return response.data; 
    },
  });
};
