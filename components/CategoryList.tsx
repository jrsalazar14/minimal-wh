import { Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Tables } from "@/constants/supabase";

type CategoryProps = {
  category: Tables<"category">;
};

const CategoryList = ({ category }: CategoryProps) => {
  let color;
  switch (category.title) {
    case "Baby Boy":
    case "Toddler Boy":
    case "Big Boy":
      color = "#8ddaf0";
      break;
    case "Baby Girl":
    case "Toddler Girl":
    case "Big Girl":
      color = "#f3c7de";
      break;
    default:
      color = "#fae484";
      break;
  }

  return (
    <Link
      href={`/(tabs)/inventory/${category.title}`}
      asChild
      style={styles.container}
    >
      <Pressable style={{ backgroundColor: color }}>
        <Text style={styles.categoryCard}>{category.title}</Text>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  categoryCard: {
    fontSize: 40,
    padding: 10,
    marginVertical: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CategoryList;
