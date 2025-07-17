/** @jsx h */
/** @jsxFrag Fragment */
import { renderToString } from "preact-render-to-string";
import { Hono } from "@hono/hono";
import { getDirectoryContents } from "./server/files/utils.ts";
import { open } from "https://deno.land/x/open/index.ts";
import { Layout } from "./components/Layout.tsx";
import { App } from "./components/App.tsx";

const app = new Hono();

// Server state
let counter = 0;

// Serve pre-bundled client code
app.get("/client.js", async (c) => {
  try {
    const bundledCode = await Deno.readTextFile(
      import.meta.dirname + "/client/bundle.js",
    );

    const isDev = Deno.env.get("DENO_ENV") === "development";
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
      
      // Load the bundled client code
      import('./client.js');
    `}
    >
      {appContent}
    </Layout>,
  );

  console.log(files);

  return c.html(`<!DOCTYPE html>${html}`);
});

const port = 8888;
console.log(`Server running on http://localhost:${port}`);

const isDenoRT = Deno.mainModule.includes("deno-compile");

if (isDenoRT) {
  await open(`http://localhost:${port}`);
}

Deno.serve({ port }, app.fetch);
