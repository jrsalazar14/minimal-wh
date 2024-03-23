import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useCategoryList = () => {
  return useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category")
        .select("*")
        .order("id");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
