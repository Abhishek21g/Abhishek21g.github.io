'use client'

import AdminAuthGate from '@/components/admin/AdminAuthGate'
import AdminShell from '@/components/admin/AdminShell'
import MonitorTabs from '@/components/admin/MonitorTabs'

export default function AdminTrackingPage() {
  return (
    <AdminAuthGate>
      <AdminShell
        eyebrow="AE Admin"
        title="Tracking"
        description="Who's visiting enaguthi.com, from where, and how your trackable links are doing."
      >
        <MonitorTabs />
      </AdminShell>
    </AdminAuthGate>
  )
}
