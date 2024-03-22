import { Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Link } from "expo-router";

type CategoryProps = { title: string };

const CategoryList = ({ title }: CategoryProps) => {
  let color;
  switch (title) {
    case "Niño":
    case "Bebe niño":
      color = "#8ddaf0";
      break;
    case "Niña":
    case "Bebe niña":
      color = "#f3c7de";
      break;
    default:
      color = "#fae484";
      break;
  }

  return (
    <Link href="/(tabs)/inventory/sizes/" asChild style={styles.container}>
      <Pressable style={{ backgroundColor: color }}>
        <Text style={styles.category}>{title}</Text>
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
  category: {
    fontSize: 40,
    padding: 10,
    marginVertical: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CategoryList;
