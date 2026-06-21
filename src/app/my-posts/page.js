'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import SkillCard from '@/components/SkillCard'
import Link from 'next/link'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function MyPosts() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchMySkills(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchMySkills(session.user.id)
        } else {
          setSkills([])
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchMySkills = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSkills(data || [])
    } catch (error) {
      console.error('Error fetching my skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (skillId) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skillId)

      if (error) throw error
      
      setSkills(skills.filter(skill => skill.id !== skillId))
    } catch (error) {
      alert('Error deleting skill: ' + error.message)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-6xl mb-6">🔐</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Required</h1>
            <p className="text-xl text-gray-600 mb-8">You need to be logged in to view your posts.</p>
            <div className="space-y-4">
              <Link 
                href="/auth"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                Sign In / Sign Up
              </Link>
              <div>
                <Link 
                  href="/"
                  className="text-gray-500 hover:text-gray-700 font-medium"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Skills</h1>
            <p className="text-gray-600">Manage your shared expertise</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link 
              href="/"
              className="bg-white/70 backdrop-blur-sm hover:bg-white text-gray-700 font-medium py-2 px-6 rounded-lg border border-gray-200 transition-all transform hover:scale-105"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">{skills.length}</div>
            <div className="text-gray-600 text-sm">Skills Shared</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {new Set(skills.map(skill => skill.category)).size}
            </div>
            <div className="text-gray-600 text-sm">Categories</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {skills.length > 0 ? Math.ceil(skills.length / 30 * 100) + '%' : '0%'}
            </div>
            <div className="text-gray-600 text-sm">Community Impact</div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="text-gray-600 text-lg">Loading your skills...</span>
            </div>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">🌱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Start Your Journey
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                You haven't shared any skills yet. Share your first skill and start building your impact in the community!
              </p>
              <Link 
                href="/"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                ✨ Share Your First Skill
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Skills ({skills.length})
              </h2>
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                + Add New Skill
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.map(skill => (
                <SkillCard 
                  key={skill.id} 
                  skill={skill} 
                  showDelete={true}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}