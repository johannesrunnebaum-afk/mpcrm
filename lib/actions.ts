'use server'

import { revalidatePath } from 'next/cache'
import {
  createCustomer, updateCustomer, deleteCustomer,
  createContact, updateContact, deleteContact,
  createActivity, upsertOnboarding, updateProfile,
} from './db'
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

// ─── Onboarding ──────────────────────────────────────────────────────────────

export async function actionUpsertOnboarding(
  customerId: number,
  phase: string,
  steps: OnboardingStep[],
) {
  await upsertOnboarding(customerId, phase, steps)
  revalidatePath('/', 'layout')
}
