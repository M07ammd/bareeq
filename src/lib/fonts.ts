import { Alexandria, IBM_Plex_Sans_Arabic, Outfit } from "next/font/google";

export const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  variable: "--font-alexandria",
  display: "swap",
});

export const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  variable: "--font-plex",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});
