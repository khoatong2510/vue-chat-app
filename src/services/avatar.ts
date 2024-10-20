import type { ID } from "@/types"
import { toBase64 } from "@/utils"

const fetchAvatarImage = async (userId: ID, token?: string): Promise<string> => {
  const res = await fetch(`https://2v2dwfsmk4.execute-api.ap-southeast-2.amazonaws.com/dev/avatar/${userId}`, {
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

export default {
  fetchAvatarImage
}