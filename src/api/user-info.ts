import axios from "axios";

type SpotifyUserData = {
  display_name: string
  email: string
  id: string
}

export async  function requestUserInfo(token: string) {
  try {
    const response = await axios.get<SpotifyUserData>('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  } catch (error: any) {
    throw new Error(`Spotify /me error => ${error.message}`)
  }
}