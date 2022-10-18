import { NavigationContainer } from "@react-navigation/native";
import { Router } from "./router";

export function Routes() {
  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  )
}