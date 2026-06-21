import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const categories = [
  { value: 'Web Dev', icon: '💻', color: 'from-blue-500 to-cyan-500' },
  { value: 'DSA', icon: '🧮', color: 'from-green-500 to-emerald-500' },
  { value: 'Design', icon: '🎨', color: 'from-purple-500 to-pink-500' },
  { value: 'AI', icon: '🤖', color: 'from-orange-500 to-red-500' }
]

export default function SkillForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Dev',
    contact: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('You must be logged in to post a skill')
        return
      }

      const { error } = await supabase
        .from('skills')
        .insert([
          {
            ...formData,
            user_id: user.id
          }
        ])

      if (error) {
        throw error
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Web Dev',
        contact: ''
      })

      if (onSuccess) onSuccess()

    } catch (error) {
      alert('Error posting skill: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">✨ Share Your Expertise</h2>
        <p className="text-gray-600">Help others learn by sharing what you know best</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Skill Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-500"
            placeholder="e.g., React Development, Data Structures, UI Design"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Category
          </label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map(category => (
              <label
                key={category.value}
                className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.category === category.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white/50 hover:bg-white/80'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={formData.category === category.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mr-3`}>
                  <span className="text-white text-sm">{category.icon}</span>
                </div>
                <span className="font-medium text-gray-900">{category.value}</span>
                {formData.category === category.value && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-500 resize-none"
            placeholder="Describe what you can teach, your experience level, and what learners can expect..."
          />
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-semibold text-gray-700 mb-2">
            Contact Information
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-500"
            placeholder="Email, Discord, LinkedIn, or preferred contact method"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] disabled:transform-none shadow-lg hover:shadow-xl disabled:shadow-md"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Sharing Your Skill...
            </div>
          ) : (
            '🚀 Share My Skill'
          )}
        </button>
      </form>
    </div>
  )
}