export type Plan = 'Starter' | 'Pro' | 'Business'
export type CustomerStatus = 'Aktiv' | 'Gefährdet'
export type ActivityType = 'email' | 'call' | 'note' | 'system'

export interface Customer {
  id: number
  name: string
  initials: string
  color: string
  plan: Plan
  mrr: number
  health: number
  status: CustomerStatus
  renewal: string
  industry: string
  users: number
  lastLogin: string
  campaigns: number
  projects: number
  nps: number
}

export interface Contact {
  id: number
  customerId: number
  name: string
  role: string
  email: string
  phone: string
  initials: string
  color: string
  lastContact: string
}

export interface Activity {
  id: number
  type: ActivityType
  customerId: number
  text: string
  user: string
  initials: string
  color: string
  date: string
  time: string
}

export interface OnboardingStep {
  name: string
  done: boolean
}

export interface OnboardingEntry {
  id: number
  customerId: number
  phase: string
  steps: OnboardingStep[]
}
