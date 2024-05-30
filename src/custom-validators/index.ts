import { helpers } from '@vuelidate/validators'

const hasUpperCase = helpers.regex(/[A-Z]+/)

const hasNumber = helpers.regex(/\d+/)

const hasSpecialCharacter = helpers.regex(/[$&+,:;=?@#|'<>.^*()%!-]+/)

export {
  hasUpperCase,
  hasNumber,
  hasSpecialCharacter
}