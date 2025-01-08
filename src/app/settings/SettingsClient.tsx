import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Bell, CreditCard, Download, FileText, Globe, Lock, Mail, Shield, User } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="pb-10">
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Account Settings</h1>
          <p className="text-sm text-zinc-500">Manage your account preferences and settings</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Account Data
        </Button>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">3/5</div>
            <div className="text-zinc-300 text-sm">Documents this month</div>
            <div className="mt-4 h-2 bg-white/20 rounded-full">
              <div className="h-2 bg-white rounded-full w-3/5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold">Basic</span>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Active</Badge>
            </div>
            <p className="text-sm text-zinc-500 mb-4">$15.00/month</p>
            <Button className="w-full">Upgrade Plan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">2FA Status</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Recommended
                </Badge>
              </div>
              <Button variant="outline" className="w-full">Enabled 2FA</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Settings Area */}
      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto">
          <div className="container flex gap-6 border-b">
            <TabsTrigger 
              value="profile" 
              className="relative h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="relative h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Billing
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="relative h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900"
            >
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </div>
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and preferences</CardDescription>
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-zinc-100 text-zinc-900 text-xl">JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline">Change Picture</Button>
                    <p className="text-xs text-zinc-500">Recommended: Square image, at least 400x400px</p>
                  </div>
                </div>
                
                <Separator />

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="John Doe" className="max-w-md" />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <div className="flex items-center gap-2 max-w-md">
                      <Input value="john@example.com" disabled />
                      <Button variant="outline" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-zinc-500">Email is used for OTP verification and cannot be changed</p>
                  </div>
                </div>

                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    Your email is verified. You'll receive important notifications here.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>Manage your connected accounts and services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-4">
                    <Globe className="h-8 w-8 text-zinc-500" />
                    <div>
                      <h4 className="font-medium">Google Drive</h4>
                      <p className="text-sm text-zinc-500">Coming Soon: Export documents directly</p>
                    </div>
                  </div>
                  <Button variant="outline" disabled>Connect</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-4">
                    <Lock className="h-8 w-8 text-zinc-500" />
                    <div>
                      <h4 className="font-medium">Digital Signature</h4>
                      <p className="text-sm text-zinc-500">Coming Soon: Sign documents electronically</p>
                    </div>
                  </div>
                  <Button variant="outline" disabled>Connect</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Manage your subscription and billing</CardDescription>
                  </div>
                  <Button>Upgrade Plan</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6 p-4 bg-zinc-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">Basic Plan</h3>
                      <Badge>Current</Badge>
                    </div>
                    <p className="text-sm text-zinc-500 mb-4">Perfect for individual users and small projects</p>
                    <div className="flex gap-4">
                      <div>
                        <div className="text-2xl font-bold">$15</div>
                        <div className="text-sm text-zinc-500">per month</div>
                      </div>
                      <Separator orientation="vertical" />
                      <div>
                        <div className="text-2xl font-bold">5</div>
                        <div className="text-sm text-zinc-500">documents/month</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4">Billing History</h4>
                  <div className="space-y-4">
                    {[
                      { date: "Jan 1, 2024", amount: "$15.00", status: "Paid", invoice: "#INV-2024-001" },
                      { date: "Dec 1, 2023", amount: "$15.00", status: "Paid", invoice: "#INV-2023-012" }
                    ].map((transaction, i) => (
                      <div key={i} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.invoice}</p>
                            <p className="text-sm text-zinc-500">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">{transaction.amount}</span>
                          <Badge variant="secondary">{transaction.status}</Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Manage your payment methods and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Flutterwave</p>
                      <p className="text-sm text-zinc-500">Connected</p>
                    </div>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what updates you want to receive and how</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-zinc-500">DOCUMENT NOTIFICATIONS</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Document Completion</div>
                      <div className="text-sm text-zinc-500">Receive notifications when your document is ready</div>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Document Updates</div>
                      <div className="text-sm text-zinc-500">Get notified about changes to your documents</div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-zinc-500">ACCOUNT NOTIFICATIONS</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Payment Confirmations</div>
                      <div className="text-sm text-zinc-500">Receive receipts and payment confirmations</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Usage Alerts</div>
                      <div className="text-sm text-zinc-500">Get notified when approaching document limits</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 rounded-lg p-4 mt-6">
                <h4 className="font-medium mb-2">Coming Soon Features</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Custom Notification Settings</div>
                    <Badge variant="outline">Soon</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">SMS Notifications</div>
                    <Badge variant="outline">Soon</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}