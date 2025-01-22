"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  Clock, 
  BarChart3,
  Plus,
  AlertCircle,
  ArrowRight,
  Wand2,
  Activity,
  Rocket,
  Zap,
  BookOpen,
  Shield,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDocument } from "@/hooks/useDocument";
import DocumentPreview from '@/app/dashboard/DocumentPreview';
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Welcome Card */}
        <Card className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-0 shadow-xl">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/20 via-blue-500/20 to-sky-500/20 blur-[100px] rounded-full" />
          </div>
          
          <CardContent className="relative p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
                  <Zap className="h-3.5 w-3.5 mr-1" />
                  AI-Powered
                </Badge>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  Pro Enabled
                </Badge>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white">
                Welcome back to LegalDraw
              </h1>
              
              <p className="text-lg text-gray-300 max-w-lg">
                Create, manage, and analyze legal documents with the power of advanced AI. 
                Start by creating a new document.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button 
                  size="lg"
                  onClick={() => window.location.href='/documents/create'}
                  className="bg-white hover:bg-gray-100 text-gray-900"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Document
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  onClick={() => window.location.href='/documents'}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Documents
                </Button>
              </div>
            </div>

            {stats.total > 0 && (
              <div className="mt-8 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <span className="text-gray-400">Completion Rate</span>
                  <span className="font-semibold text-white">
                    {((stats.completed / stats.total) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-400">Generated Today</span>
                  <span className="font-semibold text-white">{stats.todayCount}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="bg-white border border-gray-100 shadow-xl">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-200"
              onClick={() => window.location.href='/documents/create'}
            >
              <div className="bg-blue-50 p-2 rounded-lg mr-3">
                <Sparkles className="h-4 w-4 text-blue-500" />
              </div>
              <span>Generate New Document</span>
              <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
            </Button>
            <Button 
              variant="outline"
              className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-200"
              onClick={() => window.location.href='/documents'}
            >
              <div className="bg-purple-50 p-2 rounded-lg mr-3">
                <FileText className="h-4 w-4 text-purple-500" />
              </div>
              <span>Browse Documents</span>
              <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
            </Button>
            <Button 
              variant="outline"
              className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-200"
              onClick={() => window.location.href='/documents'}
            >
              <div className="bg-emerald-50 p-2 rounded-lg mr-3">
                <Shield className="h-4 w-4 text-emerald-500" />
              </div>
              <span>Review Documents</span>
              <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
            </Button>

            {stats.total > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="rounded-lg bg-gray-50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                      {((stats.completed / stats.total) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Documents</span>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      {stats.inProgress}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Total Documents"
          value={total || stats.total}
          trend="All time"
          icon={FileText}
          trendValue={"+5%"}
          trendUp={true}
          color="blue"
        />
        <StatsCard
          label="Generated Today"
          value={stats.todayCount}
          trend="vs. yesterday"
          icon={Sparkles}
          trendValue={"+2"}
          trendUp={true}
          color="purple"
        />
        <StatsCard
          label="In Progress"
          value={stats.inProgress}
          trend="Active drafts"
          icon={Clock}
          trendValue={stats.inProgress}
          color="amber"
        />
        <StatsCard
          label="Completed"
          value={stats.completed}
          trend="Success rate"
          icon={BarChart3}
          trendValue={`${((stats.completed / (stats.total || 1)) * 100).toFixed(0)}%`}
          color="emerald"
        />
      </div>

      {/* Recent Documents */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Recent Documents</h2>
            <p className="text-gray-500 mt-1">Your latest document activity</p>
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
          <DocumentsLoadingState />
        ) : error ? (
          <DocumentsErrorState error={error} />
        ) : !documents.length ? (
          <DocumentsEmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {documents.slice(0, 3).map((doc, index) => (
              <DocumentCard key={doc.document_id} document={doc} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Stats Card Component
function StatsCard({ 
  label, 
  value, 
  trend, 
  icon: Icon, 
  trendValue, 
  trendUp, 
  color 
}: {
  label: string;
  value: number;
  trend: string;
  icon: any;
  trendValue: string;
  trendUp?: boolean;
  color: 'blue' | 'purple' | 'amber' | 'emerald';
}) {
  const colors = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      light: 'text-blue-500',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
      light: 'text-purple-500',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      light: 'text-amber-500',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      light: 'text-emerald-500',
    },
  };

  const colorClasses = colors[color];

  return (
    <Card className="relative overflow-hidden border-gray-100 bg-white shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`rounded-xl p-2.5 ${colorClasses.bg} ${colorClasses.border}`}>
            <Icon className={`w-5 h-5 ${colorClasses.text}`} />
          </div>
          {trendValue && (
            <div className="flex items-center text-sm">
              {trendUp !== undefined && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={trendUp ? 'text-emerald-500' : 'text-gray-500'}
                >
                  {trendUp ? '↑' : '•'}
                </motion.div>
              )}
              <span className={`ml-1 font-medium ${trendUp ? 'text-emerald-600' : 'text-gray-600'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          <div className="flex items-center justify-between mt-1">
            <div className="text-sm font-medium text-gray-600">{label}</div>
            <div className="text-xs text-gray-400">{trend}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Document Card Component
function DocumentCard({ document, index }: { document: DocumentResponse; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <DocumentPreview document={document} />
    </motion.div>
  );
}

// Loading State Component
function DocumentsLoadingState() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-gray-100 shadow-xl">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-gray-200" />
                <div className="h-4 w-20 rounded bg-gray-200" />
              </div>
              <div>
                <div className="h-6 w-1/3 rounded bg-gray-200" />
                <div className="mt-2 space-y-2">
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Error State Component
function DocumentsErrorState({ error }: { error: Error }) {
  return (
    <Card className="border-gray-100 shadow-xl">
      <CardContent className="p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-red-50 p-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Documents</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md">
            {error.message || "An error occurred while loading your documents. Please try again later."}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-6"
          >
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function DocumentsEmptyState() {
  return (
    <Card className="border-gray-100 shadow-xl">
      <CardContent className="p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Documents Yet</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md">
            Get started by creating your first document or exploring our templates.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <Button 
              onClick={() => window.location.href='/documents/create'}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Document
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href='/documents'}
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Browse Documents
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}