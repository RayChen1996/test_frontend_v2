import axios from 'axios'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig(event)
  const baseUrl = config.BASE_URL
  if (!baseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'BASE_URL is not configured' })
  }
  const { id } = query
  const { data } = await axios.delete(`${baseUrl}/users`, { params: { id } })
  return data
})
