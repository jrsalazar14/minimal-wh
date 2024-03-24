import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useSizeList = () => {
  return useQuery({
    queryKey: ["sizes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sizes")
        .select("*")
        .order("id");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useSize = (id: number) => {
  return useQuery({
    queryKey: ["size", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("size")
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
