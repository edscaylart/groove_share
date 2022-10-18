import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSession } from '../context';
import { Home } from '../screens/home';
import { Intro } from '../screens/intro';

const { Navigator, Screen } = createNativeStackNavigator();

export function Router() {
  const { user } = useSession()

  return (
    <Navigator screenOptions={{ headerShown: false }}>
      {!!user?.id ? (
        <Screen name="Home" component={Home} />
      ) : (
        <Screen name="Intro" component={Intro} />
      )}
    </Navigator>
  )
}