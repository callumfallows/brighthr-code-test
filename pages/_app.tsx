import "@/styles/globals.css";

import Providers from "@/app/providers";
import Header from "@/components/Header";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Header />
      <Component {...pageProps} />;
    </Providers>
  );
}
