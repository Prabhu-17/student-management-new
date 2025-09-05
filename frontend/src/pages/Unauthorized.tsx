import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <ShieldX className="h-24 w-24 text-destructive mx-auto" />
        <div>
          <h1 className="text-4xl font-bold text-foreground">403</h1>
          <p className="text-xl text-muted-foreground">Unauthorized Access</p>
        </div>
        <p className="text-muted-foreground max-w-md">
          You don't have permission to access this resource. Please contact your administrator.
        </p>
        <Button asChild>
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};