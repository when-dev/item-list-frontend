import axios from 'axios'

export async function fetchItems(search: string, offset: number) {
  const response = await axios.get('http://localhost:5000/api/items', {
    params: { search, offset, limit: 20 },
  })
  return response.data
}

export async function postOrder(orderedIds: number[]) {
  await axios.post('http://localhost:5000/api/items/order', { orderedIds })
}

export async function postSelect(id: number, selected: boolean) {
  await axios.post('http://localhost:5000/api/items/select', { id, selected })
}
