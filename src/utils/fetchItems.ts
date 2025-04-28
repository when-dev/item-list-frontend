import axios from 'axios'

// Базовый URL для запросов
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

export async function fetchItems(search: string, offset: number) {
  const response = await axios.get(`${BASE_URL}/items`, {
    params: { search, offset, limit: 20 },
    withCredentials: true, 
  })
  return response.data
}

export async function postOrder(orderedIds: number[]) {
  await axios.post(`${BASE_URL}/items/order`, { orderedIds }, { withCredentials: true })
}

export async function postSelect(id: number, selected: boolean) {
  await axios.post(`${BASE_URL}/items/select`, { id, selected }, { withCredentials: true })
}

export async function resetOrder() {
  await axios.post(`${BASE_URL}/items/reset-order`, {}, { withCredentials: true })
}
