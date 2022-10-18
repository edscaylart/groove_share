import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";

import { theme } from "../theme";

type Props = {
  children: ReactNode
}

export function Background({ children }: Props) {
  return (
    <LinearGradient className="flex-1" colors={theme.colors.gradient}>
      {children}
    </LinearGradient>
  )
}