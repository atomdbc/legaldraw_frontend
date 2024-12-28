"use client";

import { useEffect, useRef } from 'react';
import { 
  FileText, 
  Sparkles, 
  Clock, 
  BarChart3,
  Plus,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDocument } from "@/hooks/useDocument";
import DocumentPreview from '@/app/dashboard/DocumentPreview';
import type { DocumentResponse } from '@/types/document';

const calculateStats = (documents: DocumentResponse[]) => {
  if (!Array.isArray(documents)) return { total: 0, todayCount: 0, inProgress: 0, completed: 0 };
  
  const today = new Date().toDateString();
  
  return {
    total: documents.length,
    todayCount: documents.filter(doc => 
      doc?.generated_at && new Date(doc.generated_at).toDateString() === today
    ).length,
    inProgress: documents.filter(doc => 
      doc?.status === 'IN_PROGRESS'
    ).length,
    completed: documents.filter(doc => 
      doc?.status === 'COMPLETED'
    ).length
  };
};

export default function DashboardPage() {
  const { 
    documents, 
    total,
    isLoading, 
    error, 
    fetchDocuments
  } = useDocument();

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchDocuments(0, 3);
      hasFetched.current = true;
    }
  }, [fetchDocuments]);

  const stats = calculateStats(documents);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="relative overflow-hidden bg-zinc-900 p-8 text-white">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to LegalDraw</h1>
          <p className="mt-2 text-zinc-300">
            Create professional legal documents in minutes with AI assistance
          </p>
          <Button 
            className="mt-6 bg-white text-zinc-900 hover:bg-zinc-100"
            onClick={() => window.location.href='/documents/create'}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Document
          </Button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-zinc-800 to-transparent" />
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { 
            icon: FileText, 
            label: 'Total Documents', 
            value: total || stats.total,
            trend: 'All time'
          },
          { 
            icon: Sparkles, 
            label: 'Generated Today', 
            value: stats.todayCount,
            trend: 'Today'
          },
          { 
            icon: Clock, 
            label: 'In Progress', 
            value: stats.inProgress,
            trend: 'Active documents'
          },
          { 
            icon: BarChart3, 
            label: 'Completed', 
            value: stats.completed,
            trend: 'Total completed'
          }
        ].map((stat, i) => (
          <Card key={i} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="inline-flex rounded-lg p-2.5 bg-zinc-100">
                <stat.icon className="h-5 w-5 text-zinc-900" />
              </div>
              <p className="mt-4 text-2xl font-semibold text-zinc-900">{stat.value || 0}</p>
              <p className="text-sm text-zinc-600">{stat.label}</p>
              <p className="mt-1 text-xs text-zinc-500">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Documents */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Recent Documents</h2>
            <p className="text-sm text-zinc-500">
              Your latest generated documents
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.location.href='/documents'}
            className="group gap-2"
          >
            View All Documents
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {isLoading && !documents.length ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-900 border-t-transparent" />
          </div>
        ) : error ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <AlertCircle className="h-8 w-8 text-zinc-400" />
              <p className="text-zinc-600">{error.message}</p>
            </div>
          </Card>
        ) : !documents.length ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="rounded-full bg-zinc-100 p-3">
                <FileText className="h-6 w-6 text-zinc-900" />
              </div>
              <div>
                <p className="text-zinc-600">No documents created yet</p>
                <Button 
                  variant="link" 
                  onClick={() => window.location.href='/documents/create'}
                  className="mt-2 text-zinc-900"
                >
                  Create your first document
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.slice(0, 3).map((doc) => (
              <DocumentPreview key={doc.document_id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}