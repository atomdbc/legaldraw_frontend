"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Sparkles, 
  Clock, 
  BarChart3,
  Plus,
  AlertCircle,
  ArrowRight,
  Shield,
  Activity,
  Rocket,
  Zap,
  BookOpen,
  ChevronRight,
  CheckCircle,
  FileEdit,
  Settings,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDocument } from "@/hooks/useDocument";
import DocumentPreview from '@/app/dashboard/DocumentPreview';
import { Badge } from "@/components/ui/badge";
import type { DocumentResponse } from '@/types/document';

// Types
interface StatsType {
  total: number;
  todayCount: number;
  inProgress: number;
  completed: number;
  completionRate: string;
}

// Utility Functions
const calculateStats = (documents: DocumentResponse[]): StatsType => {
  if (!Array.isArray(documents)) {
    return { 
      total: 0, 
      todayCount: 0, 
      inProgress: 0, 
      completed: 0,
      completionRate: "0"
    };
  }
  
  const today = new Date().toDateString();
  const total = documents.length;
  const completed = documents.filter(doc => doc?.status === 'COMPLETED').length;
  
  return {
    total,
    todayCount: documents.filter(doc => 
      doc?.generated_at && new Date(doc.generated_at).toDateString() === today
    ).length,
    inProgress: documents.filter(doc => doc?.status === 'IN_PROGRESS').length,
    completed,
    completionRate: total > 0 ? ((completed / total) * 100).toFixed(0) : "0"
  };
};

