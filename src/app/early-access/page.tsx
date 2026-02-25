'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EarlyAccessPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      const { error: supabaseError } = await supabase
        .from('emails')
        .insert([{ email }])

      if (supabaseError) {
        if (supabaseError.code === '23505') {
          setError('This email is already on the waitlist')
        } else {
          setError('Something went wrong. Please try again.')
          console.error('Supabase error:', supabaseError)
        }
        return
      }

      setSubmitted(true)

      setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          router.push('/')
        }, 500)
      }, 1200)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('Error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-charcoal text-cream flex items-center justify-center px-6">
      <div className={`relative z-10 w-full max-w-sm transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-cream/40 hover:text-cream/70 transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>

        <div className="mb-10">
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-2">Join the Waitlist</h1>
          <p className="text-cream/40 text-sm leading-relaxed">
            Be the first to read with Badger.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="you@example.com"
              required
              autoComplete="off"
              className={`w-full px-4 py-3 bg-transparent rounded-xl text-cream text-sm placeholder:text-cream/25 focus:outline-none transition-all [&:-webkit-autofill]:[-webkit-text-fill-color:#f2f0e9] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#14120b_inset] ${
                error
                  ? 'border border-red-500/40 focus:border-red-500/60'
                  : 'border border-cream/10 focus:border-copper/50'
              }`}
            />
            {error && (
              <p className="mt-2 text-xs text-red-400">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitted}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              submitted
                ? 'bg-copper/20 text-copper cursor-default'
                : 'bg-cream text-charcoal hover:bg-cream/90'
            }`}
          >
            {submitted ? (
              <>
                <CheckCircle className="w-4 h-4" />
                You&apos;re on the list
              </>
            ) : (
              'Submit'
            )}
          </button>
        </form>

        <p className="text-[11px] text-cream/20 mt-6 text-center">
          We&apos;ll notify you when Badger is ready.
        </p>
      </div>
    </div>
  )
}
