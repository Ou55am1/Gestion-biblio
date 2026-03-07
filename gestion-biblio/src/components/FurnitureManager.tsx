'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'
import { dict } from '@/lib/translations'
import { X, Edit, Trash2, Plus } from 'lucide-react'

export function FurnitureManager({ onClose }: { onClose: () => void }) {
  const { lang } = useAppStore()
  const dir = lang === 'AR' ? 'rtl' : 'ltr'
  const t = dict[lang]
  
  const [furnitures, setFurnitures] = useState<any[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', rows_count: 2, cols_count: 3 })

  const fetchFurnitures = async () => {
    const { data } = await supabase.from('furnitures').select('*').order('created_at', { ascending: true })
    if (data) setFurnitures(data)
  }

  useEffect(() => {
    fetchFurnitures()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return

    if (editingId) {
      await supabase.from('furnitures').update(formData).eq('id', editingId)
    } else {
      await supabase.from('furnitures').insert([formData])
    }
    
    setIsAdding(false)
    setEditingId(null)
    setFormData({ name: '', rows_count: 2, cols_count: 3 })
    fetchFurnitures()
  }

  const handleEdit = (furniture: any) => {
    setFormData({ name: furniture.name, rows_count: furniture.rows_count, cols_count: furniture.cols_count })
    setEditingId(furniture.id)
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm(lang === 'FR' ? "Êtes-vous sûr de vouloir supprimer ce meuble ?" : lang === 'EN' ? "Are you sure you want to delete this furniture?" : "هل أنت متأكد أنك تريد حذف هذا الأثاث؟")) {
      const { error } = await supabase.from('furnitures').delete().eq('id', id)
      if (error) {
        alert(t.error_delete_furniture)
      } else {
        fetchFurnitures()
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative my-auto" dir={dir}>
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{t.manage_furnitures as string}</h2>
        
        {isAdding ? (
          <form onSubmit={handleSave} className="bg-slate-50 p-4 rounded-xl border mb-6">
            <h3 className="font-bold text-slate-800 mb-4">{editingId ? t.edit as string : t.add_furniture as string}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.furniture_name as string}</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.rows as string}</label>
                <input required type="number" min="1" max="20" value={formData.rows_count} onChange={e => setFormData({...formData, rows_count: parseInt(e.target.value) || 1})} className="w-full border rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.cols as string}</label>
                <input required type="number" min="1" max="20" value={formData.cols_count} onChange={e => setFormData({...formData, cols_count: parseInt(e.target.value) || 1})} className="w-full border rounded-md p-2" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition">{t.save as string}</button>
              <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg transition">{t.cancel as string}</button>
            </div>
          </form>
        ) : (
          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">{furnitures.length} {t.furniture as string}(s)</span>
            <button type="button" onClick={() => { setFormData({ name: '', rows_count: 2, cols_count: 3 }); setIsAdding(true); }} className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition flex items-center gap-2 text-sm font-medium">
              <Plus className="w-4 h-4" /> {t.add_furniture as string}
            </button>
          </div>
        )}

        <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">{t.furniture_name as string}</th>
                <th className="px-6 py-3">{t.rows as string}</th>
                <th className="px-6 py-3">{t.cols as string}</th>
                <th className="px-6 py-3 text-center">{t.actions as string}</th>
              </tr>
            </thead>
            <tbody>
              {furnitures.map(f => (
                <tr key={f.id} className="border-b hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-bold text-gray-800">{f.name}</td>
                  <td className="px-6 py-4 text-gray-600">{f.rows_count}</td>
                  <td className="px-6 py-4 text-gray-600">{f.cols_count}</td>
                  <td className="px-6 py-4 flex justify-center gap-4">
                    <button onClick={() => handleEdit(f)} className="text-blue-500 hover:text-blue-700" title={t.edit as string}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:text-red-700" title={t.delete as string}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {furnitures.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 font-medium">
                    {t.no_furniture as string}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  )
}
