"use client";

import { useEffect, useRef } from 'react';
import { 
  FileText, 
  Sparkles, 
  Clock, 
  BarChart3,
  Plus,
  AlertCircle
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

  // Calculate stats with safe handling
  const stats = calculateStats(documents);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl font-bold">AI Document Dashboard</h1>
          <p className="mt-2 text-blue-100">
            Generate and manage legal documents powered by artificial intelligence
          </p>
          <Button 
            className="mt-4 bg-white text-blue-600 hover:bg-blue-50"
            onClick={() => window.location.href='/documents/create'}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Document
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { 
            icon: FileText, 
            label: 'Total Documents', 
            value: total || stats.total,
            trend: 'All time',
            color: 'bg-blue-500/10 text-blue-600'
          },
          { 
            icon: Sparkles, 
            label: 'Generated Today', 
            value: stats.todayCount,
            trend: 'Today',
            color: 'bg-purple-500/10 text-purple-600'
          },
          { 
            icon: Clock, 
            label: 'In Progress', 
            value: stats.inProgress,
            trend: 'Active documents',
            color: 'bg-green-500/10 text-green-600'
          },
          { 
            icon: BarChart3, 
            label: 'Completed', 
            value: stats.completed,
            trend: 'Total completed',
            color: 'bg-orange-500/10 text-orange-600'
          }
        ].map((stat, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className={`inline-flex rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-2xl font-semibold">{stat.value || 0}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Documents */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent Documents</h2>
            <p className="text-sm text-muted-foreground">
              Your latest generated documents
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.location.href='/documents'}
          >
            View All Documents
          </Button>
        </div>

        {isLoading && !documents.length ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <p>{error.message}</p>
          </div>
        ) : !documents.length ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">No documents created yet</p>
              <Button 
                variant="link" 
                onClick={() => window.location.href='/documents/create'}
                className="mt-2"
              >
                Create your first document
              </Button>
            </div>
          </div>
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