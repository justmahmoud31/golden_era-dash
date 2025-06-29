import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const useSubCategory = (id) => {
  return useQuery({
    queryKey: ['subcategory', id],
    queryFn: async () => {
      const response = await api.get(`/subcategory?category=${id}`);
      return response.data;
    },
    enabled: !!id, 
  });
};
