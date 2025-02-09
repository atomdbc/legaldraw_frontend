// src/app/documents/layout.tsx


import DashboardShell from '@/components/dashboard/DashboardShell';

export default function QuickDocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}