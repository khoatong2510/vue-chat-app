import { 
  getCurrentUser, 
  fetchAuthSession, 
  signUp, 
  confirmSignUp, 
  signIn,
  signOut,
  type SignInInput,
  type SignUpInput,
  type ConfirmSignUpInput,
  type AuthUser,
} from "aws-amplify/auth"

const currentAuthUser = async (): Promise<AuthUser> => {
  const currentUser = await getCurrentUser()
  return currentUser
}

const currentSession = async (): Promise<boolean> => {
  const res = await fetchAuthSession()
  return res.tokens !== undefined
}

const handleSignUp = async ({ username, password }: SignUpInput): Promise<string | undefined> => {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username,
      password
    })

    console.log('isSignInComplete', isSignUpComplete)
    console.log('userId', userId)
    console.log('nextStep', nextStep)

    return userId      
  } catch (error) {
    console.error('error signing up', error)
  }
}

const handleSignUpConfirmation = async ({ username, confirmationCode }: ConfirmSignUpInput) => {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username,
      confirmationCode
    })
  
    console.log('handle confirm isSignUpComplete', isSignUpComplete)
    console.log('handle confirm nextStep', nextStep)
  } catch (error) {
    console.log('error confirming sign up', error)
  }
}

const handleSignIn = async ({ username, password }: SignInInput) => {
  try {
    await signOut()

    const { isSignedIn, nextStep } = await signIn({ 
      username, 
      password,
      options: {
        authFlowType: 'USER_PASSWORD_AUTH'
      } 
    })

    if (!isSignedIn) {
      // TODO handle other login scenarios
      console.log(nextStep)
    }
      
    return isSignedIn

  } catch (error) {
    console.log('error signing in', error)
  }
}

const handleSignOut = async () => {
  try {
    await signOut()
  } catch (error) {
    console.log('error signing out', error)
  }
}

export default {
  currentAuthUser,
  currentSession,
  handleSignUp,
  handleSignUpConfirmation,
  handleSignIn,
  handleSignOut
}
