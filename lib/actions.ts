'use server'

import { revalidatePath } from 'next/cache'
import {
  createCustomer, updateCustomer, deleteCustomer,
  createContact, updateContact, deleteContact,
  createActivity, upsertOnboarding, updateProfile,
} from './db'
import { sendEmail } from './email'
import type { Customer, Contact, Activity, OnboardingStep, Profile } from './types'

// ─── Customers ───────────────────────────────────────────────────────────────

export async function actionCreateCustomer(input: Omit<Customer, 'id'>) {
  await createCustomer(input)
  revalidatePath('/', 'layout')
}

export async function actionUpdateCustomer(id: number, input: Partial<Omit<Customer, 'id'>>) {
  await updateCustomer(id, input)
  revalidatePath('/', 'layout')
}

export async function actionDeleteCustomer(id: number) {
  await deleteCustomer(id)
  revalidatePath('/', 'layout')
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export async function actionCreateContact(input: Omit<Contact, 'id'>) {
  await createContact(input)
  revalidatePath('/', 'layout')
}

export async function actionUpdateContact(id: number, input: Partial<Omit<Contact, 'id' | 'customerId'>>) {
  await updateContact(id, input)
  revalidatePath('/', 'layout')
}

export async function actionDeleteContact(id: number) {
  await deleteContact(id)
  revalidatePath('/', 'layout')
}

// ─── Activities ──────────────────────────────────────────────────────────────

export async function actionCreateActivity(
  input: Omit<Activity, 'id' | 'date' | 'time'>,
) {
  await createActivity(input)
  revalidatePath('/', 'layout')
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function actionUpdateProfile(input: Partial<Omit<Profile, 'id'>>) {
  await updateProfile(input)
  revalidatePath('/', 'layout')
}

// ─── Email ───────────────────────────────────────────────────────────────────

export async function actionSendEmail(input: {
  customerId: number
  toEmail: string
  toName: string
  subject: string
  body: string
  fromName: string
  replyTo?: string
}): Promise<void> {
  await sendEmail({
    to: input.toEmail,
    toName: input.toName,
    subject: input.subject,
    body: input.body,
    fromName: input.fromName,
    replyTo: input.replyTo,
  })
  // Auto-log as activity
  await createActivity({
    customerId: input.customerId,
    type: 'email',
    text: `E-Mail an ${input.toName} (${input.toEmail}): „${input.subject}"`,
    user: input.fromName,
    initials: input.fromName.split(' ').filter(Boolean).map((w: string) => w[0].toUpperCase()).join('').slice(0, 2),
    color: '#6366F1',
  })
  revalidatePath('/', 'layout')
}

// ─── Onboarding ──────────────────────────────────────────────────────────────

export async function actionUpsertOnboarding(
  customerId: number,
  phase: string,
  steps: OnboardingStep[],
) {
  await upsertOnboarding(customerId, phase, steps)
  revalidatePath('/', 'layout')
}
