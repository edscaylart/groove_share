import axios from "axios";
import { createContext, ReactNode, useCallback, useState, useEffect, useContext } from 'react';
import { requestUserInfo } from "../api";
import { User } from "../data/models";
import { createUser } from "../data/usecases";
import { Spotify } from "../libs";
import { getStorageUser } from "../storage";

type SessionProviderProps = {
  children: ReactNode
}

export const SessionContext = createContext<{
  user: User | null;
  signIn: () => Promise<void>;
}>({
  user: null,
  signIn: async () => {}
})

export function SessionProvider({ children }: SessionProviderProps) {
  const [user, setUser] = useState<User>({} as User)

  const signIn = useCallback(async () => {
    try {
      const { token } = await Spotify.authenticate();

      const spotifyUser = await requestUserInfo(token)

      const createdUser = await createUser({
        name: spotifyUser.display_name,
        spotify_user_id: spotifyUser.id
      })

      setUser(createdUser)
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storageUser = await getStorageUser<User>()
        if (storageUser) {
          setUser(storageUser)
        }
      } catch (err) {}
    }

    bootstrapAsync();
  })

  return (
    <SessionContext.Provider value={{ user, signIn }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)