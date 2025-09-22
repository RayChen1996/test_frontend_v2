import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig(event)
  const baseUrl = config.BASE_URL
  if (!baseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'BASE_URL is not configured' })
  }
  const { data } = await axios.post(`${baseUrl}/users`, body)
  return data
})
