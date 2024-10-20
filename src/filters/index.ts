const toCapital = (value: string): string => {
  if (value === '')
    return value

  return value.replace(/\w+/g, (match) => { return match[0].toUpperCase() + match.substring(1) })
}

export default {
  toCapital
}