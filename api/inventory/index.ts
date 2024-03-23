import { InsertTables } from "@/constants/types";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useInventoryList = () => {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase.from("inventory").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInventory = (id: number) => {
  return useQuery({
    queryKey: ["inventory", id],
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

export const useInsertItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(data: InsertTables<"inventory">) {
      const { error, data: newItem } = await supabase
        .from("inventory")
        .insert(data)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newItem;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError(error) {
      console.error("Failed to insert product", error);
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error, data: updatedItem } = await supabase
        .from("inventory")
        .update({
          image: data.image,
          price: data.price,
          size: data.size,
        })
        .eq("id", data.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedItem;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["inventory"] });
      await queryClient.invalidateQueries({ queryKey: ["inventory", id] });
    },
    onError(error) {
      console.error("Failed to insert item", error);
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: any) {
      const { error } = await supabase.from("inventory").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
    },
    async onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError(error) {
      console.error("Failed to delete item", error);
    },
  });
};
