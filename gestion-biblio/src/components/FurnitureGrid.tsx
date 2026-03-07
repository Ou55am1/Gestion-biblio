'use client'
import { Book } from 'lucide-react'

interface FurnitureGridProps {
  rows: number;
  cols: number;
  selectedRow?: number;
  selectedCol?: number;
  onCellClick?: (row: number, col: number) => void;
  furnitureName?: string;
  lang?: 'FR' | 'EN' | 'AR';
}

export function FurnitureGrid({ 
  rows, 
  cols, 
  selectedRow, 
  selectedCol, 
  onCellClick, 
  furnitureName, 
  lang = 'FR' 
}: FurnitureGridProps) {

  const grid = [];
  for (let r = 1; r <= rows; r++) {
    const rowCells = [];
    for (let c = 1; c <= cols; c++) {
      const isSelected = selectedRow === r && selectedCol === c;
      rowCells.push(
        <button
          key={`${r}-${c}`}
          type="button"
          onClick={() => onCellClick && onCellClick(r, c)}
          disabled={!onCellClick}
          className={`h-16 flex flex-col items-center justify-center rounded-md border-2 transition-all group overflow-hidden relative ${
            isSelected 
              ? 'bg-blue-100 border-blue-500 shadow-md ring-2 ring-blue-300 z-10 scale-105' 
              : 'bg-white border-yellow-900/10 hover:bg-yellow-100'
          } ${onCellClick ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'}`}
          style={{ flex: 1, minWidth: '60px' }}
        >
          {/* Wooden shelf visual element at bottom of cell */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#8b5a2b] border-t border-[#5e3a18]"></div>
          
          {isSelected && <Book className={`w-8 h-8 text-blue-600 mb-2 drop-shadow-sm z-10 animate-pulse`} />}
          {!isSelected && <span className="text-[11px] text-[#5e3a18]/40 group-hover:text-[#5e3a18]/60 z-10 font-bold tracking-widest">
            {r}-{c}
          </span>}
        </button>
      );
    }
    grid.push(
      <div key={`row-${r}`} className="flex gap-2 w-full">
        {rowCells}
      </div>
    );
  }

  return (
    <div className="bg-[#5e3a18] p-5 rounded-xl border-[6px] border-[#3e240a] shadow-2xl flex flex-col gap-3 w-full max-w-2xl mx-auto overflow-x-auto">
      {furnitureName && (
        <div className="text-center font-bold text-yellow-100 mb-1 tracking-widest text-sm bg-black/30 py-2 rounded-lg border-b-2 border-white/10 shadow-inner">
          {furnitureName}
        </div>
      )}
      <div className="flex flex-col gap-3 w-full bg-[#8b5a2b] p-4 rounded-lg shadow-inner border-2 border-[#4a2e12]">
        {grid}
      </div>
    </div>
  )
}
