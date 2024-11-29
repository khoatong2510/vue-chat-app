import type { ID } from "@/types"
import { toBase64 } from "@/utils"
import authService from '@/services/amplify-auth'

const fetchAvatarImage = async (userId: ID): Promise<string> => {
  const token = await authService.currentIdToken()

  const res = await fetch(`${import.meta.env.VITE_AVATAR_API_ENDPOINT}${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'image/*',
    }
  })

  const blob = await res.blob()
  let url = await toBase64(blob)

  return url
}

const uploadAvatarImage = async (userId: ID, file: File): Promise<{ url: string }> => {
  const token = await authService.currentIdToken()

  const res = await fetch(`${import.meta.env.VITE_AVATAR_API_ENDPOINT}${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `image/${file.name.split('.')[1]}`
    },
    body: file
  })

  return res
}

export default {
  fetchAvatarImage,
  uploadAvatarImage
}