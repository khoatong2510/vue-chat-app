import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './index.css'

import App from './App.vue'
import router from './router'

import { Amplify } from 'aws-amplify'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID
    }
  },
  API: {
    GraphQL: {
      endpoint: import.meta.env.VITE_GRAPHQL_API_ENDPOINT,
      region: import.meta.env.AWS_REGION,
      defaultAuthMode: 'apiKey',
      apiKey: import.meta.env.VITE_GRAPHQL_API_KEY,
    }
  }
})

const app = createApp(App)
const store = createPinia()

app.use(store)

app.use(router)

app.mount('#app')
