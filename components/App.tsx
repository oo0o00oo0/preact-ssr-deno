import { render } from "preact";
import { Counter } from "./Counter.tsx";
import { Files } from "./Files.tsx";
import Status from "./Status.tsx";

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
      <Status />
      <Files files={files} />
    </>
  );
}

// Render App
if (typeof globalThis.document !== "undefined") {
  const appElement = document.getElementById("app");

  if (appElement) {
    // Clear the container completely first - this is crucial!
    appElement.innerHTML = "";

    // deno-lint-ignore no-explicit-any
    const initialData = (globalThis as any).__INITIAL_DATA__;

    if (initialData) {
      const { counter, files } = initialData;

      render(
        <App counter={counter} files={files} />,
        appElement,
      );
    }
  }
}
