import { NativeModules } from 'react-native';
const { SpotifyModule } = NativeModules;

interface SpotifyInterface {
  authenticate: () => Promise<string>;
  createSpotifyEvent: (name: string, location: string) => void;
}

export default SpotifyModule as SpotifyInterface;