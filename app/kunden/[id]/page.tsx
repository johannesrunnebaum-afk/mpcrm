import { getCustomerById, getContactsByCustomerId, getActivitiesByCustomerId, getOnboardingByCustomerId } from '@/lib/db'
import KundeDetailClient from './KundeDetailClient'

export default async function KundeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customerId = parseInt(id, 10)

  const [customer, contacts, activities, onboarding] = await Promise.all([
    getCustomerById(customerId),
    getContactsByCustomerId(customerId),
    getActivitiesByCustomerId(customerId),
    getOnboardingByCustomerId(customerId),
  ])

  if (!customer) {
    return <div style={{ padding: 28, color: '#6B6B6B' }}>Kunde nicht gefunden.</div>
  }

  return (
    <KundeDetailClient
      customer={customer}
      contacts={contacts}
      activities={activities}
      onboarding={onboarding}
    />
  )
}
