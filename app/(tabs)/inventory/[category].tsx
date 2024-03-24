import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useCategoryList } from "@/api/category";
import { useInventoryList } from "@/api/inventory";
import { useSizeList } from "@/api/size";

const CategoryScreen = () => {
  const { category } = useLocalSearchParams();
  const { data: categories } = useCategoryList();
  const cat = categories?.find((c) => c.title.toString() === category);
  const { data: inventory } = useInventoryList();
  const { data: sizes } = useSizeList();
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  useEffect(() => {
    if (cat && inventory && sizes) {
      const sizesForCategory = inventory
        .filter((item) => item.category_id === cat.id)
        .sort((a, b) => a.size_id - b.size_id)
        .map((item) => item.size_id);

      const orderedSizes = sizesForCategory.map((sizeId) => {
        const sizeObj = sizes.find((size) => size.id === sizeId);
        return sizeObj ? sizeObj.size : "";
      });

      setAvailableSizes(orderedSizes);
    }
  }, [cat, inventory, sizes]);

  if (!cat) {
    return <Text>Category not found</Text>;
  }

  return (
    <View>
      <Stack.Screen options={{ title: cat.title }} />
      <Text style={styles.sizes}>Tallas disponibles:</Text>
      <View>
        {availableSizes.map((size, index) => (
          <Link href={"/(tabs)/inventory/categories/"} asChild>
            <Pressable>
              <Text key={index} style={styles.textButton}>
                {size}
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  sizes: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textButton: {
    borderRadius: 20,
    backgroundColor: "#fee782",
    marginBottom: 10,
    fontSize: 16,
    textAlign: "center",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
