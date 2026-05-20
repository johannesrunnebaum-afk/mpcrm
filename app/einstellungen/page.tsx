import { getProfile } from '@/lib/db'
import EinstellungenClient from './EinstellungenClient'

export default async function EinstellungenPage() {
  const profile = await getProfile()
  return <EinstellungenClient profile={profile} />
}
