import { getActivities, getCustomers } from '@/lib/db'
import KommunikationClient from './KommunikationClient'

export default async function KommunikationPage() {
  const [activities, customers] = await Promise.all([getActivities(), getCustomers()])
  return <KommunikationClient activities={activities} customers={customers} />
}
