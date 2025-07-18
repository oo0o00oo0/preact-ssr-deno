interface LayoutProps {
  css: string;
  script: string;
  bundleUrl: string;
  children: any;
}

export function Layout({ css, script, bundleUrl, children }: LayoutProps) {
  console.log("Layout");
  console.log(css);
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>✨</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <div id="app">{children}</div>
        <script dangerouslySetInnerHTML={{ __html: script }} />
        <script type="module" src={bundleUrl}></script>
      </body>
    </html>
  );
}
