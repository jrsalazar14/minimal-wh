import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Button from "@/components/Button";
import { Picker } from "@react-native-picker/picker";
import {
  useInsertItem,
  useUpdateItem,
  useInventory,
  useDeleteItem,
} from "@/api/inventory";
import { useCategoryList } from "@/api/category";
import { useSizeList } from "@/api/size";
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";

const CreateScreen = () => {
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [size, setSize] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const { data: categories } = useCategoryList();

  const { data: sizes } = useSizeList();

  const { category: idString } = useLocalSearchParams();
  const id = idString;

  const isUpdating = !!id;

  const { mutate: inserItem } = useInsertItem();
  const { mutate: updateItem } = useUpdateItem();
  const { data: updatingItem } = useInventory(Number(id));
  const { mutate: deleteItem } = useDeleteItem();

  const router = useRouter();

  useEffect(() => {
    if (updatingItem) {
      setSize(updatingItem.size_id.toString());
      setCategory(updatingItem.category_id.toString());
      setPrice(updatingItem.price.toString());
      setImage(updatingItem.image);
    }
  }, [updateItem]);

  const resetField = () => {
    setSize("Newborn");
    setPrice("");
    setImage("");
  };

  const validateInput = () => {
    setError("");
    if (!size) {
      setError("Selecciona una talla.");
      return false;
    }
    if (!price) {
      setError("Introduce un precio.");
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setError("Precio no válido.");
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  };

  const onUpdate = async () => {
    if (!validateInput()) {
      return;
    }
    const imagePath = await uploadImage();

    updateItem(
      { id, size, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetField();
          router.back();
        },
      }
    );
  };

  const onCreate = async () => {
    if (!validateInput()) {
      return;
    }
    const selectedSizeId = parseInt(size);
    const selectedCategoryId = parseInt(category);
    const imagePath = await uploadImage();

    inserItem(
      {
        size_id: selectedSizeId,
        category_id: selectedCategoryId,
        price: parseFloat(price),
        image: imagePath ?? "",
      },
      {
        onSuccess: () => {
          resetField();
        },
      }
    );
  };

  const onDelete = () => {
    deleteItem(id, {
      onSuccess: () => {
        resetField();
        router.navigate("/(tabs)");
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert("Eliminando producto", "Estas seguro", [
      {
        text: "Cancelar",
      },
      {
        text: "Eliminar",
        onPress: onDelete,
        style: "destructive",
      },
    ]);
  };

  const uploadImage = async () => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";

    const { data, error } = await supabase.storage
      .from("items-images")
      .upload(filePath, decode(base64), { contentType });

    console.log(error);

    if (data) {
      return data.path;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Agregar Producto" }} />

      <Image
        source={{ uri: image || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <Text onPress={pickImage} style={styles.textButton}>
        Selecciona una imagen
      </Text>

      <Text style={styles.label}>Precio ($)</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="$200"
        style={styles.input}
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Categoria</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
        style={styles.picker}
        numberOfLines={1}
      >
        {categories?.map((category) => (
          <Picker.Item
            key={category.id}
            label={category.title}
            value={category.id}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Talla</Text>
      <Picker
        selectedValue={size}
        onValueChange={(itemValue, itemIndex) => setSize(itemValue)}
        style={styles.picker}
        numberOfLines={1}
      >
        {sizes?.map((size) => (
          <Picker.Item key={size.id} label={size.size} value={size.id} />
        ))}
      </Picker>

      <Text style={{ color: "red" }}>{error}</Text>
      <Button onPress={onSubmit} text={isUpdating ? "Actualizar" : "Agregar"} />
      {isUpdating && (
        <Text onPress={confirmDelete} style={styles.textButton}>
          Delete
        </Text>
      )}
    </ScrollView>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
  picker: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  label: {
    color: "gray",
    fontSize: 16,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: "blue",
    marginVertical: 20,
  },
});
