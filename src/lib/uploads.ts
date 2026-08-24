import "server-only";

export async function arquivoParaDataUri(arquivo: File): Promise<string> {
  const buffer = Buffer.from(await arquivo.arrayBuffer());
  return `data:${arquivo.type};base64,${buffer.toString("base64")}`;
}
