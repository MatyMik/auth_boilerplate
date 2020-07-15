export const encodeJsonToBase64 = (json: any) => {
  return new Buffer(JSON.stringify(json)).toString('base64')
}

export const decodeBase64ToJson = (base64: string) => {
  return JSON.parse(new Buffer(base64, 'base64').toString('utf-8'))
}