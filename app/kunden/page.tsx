import { getCustomers } from '@/lib/db'
import KundenClient from './KundenClient'

export default async function KundenPage() {
  const customers = await getCustomers()
  return <KundenClient customers={customers} />
}
