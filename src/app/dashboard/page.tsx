// src/app/dashboard/page.tsx
import Link from 'next/link';



export default function DashboardPage() {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to LegalDraw</h1>
        <p className="text-gray-600">
          Get started by creating a new template or generating a document.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/templates"
            className="block p-6 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <h2 className="text-lg font-semibold text-blue-700">Templates</h2>
            <p className="mt-2 text-sm text-blue-600">
              Create and manage your document templates
            </p>
          </Link>
          <Link
            href="/dashboard/documents"
            className="block p-6 bg-green-50 rounded-lg hover:bg-green-100"
          >
            <h2 className="text-lg font-semibold text-green-700">Documents</h2>
            <p className="mt-2 text-sm text-green-600">
              Generate and manage your AI-powered documents
            </p>
          </Link>
        </div>
      </div>
    );
  }