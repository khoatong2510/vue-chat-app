import { generateClient } from "aws-amplify/api"

const token = localStorage.getItem("idToken")

if (!token)
  throw Error("No Credentials")

export const client = generateClient({
  headers: {
    "X-Api-Key": import.meta.env.VITE_GRAPHQL_API_KEY,
    Authorization: `${token}`
  }
})

console.log(client)
