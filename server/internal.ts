const isDenoRT = Deno.mainModule.includes("deno-compile");

export function getCurrentDir(): string {
  return isDenoRT ? Deno.cwd() : "C:\\Users\\dsgnr\\Documents\\tests";
}
