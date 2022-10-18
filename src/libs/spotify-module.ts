import { NativeEventEmitter, NativeModules } from 'react-native';
const { SpotifyModule } = NativeModules;

export interface SpotifyPlayerState {
  uri: string;
  song: string;
  artist: string;
  imageUri: string;
  imageUriRaw: string;
}

interface SpotifyInterface {
  authenticate: () => Promise<{
    token: string;
    expiresIn: number;
  }>;
  subscribeToPlayerState: () => void;
  unsubscribeToPlayerState: () => void;
}

export const SpotifyEventListener = () => new NativeEventEmitter(SpotifyModule)

export default SpotifyModule as SpotifyInterface;