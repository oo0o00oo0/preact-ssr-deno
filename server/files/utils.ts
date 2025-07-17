export function getDirectoryContents() {
  const files = [...Deno.readDirSync(Deno.cwd())].map((entry) => entry);
  console.log("files", files);
  const names = files.map((file) => file.name);
  return { names, files };
}
