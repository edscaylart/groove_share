import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spotify, SpotifyEventListener } from './src/libs';

export default function App() {

  async function authenticate() {
    try {
      const token = await Spotify.authenticate();

      console.log('Recebido o token no JS', token)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const playerListener = SpotifyEventListener().addListener('PlayerState', (event) => {
      console.log(event)
    })

    return () => playerListener.remove()
  }, [])

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Pressable onPress={authenticate}>
        <Text>Authenticate</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
