'use client';

import { useEffect, useState } from 'react';
import { useDocument } from '@/hooks/useDocument';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  FileText,
  AlertCircle,
  Calendar,
  Download,
  MoreHorizontal,
  Filter
} from "lucide-react";
import { format } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DocumentsPage() {
  const { documents, isLoading, error, fetchDocuments } = useDocument();
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('grid');

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const filteredDocuments = documents.filter(doc =>
    doc.document_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const documentsByMonth = filteredDocuments.reduce<Record<string, typeof filteredDocuments>>((acc, doc) => {
    const monthYear = format(new Date(doc.generated_at), 'MMMM yyyy');
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(doc);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Section */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">Documents</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {documents.length} total documents
              </p>
            </div>
            <Button onClick={() => window.location.href='/documents/create'}>
              <Plus className="mr-2 h-4 w-4" />
              New Document
            </Button>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-4 mt-6 pb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs value={view} onValueChange={setView} className="hidden md:block">
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <p>{error.message}</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 bg-white rounded-lg border">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">No documents found</h3>
              <p className="text-muted-foreground">Create your first document or try a different search</p>
              <Button 
                variant="outline"
                onClick={() => window.location.href='/documents/create'}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Document
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(documentsByMonth).map(([monthYear, docs]) => (
              <div key={monthYear} className="space-y-4">
                <h2 className="text-lg font-semibold sticky top-[144px] bg-gray-50/90 py-2 backdrop-blur-sm">
                  {monthYear}
                </h2>
                <div className={view === 'grid' ? 
                  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : 
                  "space-y-4"
                }>
                  {docs.map((doc) => (
                    <div
                      key={doc.document_id}
                      className="group bg-white rounded-lg border hover:shadow-lg transition-all"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{doc.document_type}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {format(new Date(doc.generated_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => window.location.href=`/documents/${doc.document_id}`}>
                                View Document
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="border-t p-4 bg-gray-50/50">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {doc.template_id}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.location.href=`/documents/${doc.document_id}`}
                          >
                            View Document
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}