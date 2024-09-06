<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import UserService from '@/services/user'
import { ref } from 'vue'
import authService from '@/services/amplify-auth'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import { FaceSmileIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const router = useRouter()

const uploadFile = ref<File|null>(null)
const userName = ref<string>('')
const showEmojiPicker = ref<boolean>(false)

const signOut = async () => {
  try {
    await authStore.signOut()

    router.push({ name :'login' })
  } catch (error) {
    console.error(error)
  }
}


const onListUsers = async () => {
  await UserService.listUsers()
}

const onCreateUser = async () => {
  // console.log("userName", userName)
  // console.log("avatarUrl", avatarUrl)

  if (!uploadFile.value)
    return
  
  const userId = authStore.user?.userId

  if (!userId)
    return

  const idToken = await authService.currentIdToken()
  // upload file to s3
  const res = await fetch(`https://2v2dwfsmk4.execute-api.ap-southeast-2.amazonaws.com/dev/avatar/${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": uploadFile.value.type
    },
    body: uploadFile.value
  })

  console.log(res)

  await UserService.createUser({
    id: userId,
    name: userName.value,
    avatarUrl: res.url
  })
}

const onChange = (file: File) => {
  console.log("File", uploadFile.value)
}

const onSelectEmoji = (emoji: object) => {
  console.log(emoji)
}

</script>

<template>
  <div class="w-screen h-screen bg-blue-200">
    <div class="h-full flex items-center justify-center gap-4 p-4">
      <div class="w-1/3 lg:w-1/4 h-full p-4 rounded-xl border border-solid border-blue-300 bg-blue-50 shadow-lg">
        <div class="text-lg font-semibold">
          Conversations
        </div>
      </div>

      <div class="w-2/3 lg:w-3/4 h-full rounded-xl border border-solid border-blue-300 shadow-lg bg-blue-50 flex flex-col">
        <div class="flex p-4 justify-start items-start gap-2 cursor-pointer border-b border-solid shadow-sm">
          <img 
            src="@/assets/images/785-200x200.jpg" 
            class="w-10 h-10 rounded-full border-2 border-solid border-green-600"
          >

          <div class="flex flex-col items-start justify-start">
            <div class="font-semibold">John Doe</div>
            <div class="text-xs">Active 2m ago</div>
          </div>
        </div>

        <div class="flex-1 flex flex-col p-4 gap-4">
          <div class="flex gap-2 items-end"> 
            <img 
              src="@/assets/images/785-200x200.jpg"
              class="w-9 h-9 rounded-full"
            />

            <div class="flex flex-col items-start gap-1 w-3/4">
              <div class="w-fit bg-orange-100 p-2 leading-tight text-sm rounded-xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              </div>

              <div class="w-fit bg-orange-100 p-2 leading-tight text-sm rounded-xl">
                Sed ut perspiciatis 
              </div>
            </div>
          </div>

          <div class="self-end flex flex-col items-end gap-1 w-3/4">
            <div class="text-sm p-2 bg-slate-200 rounded-xl leading-tight">
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
            </div>
            <div class="text-sm p-2 bg-slate-200 rounded-xl leading-tight">
              Neque porro quisquam est
            </div>
          </div>
        </div>

        <div class="flex-none flex items-center gap-2 p-4">
          <textarea
            :rows="5"
            class="h-9 w-full p-2 border border-solid border-orange-400 rounded-xl outline-none text-xs" 
          />

          <div>
            <EmojiPicker 
              v-if="showEmojiPicker"
              :native="true" 
              class="absolute right-8 bottom-20"
              @select="onSelectEmoji"
            />

            <FaceSmileIcon 
              class="w-7 h-7 text-orange-800 hover:text-orange-600 duration-100 cursor-pointer"
              @click="showEmojiPicker = !showEmojiPicker"
            />
          </div>


        </div>
      </div>
    </div>
  </div>
</template>
