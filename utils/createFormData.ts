import type { IPayload } from '~/types/payloadParams'

export default ({
  typeOfObject,
  nameOfObject,
  ЭтоГруппа,
  formObj,
  params,
  action,
  guid,
}: IPayload) => {
  const formData = { ЭтоГруппа }
  formObj?.keys?.forEach(({ key, value }) => {
    formData[key] = value
  })
  const payload = {
    typeOfObject,
    nameOfObject,
    formData,
    params,
    action,
    guid,
  }
  return payload
}
