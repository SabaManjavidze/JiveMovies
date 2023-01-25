import type { AppProps } from "next/app";
import { trpc } from "../src/utils/trpcNext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default trpc.withTRPC(MyApp);
