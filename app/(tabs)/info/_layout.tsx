import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Stack } from "expo-router";
import { Pressable } from "react-native";

export default function MenuStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Info" }} />
    </Stack>
  );
}
