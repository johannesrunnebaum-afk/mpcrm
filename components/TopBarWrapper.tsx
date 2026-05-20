import { getProfile } from '@/lib/db'
import TopBar from './TopBar'

export default async function TopBarWrapper() {
  const profile = await getProfile()
  return <TopBar profile={profile} />
}
