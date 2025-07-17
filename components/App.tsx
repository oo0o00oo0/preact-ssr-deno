import { hydrate } from "preact";
import { Counter } from "./Counter.tsx";
import { Files } from "./Files.tsx";

interface AppProps {
  counter: number;
  files: string[];
}

export function App({ counter: initialCounter, files }: AppProps) {
  return (
    <>
      <h1>Hello World</h1>
      <p>This is a t0555000</p>
      <Counter initialCounter={initialCounter} />
      <Files files={files} />
    </>
  );
}

// Hydrate App
if (typeof globalThis.document !== "undefined") {
  const appElement = document.getElementById("app");

  if (appElement) {
    // deno-lint-ignore no-explicit-any
    const initialData = (globalThis as any).__INITIAL_DATA__;
    const { counter, files } = initialData;

    hydrate(
      <App counter={counter} files={files} />,
      appElement,
    );
  }
}
