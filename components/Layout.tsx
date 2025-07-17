interface LayoutProps {
  css: string;
  script: string;
  children: any;
}

export function Layout({ css, script, children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>✨</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <script
          type="importmap"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              imports: {
                "preact": "https://esm.sh/preact@10.26.6",
                "preact/hooks": "https://esm.sh/preact@10.26.6/hooks",
                "preact/jsx-runtime":
                  "https://esm.sh/preact@10.26.6/jsx-runtime",
              },
            }),
          }}
        />
      </head>
      <body>
        <div id="app">{children}</div>
        <script type="module" dangerouslySetInnerHTML={{ __html: script }} />
      </body>
    </html>
  );
}
