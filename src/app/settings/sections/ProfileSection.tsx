import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AlertCircle, Trash2, Download, AlertTriangle } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { User } from '@/types/user';

interface FormData {
  fullName: string;
  email: string;
  company: string;
}

export function ProfileSection() {
  const { getProfile, updateProfile, requestDeleteAccountOTP, deleteAccount, isLoading } = useUser();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    company: ''
  });
  const [user, setUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteStep, setDeleteStep] = useState<'initial' | 'otp'>('initial');
  const [otp, setOtp] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await getProfile();
      setUser(userData);
      setFormData({
        fullName: userData.full_name || '',
        email: userData.email,
        company: userData.company || ''
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsUpdating(true);
      await updateProfile({
        full_name: formData.fullName,
        company: formData.company
      });
      await loadProfile();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRequestDeleteOTP = async () => {
    try {
      await requestDeleteAccountOTP();
      setDeleteStep('otp');
    } catch (error) {
      console.error('Failed to request OTP:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await deleteAccount({
        email: formData.email,
        otp
      });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="h-32 animate-pulse bg-muted rounded-lg" />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle>Profile Settings</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage your account information and settings
            </p>
          </div>
          <Button onClick={handleSubmit} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Full Name</Label>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Your full name"
              className="max-w-md"
            />
          </div>

          <div className="grid gap-2">
            <Label>Email Address</Label>
            <div className="flex items-center gap-2 max-w-md">
              <Input
                name="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
              <Badge variant={user?.is_verified ? "default" : "secondary"}>
                {user?.is_verified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Company</Label>
            <Input
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Your company name"
              className="max-w-md"
            />
          </div>
        </div>

        {!user?.is_verified && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification Required</AlertTitle>
            <AlertDescription>
              Please verify your email address to ensure account security and access all features.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-stretch border-t mt-6 pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Actions here can't be undone. Please proceed with caution.
            </p>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Before deleting your account:</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>Download all your documents and data</li>
                <li>Cancel any active subscriptions</li>
                <li>Remove team member access (if any)</li>
                <li>This action is permanent and cannot be undone</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  {deleteStep === 'initial' ? (
                    "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                  ) : (
                    "Please enter the verification code sent to your email."
                  )}
                </DialogDescription>
              </DialogHeader>

              {deleteStep === 'initial' ? (
                <div className="space-y-4">
                  <Alert>
                    <Download className="h-4 w-4" />
                    <AlertTitle>Download your data first</AlertTitle>
                    <AlertDescription>
                      Make sure you have downloaded all your important documents and data before proceeding.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      This will:
                      <ul className="list-disc pl-4 mt-2">
                        <li>Delete all your documents permanently</li>
                        <li>Cancel all active subscriptions</li>
                        <li>Remove all access and permissions</li>
                        <li>Delete your account information</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter verification code"
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setDeleteStep('initial');
                    setOtp('');
                  }}
                >
                  Cancel
                </Button>
                {deleteStep === 'initial' ? (
                  <Button
                    variant="destructive"
                    onClick={handleRequestDeleteOTP}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={!otp || isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}