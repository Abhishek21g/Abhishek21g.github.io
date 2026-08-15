'use client'

import AdminAuthGate from '@/components/admin/AdminAuthGate'
import AdminShell from '@/components/admin/AdminShell'
import CloudflareEdgeBoard from '@/components/admin/CloudflareEdgeBoard'
import TrackingBoard from '@/components/admin/TrackingBoard'

export default function AdminTrackingPage() {
  return (
    <AdminAuthGate>
      <AdminShell
        eyebrow="AE Admin"
        title="Tracking"
        description="Who's visiting enaguthi.com, from where, and how your trackable links are doing."
      >
        <div className="flex flex-col gap-10">
          <CloudflareEdgeBoard />
          <TrackingBoard />
        </div>
      </AdminShell>
    </AdminAuthGate>
  )
}
