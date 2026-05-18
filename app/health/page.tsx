import { getCustomers } from '@/lib/db'
import HealthClient from './HealthClient'

export default async function HealthPage() {
  const customers = await getCustomers()
  return <HealthClient customers={customers} />
}
