import { Image, View } from "react-native";

import logoImg from '../../assets/logo.png'
import { Background, SignWithSpotifyButton } from "../../components";
import { useSession } from "../../context";

export function Intro() {
  const { signIn } = useSession()

  return (
    <Background>
      <View className="flex-1 justify-center items-center p-8">
        <Image source={logoImg} className="mb-[100]" />
        <SignWithSpotifyButton onPress={signIn} />
      </View>
    </Background>
  )
}