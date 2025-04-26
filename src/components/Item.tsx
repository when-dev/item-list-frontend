import { motion } from 'framer-motion'

interface ItemProps {
  id: number
  selected: boolean
  onSelect: (id: number) => void
  draggable: boolean
  onDragStart: (id: number) => void
  onDragOver: () => void
  onDrop: (id: number) => void
}

const Item = ({ id, selected, onSelect, draggable, onDragStart, onDragOver, onDrop }: ItemProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    whileHover={{ backgroundColor: "#f0f0f0" }}
    className="flex items-center justify-between p-3 border-b border-[#e0e0e0] bg-white rounded-md cursor-pointer"
    draggable={draggable}
    onDragStart={() => onDragStart(id)}
    onDragOver={(e) => {
      e.preventDefault()
      onDragOver()
    }}
    onDrop={() => onDrop(id)}
  >
    <span className="text-[#333] font-medium">Item #{id}</span>
    <input
      type="checkbox"
      checked={selected}
      onChange={() => onSelect(id)}
      className="w-4 h-4 accent-blue-400"
    />
  </motion.div>
)

export default Item
