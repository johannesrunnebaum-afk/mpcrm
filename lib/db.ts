/**
 * All database access goes through this module.
 * Falls back to hardcoded demo data when NEXT_PUBLIC_SUPABASE_URL is not set,
 * so the app works during development before Supabase is configured.
 */

import { createClient } from './supabase/server'
import { CUSTOMERS, CONTACTS, ACTIVITIES, ONBOARDING_DATA } from './data'
import type { Customer, Contact, Activity, OnboardingEntry, OnboardingStep, Profile } from './types'

const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL

// ─── Row mappers ─────────────────────────────────────────────────────────────

function mapCustomer(row: Record<string, unknown>): Customer {
  return {
    id: row.id as number,
    name: row.name as string,
    initials: row.initials as string,
    color: row.color as string,
    plan: row.plan as Customer['plan'],
    mrr: row.mrr as number,
    health: row.health_score as number,
    status: row.status as Customer['status'],
    renewal: row.renewal_date as string,
    industry: row.industry as string,
    users: row.users_count as number,
    lastLogin: row.last_login as string,
    campaigns: row.campaigns as number,
    projects: row.projects as number,
    nps: row.nps as number,
  }
}

function mapContact(row: Record<string, unknown>): Contact {
  return {
    id: row.id as number,
    customerId: row.customer_id as number,
    name: row.name as string,
    role: row.role as string,
    email: row.email as string,
    phone: row.phone as string,
    initials: row.initials as string,
    color: row.color as string,
    lastContact: row.last_contact as string,
  }
}

function mapActivity(row: Record<string, unknown>): Activity {
  const dt = new Date(row.created_at as string)
  const date = dt.toISOString().split('T')[0]
  const time = dt.toTimeString().slice(0, 5)
  return {
    id: row.id as number,
    type: row.type as Activity['type'],
    customerId: row.customer_id as number,
    text: row.text as string,
    user: row.user_name as string,
    initials: row.initials as string,
    color: row.color as string,
    date,
    time,
  }
}

function mapOnboarding(row: Record<string, unknown>): OnboardingEntry {
  return {
    id: row.id as number,
    customerId: row.customer_id as number,
    phase: row.phase as string,
    steps: row.steps as OnboardingStep[],
  }
}

// ─── Profile ─────────────────────────────────────────────────────────────────

const DEFAULT_PROFILE: Profile = {
  id: 1, firstName: 'Johannes', lastName: 'Runnebaum',
  email: 'johannes.runnebaum@gmail.com', role: 'Admin',
  initials: 'JR', avatarColor: '#F59E0B', avatarUrl: null,
}

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: row.id as number,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    email: row.email as string,
    role: row.role as string,
    initials: row.initials as string,
    avatarColor: row.avatar_color as string,
    avatarUrl: (row.avatar_url as string) || null,
  }
}

export async function getProfile(): Promise<Profile> {
  if (!isConfigured) return DEFAULT_PROFILE
  const supabase = await createClient()
  const { data, error } = await supabase.from('profiles').select('*').eq('id', 1).single()
  if (error) return DEFAULT_PROFILE
  return mapProfile(data)
}

export async function updateProfile(input: Partial<Omit<Profile, 'id'>>): Promise<Profile> {
  const supabase = await createClient()
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (input.firstName !== undefined) patch.first_name = input.firstName
  if (input.lastName !== undefined) patch.last_name = input.lastName
  if (input.email !== undefined) patch.email = input.email
  if (input.role !== undefined) patch.role = input.role
  if (input.initials !== undefined) patch.initials = input.initials
  if (input.avatarColor !== undefined) patch.avatar_color = input.avatarColor
  if (input.avatarUrl !== undefined) patch.avatar_url = input.avatarUrl
  const { data, error } = await supabase
    .from('profiles').update(patch).eq('id', 1).select().single()
  if (error) throw new Error(error.message)
  return mapProfile(data)
}

// ─── Customers ───────────────────────────────────────────────────────────────

export async function getCustomers(): Promise<Customer[]> {
  if (!isConfigured) return CUSTOMERS
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name')
  if (error) return CUSTOMERS
  return data.map(mapCustomer)
}

