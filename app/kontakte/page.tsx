import { getContacts, getCustomers } from '@/lib/db'
import KontakteClient from './KontakteClient'

export default async function KontaktePage() {
  const [contacts, customers] = await Promise.all([getContacts(), getCustomers()])
  return <KontakteClient contacts={contacts} customers={customers} />
}
