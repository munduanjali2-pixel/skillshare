'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import SkillCard from '@/components/SkillCard'
import SkillForm from '@/components/SkillForm'

const categories = ['All', 'Web Dev', 'DSA', 'Design', 'AI']

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function Home() {
  const [skills, setSkills] = useState([])
  const [filteredSkills, setFilteredSkills] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    // Get user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    fetchSkills()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredSkills(skills)
    } else {
      setFilteredSkills(skills.filter(skill => skill.category === selectedCategory))
    }
  }, [skills, selectedCategory])

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSkills(data || [])
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSuccess = () => {
    fetchSkills()
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Share Knowledge, Learn Together
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with experts and learners in your community. Share your skills and discover new opportunities to grow.
            </p>
            
            {user ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {showForm ? '✕ Cancel' : '✨ Share Your Skill'}
              </button>
            ) : (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 inline-block">
                <p className="text-gray-600 mb-4">Ready to share your expertise?</p>
                <a
                  href="/auth"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-md inline-block"
                >
                  Get Started
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Skill Form */}
        {showForm && user && (
          <div className="mb-12 max-w-2xl mx-auto">
            <SkillForm onSuccess={handleFormSuccess} />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{skills.length}</div>
            <div className="text-gray-600">Skills Shared</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{categories.length - 1}</div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">∞</div>
            <div className="text-gray-600">Learning Opportunities</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/70 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white hover:shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="text-gray-600 text-lg">Loading amazing skills...</span>
            </div>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedCategory === 'All' 
                  ? 'No skills shared yet'
                  : `No ${selectedCategory} skills found`
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedCategory === 'All' 
                  ? 'Be the first to share your expertise with the community!'
                  : `Be the first to share a skill in ${selectedCategory}!`
                }
              </p>
              {user && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  Share First Skill
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}