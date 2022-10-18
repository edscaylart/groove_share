import AsyncStorage from "@react-native-async-storage/async-storage"

const USER_KEY = '@groove_user'

export async function storeUserData(data: string) {
  try {
    await AsyncStorage.setItem(USER_KEY, data);
  } catch (err) {
    console.log('Could not store user data')
  }
}

export async function getStorageUser<T extends Object>() {
  try {
    const jsonUser = await AsyncStorage.getItem(USER_KEY);
    return jsonUser ? JSON.parse(jsonUser) as T : null;
  } catch (err) {
    console.log('Could not get user data')
  }
}