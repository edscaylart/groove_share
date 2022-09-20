import { NativeEventEmitter, NativeModules } from 'react-native';
const { SpotifyModule } = NativeModules;

interface SpotifyInterface {
  authenticate: () => Promise<string>;
  subscribeToPlayerState: () => void;
  unsubscribeToPlayerState: () => void;
}

export const SpotifyEventListener = () => new NativeEventEmitter(SpotifyModule)

export default SpotifyModule as SpotifyInterface;