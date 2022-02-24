export default (route: any) => {
  const arr = decodeURI(route.fullPath).split('/').splice(1)
  return `${arr[arr.length - 1]}`
}
