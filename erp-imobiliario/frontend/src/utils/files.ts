export async function fileToBlobURL(file: File): Promise<{ blobUrl: string, mime: string, sizeBytes: number }> {
  const blobUrl = URL.createObjectURL(file)
  return { blobUrl, mime: file.type, sizeBytes: file.size }
}