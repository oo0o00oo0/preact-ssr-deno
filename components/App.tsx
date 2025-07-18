import { render } from "preact";
import { useEffect } from "preact/hooks";
import { Counter } from "./Counter.tsx";
import { Files } from "./Files.tsx";
import Status from "./Status.tsx";
import { useStore } from "../store/useStore.ts";

interface AppProps {
  counter: number;
  files: string[];
}

export function App({ counter: initialCounter, files }: AppProps) {
  const { setCounter, setFiles } = useStore();
  console.log("HMR");
  // Initialize store with server data
  useEffect(() => {
    setCounter(initialCounter);
    setFiles(files);
  }, [initialCounter, files, setCounter, setFiles]);

  return (
    <>
      <h1>Hello World Offline with Zustand!</h1>
      <p>This app now uses Zustand for state management</p>
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
