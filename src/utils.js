const numberRegex = (value) => {
  const regex = new RegExp('^[0-9]?$')
  return regex.test(value)
}

export { numberRegex }
