import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { SpotifyLogo } from 'phosphor-react-native'

type Props = TouchableOpacityProps

export function SignWithSpotifyButton(props: Props) {
  return (
    <TouchableOpacity {...props}>
      <View className={`
          bg-shape
          w-full
          flex-row
          rounded
          items-center
          p-3
        `}>
          <SpotifyLogo size={32} color="#1db954" />
          <Text className="ml-2 text-lg text-text font-black">Login with Spotify</Text>
        </View>
    </TouchableOpacity>
  )
}