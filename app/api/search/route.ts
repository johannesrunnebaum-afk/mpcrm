import { NextRequest, NextResponse } from 'next/server'
import { getCustomers, getContacts, getActivities } from '@/lib/db'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.toLowerCase().trim() || ''
  if (q.length < 2) return NextResponse.json({ customers: [], contacts: [], activities: [] })

  const [customers, contacts, activities] = await Promise.all([
    getCustomers(),
    getContacts(),
    getActivities({ limit: 200 }),
  ])

  return NextResponse.json({
    customers: customers
      .filter((c) => c.name.toLowerCase().includes(q) || (c.industry || '').toLowerCase().includes(q))
      .slice(0, 5),
    contacts: contacts
      .filter((c) => c.name.toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q) || (c.role || '').toLowerCase().includes(q))
      .slice(0, 5),
    activities: activities
      .filter((a) => a.text.toLowerCase().includes(q) || a.user.toLowerCase().includes(q))
      .slice(0, 3),
  })
}
