import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import type { User } from '@/types/user';

interface FormData {
  fullName: string;
  email: string;
  company: string;
}

export function ProfileSection() {
  const { getProfile, updateProfile, isLoading } = useUser();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    company: ''
  });
  const [user, setUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

  if (isLoading) {
    return <div className="h-32 animate-pulse bg-muted rounded-lg" />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle>Account Settings</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage your account information
            </p>
          </div>
          <Button onClick={handleSubmit} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
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

        {/* Security Alert - Only if not verified */}
        {!user?.is_verified && (
          <div className="flex items-center gap-2 p-4 bg-muted rounded-lg text-sm">
            <AlertCircle className="h-4 w-4" />
            <p>Please verify your email address to ensure account security.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}