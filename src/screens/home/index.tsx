import { DotsThreeOutlineVertical, Gear } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import debounce from "lodash.debounce";

import { Background } from "../../components";
import { SpotifyEventListener, SpotifyPlayerState } from "../../libs";
import { theme } from "../../theme";
import { useSession } from "../../context";
import { saveListenerState } from "../../data/usecases";
import { getNearbyUsers } from "../../data/usecases/get-nearby-users";
import { Listeners } from "../../data/models";

export function Home() {
  const { user } = useSession();
  const [usersNearby, setUsersNearby] = useState<Listeners[]>([])

  const registerPlayerStateChange = debounce((playerState: SpotifyPlayerState) => {
    saveListenerState({
      artist_name: playerState.artist,
      song_name: playerState.song,
      image_uri: playerState.imageUri,
      url: playerState.uri,
      user_id: user?.id,
      location: `POINT(-54.637081 -16.471340)`,
    }).catch(err => console.log('error to save state change', err))
  }, 500)

  useEffect(() => {
    const fetchListeners = async () => {
      try {
        const data = await getNearbyUsers({
          longitude: '-54.637081',
          latitude: '-16.471340',
        }, '1b5e588d-88bc-44ee-925a-7e69d5cbf283')

        setUsersNearby(data)
      } catch (err) {
        console.log('Error trying to get nearby users')
      }
    }

    fetchListeners()
    const playerListener = SpotifyEventListener().addListener('PlayerState', registerPlayerStateChange)

    return () => playerListener.remove()
  }, [])

  function navigateToConfiguration() {
    console.log('navegando para configurações')
  }

  return (
    <Background>
      <View className="pt-16 px-8 flex-row justify-between items-center">
        <Text className="text-white text-xl font-black">{user?.name}</Text>
        <TouchableOpacity onPress={navigateToConfiguration}>
          <Gear size={32} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      <Text className="text-white text-center text-3xl font-black my-10 mx-8">What are people listening near you?</Text>
      <FlatList
        keyExtractor={item => item.id}
        data={usersNearby}
        renderItem={({ item }) => (
          <View className="bg-shape rounded shadow-md mb-4 mx-8 p-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-white text-lg">{item.user_name}</Text>
              <DotsThreeOutlineVertical size={20} color={theme.colors.text} />
            </View>
            <Text className="text-gray-400">Listening to</Text>
            <View className="flex-row mt-2">
              <View className="w-[39] h-[39] bg-gray-300" />
              <View className="ml-4">
                <Text className="text-white text-md">{item.artist_name}</Text>
                <Text className="text-white text-md">{item.song_name}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </Background>
  )
}