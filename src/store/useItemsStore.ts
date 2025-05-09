import { create } from 'zustand'
import { fetchItems, postOrder, postSelect } from '../utils/fetchItems'

interface Item {
	id: number
	selected: boolean
}

interface StoreState {
	items: Item[]
	total: number
	search: string
	offset: number
	loading: boolean
	fetchItems: (reset?: boolean) => Promise<void>
	toggleSelect: (id: number) => Promise<void>
	reorderItems: (startIndex: number, endIndex: number) => Promise<void>
	setSearch: (search: string) => Promise<void>
}

export const useItemsStore = create<StoreState>((set, get) => ({
	items: [],
	total: 0,
	search: '',
	offset: 0,
	loading: false,

	fetchItems: async (reset = false) => {
		set({ loading: true })
		const { search, offset, items } = get()
		const result = await fetchItems(search, reset ? 0 : offset)

		set({
			items: reset ? result.items : [...items, ...result.items],
			total: result.total,
			offset: reset ? 20 : offset + 20,
			loading: false,
		})
	},

	toggleSelect: async (id: number) => {
		const { items } = get()
		const item = items.find(i => i.id === id)
		if (!item) return

		await postSelect(id, !item.selected)

		set({
			items: items.map(i =>
				i.id === id ? { ...i, selected: !i.selected } : i
			),
		})
	},

	reorderItems: async (startIndex, endIndex) => {
		const { items } = get()
		const updatedItems = Array.from(items)
		const [moved] = updatedItems.splice(startIndex, 1)
		updatedItems.splice(endIndex, 0, moved)

		const orderedIds = [moved.id]

		const insertAfterId =
			endIndex < updatedItems.length - 1
				? updatedItems[endIndex + 1].id
				: updatedItems[updatedItems.length - 1].id

		await postOrder(orderedIds, insertAfterId)
		set({ items: updatedItems })
	},

	setSearch: async (search: string) => {
		set({ search, offset: 0, items: [] })
		await get().fetchItems(true)
	},
}))
