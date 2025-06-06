import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Block, Breakpoint } from '../../lib/types/editor';
import { GripVertical, Copy, Trash2 } from 'lucide-react';

interface DraggableBlockProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  onChildUpdate?: (child: Block) => void;
  children: React.ReactNode;
  isEditing?: boolean;
  breakpoint?: Breakpoint;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({ 
  block, 
  onUpdate,
  onChildUpdate,
  children,
  isEditing = true,
  breakpoint = 'desktop'
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px rgba(96, 165, 250, 0.3)",
    background: "rgba(0, 0, 0, 0.5)",
    borderRadius: "0.5rem",
    padding: "1rem",
    ...block.style,
    ...(block.style?.[breakpoint] || {})
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleClickOutside = () => {
    setShowContextMenu(false);
  };

  const handleDuplicate = () => {
    if (!onChildUpdate) return;
    
    const newBlock: Block = {
      ...block,
      id: crypto.randomUUID(),
      metadata: {
        ...block.metadata,
        instance: block.metadata.instance + 1,
        createdAt: new Date().toISOString()
      }
    };
    onChildUpdate(newBlock);
    setShowContextMenu(false);
  };

  const handleDelete = () => {
    onUpdate({ parentId: undefined });
    setShowContextMenu(false);
  };

  return (
    <>
      <Rnd
        style={style}
        default={{
          x: 0,
          y: 0,
          width: block.style?.width || '100%',
          height: block.style?.height || 'auto'
        }}
        onDragStop={(_e, d) => {
          onUpdate({
            style: {
              ...block.style,
              transform: `translate(${d.x}px, ${d.y}px)`
            }
          });
        }}
        onResizeStop={(_e, _direction, ref, _delta, position) => {
          onUpdate({
            style: {
              ...block.style,
              width: ref.style.width,
              height: ref.style.height,
              transform: `translate(${position.x}px, ${position.y}px)`
            }
          });
        }}
        bounds="parent"
        dragHandleClassName="drag-handle"
      >
        <motion.div
          className="relative group w-full h-full"
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.2 }}
          onContextMenu={handleContextMenu}
        >
          {isEditing && (
            <motion.div 
              className="drag-handle absolute -top-6 left-0 p-2 cursor-move opacity-0 group-hover:opacity-100 bg-black/90 border border-blue-400/30 rounded flex items-center space-x-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <GripVertical className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-400">{block.type}</span>
            </motion.div>
          )}
          {children}
        </motion.div>
      </Rnd>

      <AnimatePresence>
        {showContextMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={handleClickOutside}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed z-50 bg-black/90 border border-blue-400/30 rounded-lg shadow-lg py-1"
              style={{
                left: contextMenuPosition.x,
                top: contextMenuPosition.y
              }}
            >
              <button
                onClick={handleDuplicate}
                className="w-full px-4 py-2 text-sm text-left hover:bg-blue-500/20 flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Duplicate</span>
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-sm text-left hover:bg-blue-500/20 flex items-center space-x-2 text-red-400"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DraggableBlock;