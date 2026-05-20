import { getContactById, getCustomerById, getActivitiesByCustomerId } from '@/lib/db'
import KontaktDetailClient from './KontaktDetailClient'

export default async function KontaktDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contactId = parseInt(id, 10)

  const contact = await getContactById(contactId)
  if (!contact) {
    return <div style={{ padding: 28, color: '#6B7280' }}>Kontakt nicht gefunden.</div>
  }

  const [customer, activities] = await Promise.all([
    getCustomerById(contact.customerId),
    getActivitiesByCustomerId(contact.customerId),
  ])

  return <KontaktDetailClient contact={contact} customer={customer} activities={activities} />
}
