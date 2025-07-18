import { renderToString } from "preact-render-to-string";
import { Hono } from "@hono/hono";
import {
  checkInitialFiles,
  getDirectoryContents,
} from "./server/files/utils.ts";
import { open } from "open";
import { Layout } from "./components/Layout.tsx";
import { App } from "./components/App.tsx";
import { join } from "@std/path/join";
import { getCurrentDir } from "./server/internal.ts";

const app = new Hono();

// Server state
let counter = 0;
let status: string[] = [];

// Serve pre-bundled client code
app.get("/client.js", async () => {
  try {
    const bundledCode = await Deno.readTextFile(
      import.meta.dirname + "/client/bundle.js",
    );

    const isDev = !Deno.mainModule.includes("deno-compile");

    const cacheHeaders: Record<string, string> = {
      "Content-Type": "application/javascript",
      "Cache-Control": isDev
        ? "no-cache, no-store, must-revalidate"
        : "public, max-age=3600",
      ...(isDev && {
        "Pragma": "no-cache",
        "Expires": "0",
      }),
    };

    return new Response(bundledCode, { headers: cacheHeaders });
  } catch (error) {
    console.error("Error serving client bundle:", error);
    return new Response(
      "console.error('Client bundle not found. Run: deno task client-build');",
      {
        headers: { "Content-Type": "application/javascript" },
      },
    );
  }
});

app.get("/api/status", (c) => {
  return c.json({ status: status });
});

app.post("/api/writeFile", async (c) => {
  const { filename, content } = await c.req.json();
  const path = join(getCurrentDir(), filename);
  console.log("path", path);
  await Deno.writeTextFile(path, content);
  return c.json({ success: true });
});

// API endpoints for counter
app.get("/api/counter", (c) => {
  console.log("counter", counter);
  return c.json({ counter });
});

app.post("/api/counter/increment", (c) => {
  counter++;
  return c.json({ counter });
});

app.post("/api/counter/decrement", (c) => {
  counter--;
  return c.json({ counter });
});

app.post("/api/counter/reset", (c) => {
  counter = 0;
  return c.json({ counter });
});

app.get("/", async (c) => {
  const { files } = getDirectoryContents();

  const fileStatus = checkInitialFiles(files);

  status = fileStatus;
  const isDev = !Deno.mainModule.includes("deno-compile");
  const timestamp = isDev ? `?t=${Date.now()}` : "";

  // Read styles
  const css = await Deno.readTextFile(
    import.meta.dirname + "/client/styles.css",
  );

  const names = files.map((file) => file.name);
  const initialState = { counter, files: names };

  // Render JSX to HTML
  const appContent = <App counter={counter} files={names} />;
  const html = renderToString(
    <Layout
      css={css}
      script={`
      // Inject initial state for hydration
      window.__INITIAL_DATA__ = ${JSON.stringify(initialState)};
    `}
      bundleUrl={`/client.js${timestamp}`}
    >
      {appContent}
    </Layout>,
  );

  return c.html(`<!DOCTYPE html>${html}`);
});

const port = 8888;
console.log(`Server running on http://localhost:${port}`);

const isDenoRT = Deno.mainModule.includes("deno-compile");

if (isDenoRT) {
  await open(`http://localhost:${port}`);
}

Deno.serve({ port }, app.fetch);
