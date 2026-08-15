'use client'

import AdminAuthGate from '@/components/admin/AdminAuthGate'
import AdminShell from '@/components/admin/AdminShell'
import EntryBoard from '@/components/admin/EntryBoard'

export default function AdminTravelPage() {
  return (
    <AdminAuthGate>
      <AdminShell
        eyebrow="AE Admin"
        title="Travel plans"
        description="Where I'm going, when, and what's still up in the air."
      >
        <EntryBoard type="travel" />
      </AdminShell>
    </AdminAuthGate>
  )
}
