export default (route: any) => {
  const arr = decodeURI(route.fullPath)
    .replace(
      /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/,
      ''
    )
    .replace('/form', '')
    .replace('/create-from-copy', '')
    .split('/')
    .filter((str) => !!str)
  return `${arr[arr.length - 1]}`
}
