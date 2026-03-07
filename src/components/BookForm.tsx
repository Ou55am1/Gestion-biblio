'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'
import { dict } from '@/lib/translations'
import { X, Plus, MapPin } from 'lucide-react'
import { FurnitureGrid } from './FurnitureGrid'

export function BookForm({ book, onClose, onSuccess }: { book?: any, onClose: () => void, onSuccess: () => void }) {
  const { lang } = useAppStore()
  const t = dict[lang]
  const dir = lang === 'AR' ? 'rtl' : 'ltr'
  
  const [furnitures, setFurnitures] = useState<any[]>([])
  const [formData, setFormData] = useState(book || {
    title: '', author: '', category: 'Islamic Sciences', language: 'AR', furniture_id: '', row_num: '', col_num: '', notes: ''
  })
  
  const [isAddingFurniture, setIsAddingFurniture] = useState(false)
  const [newFurniture, setNewFurniture] = useState({ name: '', rows: 2, cols: 3 })

  const fetchFurnitures = async () => {
    try {
      const { data, error } = await supabase.from('furnitures').select('*').order('created_at', { ascending: true })
      if (!error && data) {
        setFurnitures(data)
        if (!formData.furniture_id && !book?.id && data.length > 0) {
          setFormData((f: any) => ({ ...f, furniture_id: data[0].id }))
        }
      }
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    fetchFurnitures()
  }, [])

  const handleAddFurniture = async () => {
    if (!newFurniture.name) return
    const { data, error } = await supabase.from('furnitures').insert([{
      name: newFurniture.name,
      rows_count: Number(newFurniture.rows),
      cols_count: Number(newFurniture.cols)
    }]).select()
    
    if (data && data[0]) {
      setFurnitures([...furnitures, data[0]])
      setFormData({ ...formData, furniture_id: data[0].id })
      setIsAddingFurniture(false)
      setNewFurniture({ name: '', rows: 2, cols: 3 })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.furniture_id || !formData.row_num || !formData.col_num) {
      alert(lang === 'FR' ? "Veuillez sélectionner un meuble, un étage et une colonne." : lang === 'EN' ? "Please select furniture, row and column." : "الرجاء تحديد الأثاث، الرف والعمود.");
      return;
    }
    
    const finalData = {
      title: formData.title,
      author: formData.author,
      category: formData.category,
      language: formData.language,
      notes: formData.notes,
      furniture_id: formData.furniture_id,
      row_num: Number(formData.row_num),
      col_num: Number(formData.col_num),
      location_code: 'DYNAMIC_LOC' // fallback if db requires it
    }

    if (book?.id) {
      await supabase.from('books').update(finalData).eq('id', book.id)
    } else {
      await supabase.from('books').insert([finalData])
    }
    onSuccess()
  }

  const selectedFurniture = furnitures.find(f => f.id === formData.furniture_id)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 relative my-auto mt-10" dir={dir}>
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{book ? t.actions : t.add_book}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Colonne Gauche: Champs du formulaire */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.title}</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.author}</label>
                <input required type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.category}</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>Islamic Sciences</option>
                    <option>Thought & Issues</option>
                    <option>Management/NGO</option>
                    <option>Literature</option>
                    <option>History & Series</option>
                    <option>Dictionaries</option>
                    <option>General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.language}</label>
                  <select value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="AR">العربية</option>
                    <option value="FR">Français</option>
                    <option value="EN">English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Colonne Droite: Sélecteur Visuel d'Emplacement Dynamique */}
            <div className="flex flex-col bg-slate-50 p-4 rounded-xl border">
              
              {!isAddingFurniture ? (
                <>
                  <div className="flex items-end justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t.furniture as string}</label>
                      <select 
                        required 
                        value={formData.furniture_id} 
                        onChange={e => setFormData({...formData, furniture_id: e.target.value, row_num: '', col_num: ''})} 
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none font-medium bg-white"
                      >
                        <option value="" disabled>{furnitures.length === 0 ? t.no_furniture as string : '...'}</option>
                        {furnitures.map(f => (
                          <option key={f.id} value={f.id}>{f.name} ({f.rows_count}x{f.cols_count})</option>
                        ))}
                      </select>
                    </div>
                    <button type="button" onClick={() => setIsAddingFurniture(true)} className="bg-slate-800 text-white px-3 py-2 rounded-md hover:bg-slate-700 transition flex items-center gap-1 text-sm font-medium">
                      <Plus className="w-4 h-4" /> {t.add_furniture as string}
                    </button>
                  </div>

                  {selectedFurniture && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t.row as string}</label>
                        <select required value={formData.row_num} onChange={e => setFormData({...formData, row_num: e.target.value})} className="w-full border rounded-md p-1.5 text-sm bg-white">
                          <option value="" disabled>-</option>
                          {Array.from({length: selectedFurniture.rows_count}, (_, i) => i + 1).map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t.column as string}</label>
                        <select required value={formData.col_num} onChange={e => setFormData({...formData, col_num: e.target.value})} className="w-full border rounded-md p-1.5 text-sm bg-white">
                          <option value="" disabled>-</option>
                          {Array.from({length: selectedFurniture.cols_count}, (_, i) => i + 1).map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedFurniture ? (
                    <div className="mt-2 relative">
                       <span className="text-[10px] text-gray-400 absolute -top-3 left-2 z-10 bg-slate-50 px-1">{t.locate as string}</span>
                       <FurnitureGrid 
                         rows={selectedFurniture.rows_count} 
                         cols={selectedFurniture.cols_count}
                         selectedRow={Number(formData.row_num)}
                         selectedCol={Number(formData.col_num)}
                         onCellClick={(r, c) => setFormData({...formData, row_num: r.toString(), col_num: c.toString()})}
                         furnitureName={selectedFurniture.name}
                         lang={lang}
                       />
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed rounded-xl mt-4 min-h-32">
                      <MapPin className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm">{t.no_furniture as string}</p>
                    </div>
                  )}
                </>
              ) : (
                /* CREATE FURNITURE FORM */
                <div className="bg-white p-4 rounded-lg border-2 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-3 text-sm">{t.add_furniture as string}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{t.furniture_name as string}</label>
                      <input type="text" value={newFurniture.name} placeholder="ex: Grand Placard" onChange={e => setNewFurniture({...newFurniture, name: e.target.value})} className="w-full border rounded-md p-1.5 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t.rows as string}</label>
                        <input type="number" min="1" max="20" value={newFurniture.rows} onChange={e => setNewFurniture({...newFurniture, rows: parseInt(e.target.value) || 1})} className="w-full border rounded-md p-1.5 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t.cols as string}</label>
                        <input type="number" min="1" max="20" value={newFurniture.cols} onChange={e => setNewFurniture({...newFurniture, cols: parseInt(e.target.value) || 1})} className="w-full border rounded-md p-1.5 text-sm" />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                       <button type="button" onClick={handleAddFurniture} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 rounded-md text-sm transition">{t.save as string}</button>
                       <button type="button" onClick={() => setIsAddingFurniture(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1.5 rounded-md text-sm transition">{t.close as string}</button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
          
          <div className="pt-6 border-t mt-6">
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md">
              {t.add_book}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
