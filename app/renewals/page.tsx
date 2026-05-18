import { getCustomers } from '@/lib/db'
import RenewalsClient from './RenewalsClient'

export default async function RenewalsPage() {
  const customers = await getCustomers()
  return <RenewalsClient customers={customers} />
}
