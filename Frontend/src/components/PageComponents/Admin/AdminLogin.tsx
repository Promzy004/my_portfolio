import React, { useState } from "react"

interface AdminLoginProps {
  darkMode: boolean
  onLogin: (email: string, password: string) => void
}

const AdminLogin: React.FC<AdminLoginProps> = ({ darkMode, onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    try {
      // Call the parent onLogin handler (will be connected to backend later)
      await onLogin(email, password)
    } catch (err) {
      setError("Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-[#0A0A0A]" : "bg-[#F9F9F9]"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-2xl ${
          darkMode ? "bg-[#1A1A1A]" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#2B93E2" }}>
            Admin Login
          </h1>
          <p className={`text-sm ${darkMode ? "text-[#CCCCCC]" : "text-[#666666]"}`}>
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-[#CCCCCC]" : "text-[#333333]"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white focus:border-[#2B93E2]"
                  : "bg-white border-[#E5E5E5] text-black focus:border-[#2B93E2]"
              } outline-none`}
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-[#CCCCCC]" : "text-[#333333]"
              }`}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333] text-white focus:border-[#2B93E2]"
                  : "bg-white border-[#E5E5E5] text-black focus:border-[#2B93E2]"
              } outline-none`}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#2B93E2" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className={`text-xs text-center mt-6 ${darkMode ? "text-[#666666]" : "text-[#999999]"}`}>
          Secure admin access only
        </p>
      </div>
    </div>
  )
}

export default AdminLogin