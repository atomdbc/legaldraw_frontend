// src/app/settings/downloads/DownloadHistoryClient.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Calendar, Download, FileText, Filter } from "lucide-react";
import { useDownloads } from "@/hooks/useDownloads";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatBytes, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { DownloadRecord, DownloadStats } from '@/types/download';

export default function DownloadHistoryClient() {
  const { getDownloadHistory, getDownloadStats, isLoading } = useDownloads();
  const [activeTab, setActiveTab] = useState("overview");
  const [downloadHistory, setDownloadHistory] = useState<DownloadRecord[]>([]);
  const [stats, setStats] = useState<DownloadStats | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const skip = (currentPage - 1) * itemsPerPage;
      const historyData = await getDownloadHistory(skip, itemsPerPage);
      if (historyData) {
        setDownloadHistory(historyData.downloads);
      }

      const statsData = await getDownloadStats('all');
      if (statsData) {
        setStats(statsData);
      }
    };

    fetchData();
  }, [currentPage, getDownloadHistory, getDownloadStats]);

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Download Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-20" /> : stats?.total_downloads || 0}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average File Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                formatBytes(stats?.average_file_size || 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Per document</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                formatBytes(stats?.total_bytes_downloaded || 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Downloaded</p>
          </CardContent>
        </Card>
      </div>

      {/* Download Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Download Activity</CardTitle>
          <CardDescription>Daily download trends over time</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.downloads_by_period.daily || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="downloads"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Download History</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {downloadHistory.map((download) => (
                <div
                  key={`${download.document_id}-${download.downloaded_at}`}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <h4 className="font-medium">{download.document_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(download.downloaded_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge>
                      {formatBytes(download.file_size || 0)}
                    </Badge>
                    <Badge 
                      variant={download.status === 'completed' ? 'success' : 'secondary'}
                    >
                      {download.status}
                    </Badge>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div className="flex justify-center space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={downloadHistory.length < itemsPerPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Downloads</h2>
        <p className="text-muted-foreground">
          Manage and track your document downloads
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="history">
            <Calendar className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          {renderOverviewTab()}
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          {renderHistoryTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}