import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useSizeList } from "@/api/size";
import { useInventoryList } from "@/api/inventory";
import { Tables } from "@/constants/supabase";
import RemoteImage from "@/components/RemoteImage";

const SizeScreen = () => {
  const { size } = useLocalSearchParams();
  const { data: sizes } = useSizeList();
  const sizeObj = sizes?.find((s) => s.size.toString() === size);
  const { data: inventory } = useInventoryList();
  const [items, setItems] = useState<
    {
      category_id: number;
      created_at: string;
      id: number;
      image: string;
      price: number;
      size_id: number;
    }[]
  >([]);

  useEffect(() => {
    if (sizeObj && inventory) {
      const items = inventory.filter((item) => item.size_id === sizeObj.id);
      setItems(items);
    }
  }, [sizeObj, inventory]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: sizeObj?.size }} />
      <View>
        {items.map((item, index) => (
          <Link
            href={`/(tabs)/inventory/categories/products/${item.id}`}
            asChild
          >
            <Pressable>
              <RemoteImage
                fallback=""
                path={item.image}
                style={styles.image}
                resizeMode="contain"
              />
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  );
};

export default SizeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
