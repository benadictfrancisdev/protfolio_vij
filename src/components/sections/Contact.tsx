import { useState, type FormEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Github, Linkedin, Loader2, Mail, Send } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { personal } from '@/data/personal'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface FormValues {
  name: string
  email: string
  subject: string
  message: string
}

const EMPTY: FormValues = { name: '', email: '', subject: '', message: '' }

export function Contact() {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [usedFallback, setUsedFallback] = useState(false)

  function validate(v: FormValues) {
    const next: Partial<Record<keyof FormValues, string>> = {}
    if (!v.name.trim()) next.name = 'Please enter your name.'
    if (!v.email.trim()) next.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) next.email = 'Please enter a valid email.'
    if (!v.subject.trim()) next.subject = 'Please add a subject.'
    if (!v.message.trim()) next.message = 'Please write a message.'
    else if (v.message.trim().length < 10) next.message = 'Message should be at least 10 characters.'
    return next
  }

  function update(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    if (status !== 'idle') setStatus('idle')
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('loading')
    setUsedFallback(false)

    try {
      const endpoint = import.meta.env.VITE_FORM_ENDPOINT
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(values),
        })
        if (!res.ok) throw new Error('Request failed')
        setStatus('success')
        setValues(EMPTY)
      } else {
        const subject = encodeURIComponent(values.subject || 'Portfolio enquiry')
        const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`)
        window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`
        setUsedFallback(true)
        setStatus('success')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section section-dark relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-white/[0.03] to-transparent" />
      <Container>
        <div className="mb-4 overflow-hidden">
          <Reveal>
            <p className="font-display text-[clamp(3rem,12vw,8rem)] uppercase leading-[0.85] tracking-tight text-white/[0.07]">
              Let&apos;s Connect
            </p>
          </Reveal>
        </div>
        <SectionHeading
          index="09"
          label="Contact"
          title="Let's Build Something Intelligent."
          description="Open to AI/ML roles, research collaborations and interesting problems. Send a note and I'll get back to you."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="space-y-3">
                <a
                  href={`mailto:${personal.email}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-accent/40"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-accent">
                    <Mail size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Email</span>
                    <span className="block truncate text-sm text-text">{personal.email}</span>
                  </span>
                </a>

                {personal.linkedin && (
                  <a
                    href={personal.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-accent/40"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-accent">
                      <Linkedin size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">LinkedIn</span>
                      <span className="block truncate text-sm text-text">{personal.linkedinHandle}</span>
                    </span>
                  </a>
                )}

                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-accent/40"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-accent">
                      <Github size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">GitHub</span>
                      <span className="block truncate text-sm text-text">{personal.githubHandle}</span>
                    </span>
                  </a>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted">
                Prefer email? Write to{' '}
                <a href={`mailto:${personal.email}`} className="text-accent underline-offset-4 hover:underline">
                  {personal.email}
                </a>{' '}
                and I&apos;ll respond as soon as possible.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <form
                onSubmit={onSubmit}
                noValidate
                className="group/form rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-shadow duration-500 hover:shadow-[0_0_60px_rgba(200,255,0,0.05)] sm:p-8"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <FieldShell label="Name" htmlFor="name" error={errors.name}>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Your name"
                      className={inputClass(!!errors.name)}
                    />
                  </FieldShell>
                  <FieldShell label="Email" htmlFor="email" error={errors.email}>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass(!!errors.email)}
                    />
                  </FieldShell>
                </div>

                <div className="mt-5">
                  <FieldShell label="Subject" htmlFor="subject" error={errors.subject}>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={values.subject}
                      onChange={(e) => update('subject', e.target.value)}
                      placeholder="Project inquiry"
                      className={inputClass(!!errors.subject)}
                    />
                  </FieldShell>
                </div>

                <div className="mt-5">
                  <FieldShell label="Message" htmlFor="message" error={errors.message}>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={values.message}
                      onChange={(e) => update('message', e.target.value)}
                      placeholder="Tell me about your idea, role or collaboration..."
                      className={inputClass(!!errors.message)}
                    />
                  </FieldShell>
                </div>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-black transition-colors hover:bg-white disabled:pointer-events-none disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        Send Message <Send size={16} />
                      </>
                    )}
                  </button>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    Your details stay private
                  </span>
                </div>

                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm text-text"
                    role="status"
                  >
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" />
                    <span>
                      {usedFallback
                        ? 'Your email app has been opened — please send the message to complete it.'
                        : 'Thank you — your message has been sent. I will get back to you soon.'}
                    </span>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-text"
                    role="alert"
                  >
                    <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
                    <span>Something went wrong. Please try again or email me directly.</span>
                  </motion.div>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}

function inputClass(hasError: boolean) {
  return [
    'w-full rounded-xl border bg-white/[0.02] px-4 py-3 text-sm text-text placeholder:text-muted/60 transition-colors focus:outline-none focus:ring-1',
    hasError
      ? 'border-red-500/50 focus:border-red-400 focus:ring-red-400/40'
      : 'border-white/10 focus:border-accent/60 focus:ring-accent/40',
  ].join(' ')
}

function FieldShell({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
}
