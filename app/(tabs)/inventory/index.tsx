import { ActivityIndicator, FlatList } from "react-native";

import { View, Text } from "@/components/Themed";
import CategoryList from "@/components/CategoryList";
import { useCategoryList } from "@/api/category";

export default function MenuScreen() {
  const { data: categories, isLoading, error } = useCategoryList();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={categories}
        renderItem={({ item }) => <CategoryList category={item} />}
        contentContainerStyle={{ gap: 20, padding: 20 }}
      />
    </View>
  );
}
