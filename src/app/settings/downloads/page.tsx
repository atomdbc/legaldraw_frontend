// src/app/settings/downloads/page.tsx
import { Metadata } from "next"
import DownloadHistoryClient from "./DownloadHistoryClient"

export const metadata: Metadata = {
  title: "Downloads | Settings",
  description: "Manage your document downloads and view history",
}

export default function DownloadsPage() {
  return <DownloadHistoryClient />
}