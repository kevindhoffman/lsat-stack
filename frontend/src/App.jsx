import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) console.error('Login error:', error.message)
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Logout error:', error.message)
    setUser(null)
  }

  return (
    <div>
      {/* Google login UI in top-right corner */}
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        {user ? (
          <div>
            <span style={{ marginRight: '1rem' }}>Hi, {user.email}</span>
            <button onClick={handleLogout}>Log out</button>
          </div>
        ) : (
          <button onClick={() => {
            console.log('Login button clicked')
            handleLogin()
          }}>Sign in with Google</button>

        )}
      </div>

      {/* Your actual app interface remains here */}
      <div style={{ paddingTop: '4rem' }}>
        {/* 👇 Replace this with your canvas, questions, answers, chart, etc. */}
        <h1>LSAT App Interface Goes Here</h1>
        {/* Keep your existing logic here */}
      </div>
    </div>
  )
}

export default App
