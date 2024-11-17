export const toBase64 = (file: File | Blob): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = () => resolve(reader.result as string)
  reader.onerror = error => reject(error)
})

export const getConversationId = (idA: string, idB: string) => idA < idB ? `${idA}:${idB}` : `${idB}:${idA}`