// Component: Welcome Banner
const WelcomeBanner = ({ stats }: { stats: StatsType }) => (
  <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-0 shadow-xl">
    <div className="absolute inset-0">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/20 via-blue-500/20 to-sky-500/20 blur-[100px] rounded-full" />
    </div>
    
    <CardContent className="relative p-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
            <Zap className="h-3.5 w-3.5 mr-1" />
            AI-Powered
          </Badge>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
            Pro Enabled
          </Badge>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Create Perfect Documents
          </h1>
          
          <p className="text-lg text-gray-300 max-w-xl">
            Transform your workflow with AI-powered document generation. Create, manage, 
            and analyze documents with unprecedented efficiency.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button 
            size="lg"
            onClick={() => window.location.href='/documents/create'}
            className="bg-white hover:bg-gray-100 text-gray-900 gap-2"
          >
            <Plus className="h-4 w-4" />
            New Document
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2"
            onClick={() => window.location.href='/documents'}
          >
            <BookOpen className="h-4 w-4" />
            Browse Library
          </Button>
        </div>

        {stats.total > 0 && (
          <div className="flex flex-wrap items-center gap-6 pt-4 mt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span className="text-gray-400">Success Rate</span>
              <span className="font-semibold text-white">
                {stats.completionRate}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-blue-400" />
              <span className="text-gray-400">Today's Documents</span>
              <span className="font-semibold text-white">{stats.todayCount}</span>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

// Component: Quick Actions
const QuickActions = ({ stats }: { stats: StatsType }) => (
  <Card className="bg-white border border-gray-100 shadow-xl">
    <CardHeader>
      <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
    </CardHeader>
    <CardContent className="space-y-4">
      <QuickActionButton
        icon={<Sparkles className="h-4 w-4 text-blue-500" />}
        label="New Document"
        href="/documents/create"
        bgColor="bg-blue-50"
      />
      <QuickActionButton
        icon={<FileEdit className="h-4 w-4 text-purple-500" />}
        label="Recent Documents"
        href="/documents"
        bgColor="bg-purple-50"
      />
      <QuickActionButton
        icon={<Shield className="h-4 w-4 text-emerald-500" />}
        label="Review & Validate"
        href="/documents/review"
        bgColor="bg-emerald-50"
      />
      <QuickActionButton
        icon={<Settings className="h-4 w-4 text-gray-500" />}
        label="Settings"
        href="/settings"
        bgColor="bg-gray-50"
      />

      {stats.total > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="rounded-lg bg-gray-50 p-4 space-y-3">
            <StatsRow 
              label="Success Rate"
              value={`${stats.completionRate}%`}
              bgColor="bg-emerald-50"
              textColor="text-emerald-700"
            />
            <StatsRow 
              label="Active Documents"
              value={stats.inProgress.toString()}
              bgColor="bg-blue-50"
              textColor="text-blue-700"
            />
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

// Component: Quick Action Button
const QuickActionButton = ({ 
  icon, 
  label, 
  href, 
  bgColor 
}: { 
  icon: React.ReactNode;
  label: string;
  href: string;
  bgColor: string;
}) => (
  <Button 
    variant="outline" 
    className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-200"
    onClick={() => window.location.href = href}
  >
    <div className={`${bgColor} p-2 rounded-lg mr-3`}>
      {icon}
    </div>
    <span>{label}</span>
    <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
  </Button>
);

// Component: Stats Row
const StatsRow = ({ 
  label, 
  value, 
  bgColor, 
  textColor 
}: { 
  label: string;
  value: string;
  bgColor: string;
  textColor: string;
}) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-600">{label}</span>
    <Badge variant="secondary" className={`${bgColor} ${textColor}`}>
      {value}
    </Badge>
  </div>
);

// Component: Stats Card
const StatsCard = ({ 
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
}) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative overflow-hidden bg-white border-gray-100 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className={`rounded-xl p-2.5 ${colors[color]}`}>
              <Icon className="w-5 h-5" />
            </div>
            {trendValue && (
              <div className="flex items-center text-sm">
                {trendUp !== undefined && (
                  <span className={trendUp ? 'text-emerald-500' : 'text-gray-500'}>
                    {trendUp ? '↑' : '•'}
                  </span>
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
    </motion.div>
  );
};

// Component: Document Card
const DocumentCard = ({ document, index }: { document: DocumentResponse; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
  >
    <DocumentPreview document={document} />
  </motion.div>
);

// Component: Loading State
const DocumentsLoadingState = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="border-gray-100 shadow-xl">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Using rounded div instead of empty image */}
                <div className="h-10 w-10 rounded-lg bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 w-20 rounded bg-gray-200" />
                  <div className="h-3 w-16 rounded bg-gray-200" />
                </div>
              </div>
              <div className="h-6 w-16 rounded-full bg-gray-200" />
            </div>
            <div className="pt-4 space-y-3">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
            </div>
            <div className="pt-2 flex justify-between items-center">
              <div className="h-8 w-24 rounded-md bg-gray-200" />
              <div className="h-8 w-8 rounded-full bg-gray-200" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Component: Error State
const DocumentsErrorState = ({ error }: { error: Error }) => (
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

// Component: Empty State
const DocumentsEmptyState = () => (
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
            Browse Templates
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Component: Stats Grid
const StatsGrid = ({ stats }: { stats: StatsType }) => {
  const statCards = [
    {
      label: "Total Documents",
      value: stats.total,
      trend: "All time",
      icon: FileText,
      trendValue: "+5%",
      trendUp: true,
      color: "blue"
    },
    {
      label: "Created Today",
      value: stats.todayCount,
      trend: "vs. yesterday",
      icon: Sparkles,
      trendValue: "+2",
      trendUp: true,
      color: "purple"
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      trend: "Active drafts",
      icon: Clock,
      trendValue: stats.inProgress.toString(),
      color: "amber"
    },
    {
      label: "Completed",
      value: stats.completed,
      trend: "Success rate",
      icon: CheckCircle,
      trendValue: `${stats.completionRate}%`,
      color: "emerald"
    }
  ];

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <StatsCard key={index} {...card} />
      ))}
    </div>
  );
};

// Main Dashboard Component
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-8"
    >
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WelcomeBanner stats={stats} />
        </div>
        <QuickActions stats={stats} />
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} />

      {/* Recent Documents Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
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
            View Library
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Conditional Rendering based on State */}
        {isLoading && !documents.length ? (
          <DocumentsLoadingState />
        ) : error ? (
          <DocumentsErrorState error={error} />
        ) : !documents.length ? (
          <DocumentsEmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {documents.slice(0, 3).map((doc, index) => (
              <DocumentCard 
                key={doc.document_id} 
                document={doc} 
                index={index} 
              />
            ))}
          </div>
        )}
      </motion.section>

      {/* Recent Activity Section */}
      <motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.4 }}
>
  <Card className="border-gray-100 shadow-xl">
    <CardHeader>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Activity Feed</h2>
      </div>
    </CardHeader>
    <CardContent>
      {documents.length > 0 ? (
        <div className="space-y-4">
          {documents.slice(0, 5).map((doc) => (
            <div 
              key={doc.document_id}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => window.location.href = `/documents/${doc.document_id}`}
            >
              <div className="rounded-full bg-blue-50 p-2">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.title || doc.document_type?.replace('_', ' ') || 'New Document'}
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date(doc.generated_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {doc.description || `${doc.document_type?.replace('_', ' ')} document`}
                </p>
              </div>
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs",
                  doc.status === 'COMPLETED' 
                    ? "bg-emerald-50 text-emerald-700" 
                    : "bg-amber-50 text-amber-700"
                )}
              >
                {doc.status}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500">No recent activity</p>
        </div>
      )}
    </CardContent>
  </Card>
</motion.section>
    </motion.div>
  );
}