import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore"
import { useToastStore } from "@/store/useToastStore"
import { useNavigate } from "react-router-dom"

interface AdminLoginProps {
  darkMode: boolean
}

interface IValidation {
  email: string,
  password: string
}

const AdminLogin: React.FC<AdminLoginProps> = ({ darkMode }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [ ValidationError, setValidationError ] = useState<IValidation>({
    email: "",
    password: ""
  })

  const login = useAuthStore((state) => state.login)
  const loading = useAuthStore((state) => state.loading)
  const authError = useAuthStore((state) => state.error)
  const showToast = useToastStore((state) => state.showToast)
  const navigate = useNavigate()

  useEffect(() => {
    // Clear error when component unmounts or mounts
    return () => {
      useAuthStore.getState().clearError()
    }
  }, [])

  // function handling form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    //validates email and password
    if (!email || !password) {
      setValidationError({
        email: !email ? "email is required" : "",
        password: !password ? "password is required" : ""
      })
      return
    } else {
      setValidationError({ email: "", password: "" })
    }
  
    console.log("Before login - loading:", loading)
    try {
      await login({ email, password })
      showToast("Login successful!", "success")
      navigate("/admin")
    } catch (error) {
      showToast("Invalid credentials. Please try again.", "error")
      console.log("After error - loading:", useAuthStore.getState().loading) 
      console.log(error)
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
        {(authError || ValidationError.email || ValidationError.password) && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-500">{authError || ValidationError.email || ValidationError.password}</p>
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