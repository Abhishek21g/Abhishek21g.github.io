'use client'

import AdminAuthGate from '@/components/admin/AdminAuthGate'
import AdminShell from '@/components/admin/AdminShell'
import EntryBoard from '@/components/admin/EntryBoard'

export default function AdminNotesPage() {
  return (
    <AdminAuthGate>
      <AdminShell eyebrow="AE Admin" title="Notes" description="Anything else worth keeping.">
        <EntryBoard type="note" />
      </AdminShell>
    </AdminAuthGate>
  )
}
