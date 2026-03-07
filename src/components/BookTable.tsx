'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'
import { dict } from '@/lib/translations'
import { Edit, Trash2, Search, MapPin, X } from 'lucide-react'
import { BookForm } from './BookForm'
import { FurnitureGrid } from './FurnitureGrid'

export function BookTable() {
  const { lang } = useAppStore()
  const t = dict[lang]
  const [books, setBooks] = useState<any[]>([])
  const [furnitures, setFurnitures] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [editingBook, setEditingBook] = useState<any>(null)
  const [locatingBook, setLocatingBook] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchData = async () => {
    const { data: bData } = await supabase.from('books').select('*').order('created_at', { ascending: false })
    if (bData) setBooks(bData)
    const { data: fData } = await supabase.from('furnitures').select('*')
    if (fData) setFurnitures(fData)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const deleteBook = async (id: string) => {
    if(confirm('Are you sure?')) {
      await supabase.from('books').delete().eq('id', id)
      fetchData()
    }
  }

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          onClick={() => { setEditingBook(null); setIsFormOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          {t.add_book}
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3">{t.title}</th>
              <th className="px-6 py-3">{t.author}</th>
              <th className="px-6 py-3">{t.category}</th>
              <th className="px-6 py-3">{t.language}</th>
              <th className="px-6 py-3">{t.location}</th>
              <th className="px-6 py-3 text-center">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map(book => (
              <tr key={book.id} className="border-b hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-900">{book.title}</td>
                <td className="px-6 py-4 text-gray-600">{book.author}</td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{book.category}</span>
                </td>
                <td className="px-6 py-4">{book.language}</td>
                <td className="px-6 py-4 font-mono text-gray-500 text-xs">
                   {book.furniture_id ? `R${book.row_num}-C${book.col_num}` : book.location_code}
                </td>
                <td className="px-6 py-4 flex justify-center gap-3">
                  <button onClick={() => setLocatingBook(book)} className="text-amber-600 hover:text-amber-800 transition" title={t.locate as string}>
                    <MapPin className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setEditingBook(book); setIsFormOpen(true); }} className="text-blue-500 hover:text-blue-700">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteBook(book.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isFormOpen && (
        <BookForm 
          book={editingBook} 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => { setIsFormOpen(false); fetchData(); }} 
        />
      )}

      {/* Locator Modal */}
      {locatingBook && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 relative max-w-2xl w-full">
            <button onClick={() => setLocatingBook(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full p-1">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-1 text-gray-800">{locatingBook.title}</h3>
            <p className="text-sm text-gray-500 mb-6">{locatingBook.author}</p>
            
            {locatingBook.furniture_id ? (
              <FurnitureGrid 
                rows={furnitures.find(f => f.id === locatingBook.furniture_id)?.rows_count || 0}
                cols={furnitures.find(f => f.id === locatingBook.furniture_id)?.cols_count || 0}
                selectedRow={locatingBook.row_num}
                selectedCol={locatingBook.col_num}
                furnitureName={furnitures.find(f => f.id === locatingBook.furniture_id)?.name}
                lang={lang}
              />
            ) : (
              <div className="p-8 text-center text-gray-500 border-2 border-dashed rounded-lg">
                Cet ancien livre n'est pas assigné à un meuble dynamique (Code: {locatingBook.location_code}).<br/> Modifiez-le pour le placer visuellement.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