export async function getCustomerById(id: number): Promise<Customer | null> {
  if (!isConfigured) return CUSTOMERS.find((c) => c.id === id) ?? null
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return mapCustomer(data)
}

export async function createCustomer(
  input: Omit<Customer, 'id'>,
): Promise<Customer> {
  if (!isConfigured) {
    const fake: Customer = { id: Date.now(), ...input }
    CUSTOMERS.push(fake)
    return fake
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('customers')
    .insert({
      name: input.name,
      initials: input.initials,
      color: input.color,
      plan: input.plan,
      mrr: input.mrr,
      health_score: input.health,
      status: input.status,
      renewal_date: input.renewal,
      last_login: input.lastLogin,
      users_count: input.users,
      campaigns: input.campaigns,
      projects: input.projects,
      nps: input.nps,
      industry: input.industry,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return mapCustomer(data)
}

export async function updateCustomer(
  id: number,
  input: Partial<Omit<Customer, 'id'>>,
): Promise<Customer> {
  if (!isConfigured) {
    const idx = CUSTOMERS.findIndex((c) => c.id === id)
    if (idx !== -1) Object.assign(CUSTOMERS[idx], input)
    return CUSTOMERS[idx] ?? { id, ...input } as Customer
  }
  const supabase = await createClient()
  const patch: Record<string, unknown> = {}
  if (input.name !== undefined) patch.name = input.name
  if (input.initials !== undefined) patch.initials = input.initials
  if (input.color !== undefined) patch.color = input.color
  if (input.plan !== undefined) patch.plan = input.plan
  if (input.mrr !== undefined) patch.mrr = input.mrr
  if (input.health !== undefined) patch.health_score = input.health
  if (input.status !== undefined) patch.status = input.status
  if (input.renewal !== undefined) patch.renewal_date = input.renewal
  if (input.lastLogin !== undefined) patch.last_login = input.lastLogin
  if (input.users !== undefined) patch.users_count = input.users
  if (input.campaigns !== undefined) patch.campaigns = input.campaigns
  if (input.projects !== undefined) patch.projects = input.projects
  if (input.nps !== undefined) patch.nps = input.nps
  if (input.industry !== undefined) patch.industry = input.industry
  const { data, error } = await supabase
    .from('customers')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return mapCustomer(data)
}

export async function deleteCustomer(id: number): Promise<void> {
  if (!isConfigured) {
    const idx = CUSTOMERS.findIndex((c) => c.id === id)
    if (idx !== -1) CUSTOMERS.splice(idx, 1)
    return
  }
  const supabase = await createClient()
  const { error } = await supabase.from('customers').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export async function getContactById(id: number): Promise<Contact | null> {
  if (!isConfigured) return CONTACTS.find((c) => c.id === id) ?? null
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return mapContact(data)
}

export async function getContacts(): Promise<Contact[]> {
  if (!isConfigured) return CONTACTS
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('name')
  if (error) return CONTACTS
  return data.map(mapContact)
}

export async function getContactsByCustomerId(
  customerId: number,
): Promise<Contact[]> {
  if (!isConfigured)
    return CONTACTS.filter((c) => c.customerId === customerId)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('customer_id', customerId)
    .order('name')
  if (error) return CONTACTS.filter((c) => c.customerId === customerId)
  return data.map(mapContact)
}

export async function createContact(
  input: Omit<Contact, 'id'>,
): Promise<Contact> {
  if (!isConfigured) {
    const fake: Contact = { id: Date.now(), ...input }
    CONTACTS.push(fake)
    return fake
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contacts')
    .insert({
      customer_id: input.customerId,
      name: input.name,
      role: input.role,
      email: input.email,
      phone: input.phone,
      initials: input.initials,
      color: input.color,
      last_contact: input.lastContact,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return mapContact(data)
}

export async function updateContact(
  id: number,
  input: Partial<Omit<Contact, 'id' | 'customerId'>>,
): Promise<Contact> {
  if (!isConfigured) {
    const idx = CONTACTS.findIndex((c) => c.id === id)
    if (idx !== -1) Object.assign(CONTACTS[idx], input)
    return CONTACTS[idx] ?? { id, ...input } as Contact
  }
  const supabase = await createClient()
  const patch: Record<string, unknown> = {}
  if (input.name !== undefined) patch.name = input.name
  if (input.role !== undefined) patch.role = input.role
  if (input.email !== undefined) patch.email = input.email
  if (input.phone !== undefined) patch.phone = input.phone
  if (input.initials !== undefined) patch.initials = input.initials
  if (input.color !== undefined) patch.color = input.color
  if (input.lastContact !== undefined) patch.last_contact = input.lastContact
  const { data, error } = await supabase
    .from('contacts')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return mapContact(data)
}

export async function deleteContact(id: number): Promise<void> {
  if (!isConfigured) {
    const idx = CONTACTS.findIndex((c) => c.id === id)
    if (idx !== -1) CONTACTS.splice(idx, 1)
    return
  }
  const supabase = await createClient()
  const { error } = await supabase.from('contacts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ─── Activities ──────────────────────────────────────────────────────────────

export async function getActivities(opts?: {
  limit?: number
}): Promise<Activity[]> {
  if (!isConfigured)
    return opts?.limit ? ACTIVITIES.slice(0, opts.limit) : ACTIVITIES
  const supabase = await createClient()
  let query = supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
  if (opts?.limit) query = query.limit(opts.limit)
  const { data, error } = await query
  if (error) return opts?.limit ? ACTIVITIES.slice(0, opts.limit) : ACTIVITIES
  return data.map(mapActivity)
}

export async function getActivitiesByCustomerId(
  customerId: number,
): Promise<Activity[]> {
  if (!isConfigured)
    return ACTIVITIES.filter((a) => a.customerId === customerId)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
  if (error) return ACTIVITIES.filter((a) => a.customerId === customerId)
  return data.map(mapActivity)
}

export async function createActivity(
  input: Omit<Activity, 'id' | 'date' | 'time'> & { createdAt?: string },
): Promise<Activity> {
  if (!isConfigured) {
    const now = input.createdAt ? new Date(input.createdAt) : new Date()
    const fake: Activity = {
      id: Date.now(), ...input,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
    }
    ACTIVITIES.unshift(fake)
    return fake
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activities')
    .insert({
      customer_id: input.customerId,
      type: input.type,
      text: input.text,
      user_name: input.user,
      initials: input.initials,
      color: input.color,
      ...(input.createdAt ? { created_at: input.createdAt } : {}),
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return mapActivity(data)
}

export async function deleteActivity(id: number): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('activities').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ─── Onboarding ──────────────────────────────────────────────────────────────

export async function getOnboardingData(): Promise<OnboardingEntry[]> {
  if (!isConfigured) return ONBOARDING_DATA
  const supabase = await createClient()
  const { data, error } = await supabase.from('onboarding').select('*')
  if (error) return ONBOARDING_DATA
  return data.map(mapOnboarding)
}

export async function getOnboardingByCustomerId(
  customerId: number,
): Promise<OnboardingEntry | null> {
  if (!isConfigured)
    return ONBOARDING_DATA.find((o) => o.customerId === customerId) ?? null
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('onboarding')
    .select('*')
    .eq('customer_id', customerId)
    .single()
  if (error) return null
  return mapOnboarding(data)
}

export async function upsertOnboarding(
  customerId: number,
  phase: string,
  steps: OnboardingStep[],
): Promise<OnboardingEntry> {
  if (!isConfigured) {
    const idx = ONBOARDING_DATA.findIndex((o) => o.customerId === customerId)
    const entry: OnboardingEntry = { id: idx >= 0 ? ONBOARDING_DATA[idx].id : Date.now(), customerId, phase, steps }
    if (idx >= 0) ONBOARDING_DATA[idx] = entry; else ONBOARDING_DATA.push(entry)
    return entry
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('onboarding')
    .upsert({ customer_id: customerId, phase, steps }, { onConflict: 'customer_id' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return mapOnboarding(data)
}
