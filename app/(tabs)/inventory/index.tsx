import { FlatList } from "react-native";

import { View } from "@/components/Themed";
import { Categories } from "@/constants/Categories";
import CategoryList from "@/components/CategoryList";

export default function TabOneScreen() {
  const data = Categories;

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => <CategoryList title={item.title} />}
        contentContainerStyle={{ gap: 20, padding: 20 }}
      />
    </View>
  );
}
