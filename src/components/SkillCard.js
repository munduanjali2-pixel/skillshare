const categoryColors = {
  'Web Dev': 'from-blue-500 to-cyan-500',
  'DSA': 'from-green-500 to-emerald-500',
  'Design': 'from-purple-500 to-pink-500',
  'AI': 'from-orange-500 to-red-500'
}

const categoryIcons = {
  'Web Dev': '💻',
  'DSA': '🧮',
  'Design': '🎨',
  'AI': '🤖'
}

export default function SkillCard({ skill, showDelete = false, onDelete }) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      onDelete(skill.id)
    }
  }

  const categoryGradient = categoryColors[skill.category] || 'from-gray-500 to-gray-600'
  const categoryIcon = categoryIcons[skill.category] || '📚'

  return (
    <div className="relative group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-200 transition-all duration-300 hover:transform hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {skill.title}
        </h3>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${categoryGradient} shadow-md`}>
          <span className="mr-1">{categoryIcon}</span>
          {skill.category}
        </div>
      </div>
      
      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{skill.description}</p>
      
      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-500">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 mr-2 text-xs">
            📧
          </span>
          <span className="font-medium">Contact:</span>
          <span className="ml-2 text-gray-700">{skill.contact}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-400">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 text-gray-500 mr-2">
              📅
            </span>
            {new Date(skill.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          
          {showDelete && (
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-all"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}