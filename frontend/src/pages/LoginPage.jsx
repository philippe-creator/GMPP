import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import { 
  Zap, Eye, EyeOff, Shield, Clock, TrendingUp, Users, Wrench, ChevronRight, 
  Settings, Activity, Award, Sun, Moon, ArrowRight, Globe, Cpu, BarChart3 
} from 'lucide-react'

const phrases = [
  "L'excellence industrielle à votre portée",
  "Performance. Précision. Prévention.",
  "L'avenir de la maintenance commence ici",
  "Maîtrisez votre parc industriel",
  "Innovation et fiabilité au quotidien"
]

const features = [
  { icon: Shield, text: "Sécurité Enterprise", desc: "Protection maximale" },
  { icon: Cpu, text: "Automatisation", desc: "Planification IA" },
  { icon: Activity, text: "Monitoring", desc: "Suivi temps réel" },
  { icon: Award, text: "Certifié ISO", desc: "Normes industrielles" }
]

const stats = [
  { value: "99.9%", label: "Disponibilité" },
  { value: "500+", label: "Clients" },
  { value: "24/7", label: "Support" }
]

export default function LoginPage() {
  const [email, setEmail] = useState('admin@gmpp.local')
  const [password, setPassword] = useState('Admin123!')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      toast.error('Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = () => setIsDark(!isDark)

  const theme = isDark ? {
    bg: 'bg-[#0a0a0a]',
    bgSecondary: 'bg-[#111111]',
    bgCard: 'bg-[#111111]/90',
    text: 'text-white',
    textSecondary: 'text-zinc-400',
    textMuted: 'text-zinc-500',
    textSubtle: 'text-zinc-600',
    border: 'border-zinc-800',
    borderLight: 'border-zinc-700',
    accent: 'bg-white',
    accentText: 'text-black',
    inputBorder: 'border-zinc-700',
    inputFocus: 'focus:border-white',
    grid: 'opacity-[0.02]',
    glow: 'from-zinc-800/20'
  } : {
    bg: 'bg-slate-50',
    bgSecondary: 'bg-white',
    bgCard: 'bg-white/90',
    text: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-500',
    textSubtle: 'text-slate-400',
    border: 'border-slate-200',
    borderLight: 'border-slate-300',
    accent: 'bg-slate-900',
    accentText: 'text-white',
    inputBorder: 'border-slate-300',
    inputFocus: 'focus:border-slate-900',
    grid: 'opacity-[0.03]',
    glow: 'from-slate-400/10'
  }

  return (
    <div className={`min-h-screen ${theme.bg} relative overflow-y-auto overflow-x-hidden flex font-light scroll-smooth`}>
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Base gradient */}
        <div className={`absolute inset-0 ${isDark 
          ? 'bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0d0d0d]' 
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`} />
        
        {/* Animated radial glows */}
        <div className={`absolute top-[-10%] right-[-10%] w-[700px] h-[700px] ${theme.glow} via-transparent to-transparent rounded-full blur-3xl animate-pulse`} style={{ animationDuration: '8s' }} />
        <div className={`absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] ${isDark ? 'from-zinc-700/10' : 'from-slate-300/20'} via-transparent to-transparent rounded-full blur-3xl animate-pulse`} style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className={`absolute top-[40%] left-[20%] w-[400px] h-[400px] ${isDark ? 'from-zinc-600/5' : 'from-slate-400/10'} via-transparent to-transparent rounded-full blur-3xl animate-pulse`} style={{ animationDuration: '12s', animationDelay: '4s' }} />
        
        {/* Industrial accent lines with animation */}
        <div className={`absolute top-0 left-0 w-full h-[1px] ${isDark ? 'bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent' : 'bg-gradient-to-r from-transparent via-slate-300 to-transparent'}`} />
        <div className={`absolute bottom-0 left-0 w-full h-[1px] ${isDark ? 'bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent' : 'bg-gradient-to-r from-transparent via-slate-300 to-transparent'}`} />
        
        {/* Animated grid pattern */}
        <div 
          className={`absolute inset-0 ${theme.grid}`}
          style={{
            backgroundImage: `linear-gradient(to right, ${isDark ? '#ffffff' : '#000000'} 1px, transparent 1px), linear-gradient(to bottom, ${isDark ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/5 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-40 left-10 w-24 h-24 border border-white/5 rotate-45 animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 left-1/4 w-16 h-16 border-l border-t border-white/10 animate-bounce" style={{ animationDuration: '8s' }} />
        
        {/* Animated lines */}
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

        {/* Floating particles - Dynamic */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 ${isDark ? 'bg-amber-400' : 'bg-amber-500'} rounded-full animate-float-particle`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.4,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}

        {/* Expanding rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-96 h-96 border ${isDark ? 'border-amber-500/10' : 'border-amber-400/20'} rounded-full animate-expand`}
              style={{
                animationDelay: `${i * 2}s`,
                animationDuration: '6s'
              }}
            />
          ))}
        </div>

        {/* Data flow lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isDark ? "rgba(245,158,11,0)" : "rgba(245,158,11,0)"} />
              <stop offset="50%" stopColor={isDark ? "rgba(245,158,11,0.3)" : "rgba(245,158,11,0.5)"} />
              <stop offset="100%" stopColor={isDark ? "rgba(245,158,11,0)" : "rgba(245,158,11,0)"} />
            </linearGradient>
          </defs>
          {[...Array(5)].map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={20 + i * 20}
              x2="100%"
              y2={30 + i * 25}
              stroke="url(#flow-gradient)"
              strokeWidth="1"
              className="animate-flow-line"
              style={{
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            />
          ))}
        </svg>

        {/* Rotating hexagons */}
        <div className="absolute top-10 left-10">
          <svg width="60" height="60" viewBox="0 0 60 60" className="animate-spin-slow opacity-20">
            <polygon
              points="30,5 55,17.5 55,42.5 30,55 5,42.5 5,17.5"
              fill="none"
              stroke={isDark ? "white" : "black"}
              strokeWidth="1"
            />
          </svg>
        </div>
        <div className="absolute bottom-20 right-10">
          <svg width="80" height="80" viewBox="0 0 60 60" className="animate-spin-reverse opacity-10">
            <polygon
              points="30,5 55,17.5 55,42.5 30,55 5,42.5 5,17.5"
              fill="none"
              stroke={isDark ? "white" : "black"}
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Pulsing dots grid */}
        <div className="absolute right-20 top-1/3 grid grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 ${isDark ? 'bg-amber-500/30' : 'bg-amber-500/40'} rounded-full animate-pulse-dot`}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Theme Toggle - Fixed */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full ${theme.bgCard} ${theme.border} border backdrop-blur-sm hover:scale-110 transition-all duration-300 group`}
      >
        {isDark ? (
          <Sun size={20} className="text-amber-400 group-hover:rotate-90 transition-transform duration-500" />
        ) : (
          <Moon size={20} className="text-slate-600 group-hover:rotate-12 transition-transform duration-500" />
        )}
      </button>

      <div className="flex flex-col lg:flex-row w-full min-h-screen relative z-10">
        {/* Left Panel - Marketing */}
        <div className={`hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-24 py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          {/* Logo */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-4">
              <div className="relative group">
                <div className={`w-14 h-14 ${theme.accent} rounded-none rotate-45 flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:rotate-[225deg]`}>
                  <Zap size={24} className={`${theme.accentText} -rotate-45 group-hover:rotate-45 transition-transform duration-500`} />
                </div>
                <div className={`absolute inset-0 ${theme.accent} rounded-none rotate-45 blur-xl opacity-30`} />
              </div>
              <div>
                <h1 className={`text-3xl font-light ${theme.text} tracking-[0.2em] uppercase`}>GMPP</h1>
                <p className={`${theme.textMuted} text-xs font-light tracking-[0.3em] uppercase mt-1`}>Suite Professionnelle</p>
              </div>
            </div>
          </div>

          {/* Animated Tagline */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-[1px] ${isDark ? 'bg-zinc-600' : 'bg-slate-400'}`} />
              <span className={`${theme.textMuted} text-xs uppercase tracking-[0.2em]`}>Système ERP Industriel</span>
            </div>
            <div className="h-24 overflow-hidden">
              <p className={`text-2xl xl:text-3xl font-extralight ${theme.text} leading-tight max-w-lg transition-all duration-700 animate-fade-in`}>
                {phrases[currentPhrase]}
              </p>
            </div>
            <div className="flex gap-2 mt-6">
              {phrases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPhrase(i)}
                  className={`h-[2px] transition-all duration-500 ${
                    i === currentPhrase ? `w-10 ${isDark ? 'bg-white' : 'bg-slate-900'}` : `w-4 ${theme.inputBorder} hover:${isDark ? 'bg-zinc-600' : 'bg-slate-400'}`
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Animated Features */}
          <div className="space-y-3 max-w-md">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`group flex items-center gap-4 p-3 rounded-lg hover:${isDark ? 'bg-white/5' : 'bg-slate-100'} transition-all duration-300 cursor-default animate-slide-in`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className={`p-2 ${isDark ? 'bg-zinc-800/50' : 'bg-white'} rounded border ${theme.border} group-hover:scale-110 transition-all duration-300`}>
                  <feature.icon size={18} className={`${theme.textSecondary} group-hover:${theme.text} transition-colors`} />
                </div>
                <div className="flex-1">
                  <div className={`text-sm ${theme.textSecondary} group-hover:${theme.text} transition-colors`}>{feature.text}</div>
                </div>
                <ArrowRight size={14} className={`${theme.textSubtle} group-hover:${theme.textSecondary} group-hover:translate-x-1 transition-all`} />
              </div>
            ))}
          </div>

          {/* Animated Stats */}
          <div className={`flex gap-10 mt-10 pt-8 ${theme.border} border-t`}>
            {stats.map((stat, i) => (
              <div key={i} className="group">
                <div className={`text-xl font-extralight ${theme.text} tracking-wide group-hover:scale-110 transition-transform duration-300`}>{stat.value}</div>
                <div className={`text-[10px] ${theme.textSubtle} uppercase tracking-[0.15em] mt-1`}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Location Badge */}
          <div className={`mt-8 inline-flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-zinc-800/30' : 'bg-slate-200/50'} rounded-full ${theme.border} border`}>
            <Globe size={14} className={theme.textMuted} />
            <span className={`text-xs ${theme.textSecondary}`}>Beni Mellal, Maroc</span>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className={`flex-1 flex items-center justify-center p-6 lg:p-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
          <div className="w-full max-w-[400px]">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className={`inline-flex items-center justify-center w-12 h-12 ${theme.accent} mb-3 rotate-45`}>
                <Zap size={20} className={`${theme.accentText} -rotate-45`} />
              </div>
              <h1 className={`text-xl font-light ${theme.text} tracking-[0.15em] uppercase`}>GMPP</h1>
              <p className={`${theme.textMuted} text-xs font-light tracking-[0.2em] uppercase mt-1`}>Suite Professionnelle</p>
            </div>

            {/* Login Card */}
            <div className="relative">
              <div className={`absolute -inset-[1px] bg-gradient-to-b ${isDark ? 'from-zinc-700/50 via-zinc-800/20 to-zinc-700/50' : 'from-slate-300/50 via-slate-200/20 to-slate-300/50'}`} />
              
              <div className={`relative ${theme.bgCard} backdrop-blur-sm border ${theme.border} p-8 lg:p-10 shadow-2xl`}>
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-[1px] ${isDark ? 'bg-zinc-600' : 'bg-slate-400'}`} />
                      <span className={`${theme.textMuted} text-[10px] uppercase tracking-[0.2em]`}>Accès Sécurisé</span>
                    </div>
                    {/* Mobile Theme Toggle */}
                    <button
                      onClick={toggleTheme}
                      className={`lg:hidden p-2 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-slate-200'} transition-colors`}
                    >
                      {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-600" />}
                    </button>
                  </div>
                  <h2 className={`text-2xl font-extralight ${theme.text}`}>Connexion</h2>
                  <p className={`${theme.textMuted} text-sm mt-1 font-light`}>Identifiez-vous pour continuer</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className={`text-[10px] ${theme.textMuted} uppercase tracking-[0.15em]`}>Adresse email</label>
                    <input 
                      className={`w-full bg-transparent border-b ${theme.inputBorder} px-0 py-3 ${theme.text} placeholder:${theme.textSubtle} focus:outline-none ${theme.inputFocus} transition-colors duration-300`} 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      placeholder="utilisateur@entreprise.ma"
                      required 
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className={`text-[10px] ${theme.textMuted} uppercase tracking-[0.15em]`}>Mot de passe</label>
                    <div className="relative">
                      <input 
                        className={`w-full bg-transparent border-b ${theme.inputBorder} px-0 py-3 pr-10 ${theme.text} placeholder:${theme.textSubtle} focus:outline-none ${theme.inputFocus} transition-colors duration-300`} 
                        type={show ? 'text' : 'password'} 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="••••••••"
                        required 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShow(!show)} 
                        className={`absolute right-0 top-1/2 -translate-y-1/2 ${theme.textMuted} hover:${theme.textSecondary} transition-colors`}
                      >
                        {show ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className={`w-full mt-8 ${theme.accent} hover:opacity-90 ${theme.accentText} font-normal py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group`}
                  >
                    {loading ? (
                      <>
                        <div className={`w-4 h-4 border ${isDark ? 'border-white/30 border-t-white' : 'border-black/30 border-t-black'} rounded-full animate-spin`} />
                        <span className="text-sm tracking-wide">CONNEXION...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm tracking-[0.1em]">SE CONNECTER</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Accounts */}
                <div className={`mt-8 pt-6 ${theme.border} border-t`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-4 h-[1px] ${isDark ? 'bg-zinc-700' : 'bg-slate-300'}`} />
                    <span className={`${theme.textSubtle} text-[10px] uppercase tracking-[0.15em]`}>Comptes de démonstration</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      ['admin@gmpp.local', 'Admin123!', 'ADMIN'],
                      ['manager@gmpp.local', 'Manager123!', 'RESPONSABLE'],
                      ['tech@gmpp.local', 'Tech123!', 'TECHNICIEN'],
                    ].map(([e, p, r]) => (
                      <button 
                        key={e} 
                        onClick={() => { setEmail(e); setPassword(p) }}
                        className={`w-full flex items-center justify-between p-3 border ${theme.border} hover:${isDark ? 'border-zinc-700 bg-white/5' : 'border-slate-300 bg-slate-100'} transition-all group text-left`}
                      >
                        <span className={`text-xs ${theme.textMuted} group-hover:${theme.textSecondary} transition-colors font-light`}>{e}</span>
                        <span className={`text-[10px] ${theme.textSubtle} uppercase tracking-wider`}>{r}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className={`${theme.textSubtle} text-[10px] tracking-[0.1em] uppercase`}>
                © 2026 GMPP Suite — Tous droits réservés
              </p>
              <p className={`${isDark ? 'text-zinc-800' : 'text-slate-400'} text-[10px] mt-1 tracking-wide`}>
                Conçu et développé à Beni Mellal, Maroc
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
