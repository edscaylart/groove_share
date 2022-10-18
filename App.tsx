import { StatusBar } from 'expo-status-bar';
import { Background } from './src/components';
import { SessionProvider } from './src/context/session';
import { Routes } from './src/routes';

export default function App() {
  return (
    <Background>
      <StatusBar translucent style="light" backgroundColor="transparent" />
      <SessionProvider>
        <Routes />
      </SessionProvider>
    </Background>
  );
}