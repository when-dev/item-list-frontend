import { useEffect, useRef, useState } from 'react'
import { useItemsStore } from '../store/useItemsStore'
import Item from './Item'
import Loader from './Loader'
import { AnimatePresence } from 'framer-motion'
import { resetOrder } from '../utils/fetchItems'

const ItemList = () => {
	const {
		items,
		fetchItems,
		loading,
		toggleSelect,
		reorderItems,
		setSearch,
		total,
	} = useItemsStore()

	const listRef = useRef<HTMLDivElement>(null)
	const [draggedItemId, setDraggedItemId] = useState<number | null>(null)

	const [searchInput, setSearchInput] = useState('')
	const typingTimeout = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		if (!searchInput) {
			setSearch('').then(() => fetchItems(true))
		} else {
			fetchItems(true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (typingTimeout.current) clearTimeout(typingTimeout.current)

		typingTimeout.current = setTimeout(() => {
			setSearch(searchInput)
		}, 500)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchInput])

	const handleScroll = () => {
		const el = listRef.current
		if (
			el &&
			el.scrollTop + el.clientHeight >= el.scrollHeight - 10 &&
			!loading &&
			items.length < total
		) {
			fetchItems()
		}
	}

	const handleDragStart = (id: number) => {
		setDraggedItemId(id)
	}

	const handleDragOver = () => {}

	const handleDrop = async (targetId: number) => {
		if (draggedItemId === null || draggedItemId === targetId) return

		const draggedIndex = items.findIndex(i => i.id === draggedItemId)
		const targetIndex = items.findIndex(i => i.id === targetId)

		await reorderItems(draggedIndex, targetIndex)
		setDraggedItemId(null)
	}

	const handleClearSearch = () => {
		setSearchInput('')
		setSearch('').then(() => fetchItems(true))
	}

	const handleResetOrder = async () => {
		await resetOrder()
		await fetchItems(true)
	}

	return (
		<div className='flex flex-col max-w-xl mx-auto mt-8'>
			<div className='flex mb-4 gap-2'>
				<div className='relative flex-grow'>
					<input
						value={searchInput}
						onChange={e => setSearchInput(e.target.value)}
						placeholder='Search items...'
						className='p-2 border rounded w-full pr-10 transition-all focus:ring-2 focus:ring-blue-400'
					/>
					{searchInput && (
						<button
							onClick={handleClearSearch}
							className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black'
						>
							✖️
						</button>
					)}
				</div>

				<button
					onClick={handleResetOrder}
					className='px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all whitespace-nowrap'
				>
					Reset order
				</button>
			</div>

			<div
				ref={listRef}
				className='h-[600px] overflow-auto border rounded p-2 bg-gray-100'
				onScroll={handleScroll}
			>
				<AnimatePresence>
					{items.map(item => (
						<Item
							key={item.id}
							id={item.id}
							selected={item.selected}
							onSelect={toggleSelect}
							draggable={true}
							onDragStart={handleDragStart}
							onDragOver={handleDragOver}
							onDrop={handleDrop}
						/>
					))}
				</AnimatePresence>

				{loading && <Loader />}
			</div>
		</div>
	)
}

export default ItemList
