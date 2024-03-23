import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCategoryList } from "@/api/category";

const CategoryScreen = () => {
  const { category } = useLocalSearchParams();
  const { data: categories } = useCategoryList();
  const cat = categories?.find((c) => c.title.toString() === category);

  if (!cat) {
    return <Text>Category not found</Text>;
  }
  return (
    <View>
      <Stack.Screen options={{ title: cat.title }} />
      <Text>{cat.title}</Text>
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({});
