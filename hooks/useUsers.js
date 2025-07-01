import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const token = Cookies.get("token");
      const response = await api.get(`/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
};
