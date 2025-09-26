import { getRegistrations } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import MemberTable from './_components/member-table';
import Logo from '@/components/logo';

export default async function DashboardPage() {
  const { data: registrations, error } = await getRegistrations();

  if (error) {
    return <div className="p-8 text-destructive">Error: {error}</div>;
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 lg:p-8">
       <header className="w-full max-w-7xl pb-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Logo className="h-10 w-10 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                    Member Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                    Manage Bankers Investment Fund registrations.
                    </p>
                </div>
            </div>
            <Button asChild>
                <Link href="/">
                    <Plus className="mr-2 h-4 w-4"/>
                    New Registration
                </Link>
            </Button>
        </div>
      </header>
      <div className="w-full max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle>All Registrations</CardTitle>
            <CardDescription>
              {registrations?.length ?? 0} members found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MemberTable data={registrations || []} />
          </CardContent>
        </Card>
      </div>
      <footer className="w-full max-w-7xl pt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Bankers Investment Fund. All rights reserved.</p>
      </footer>
    </main>
  );
}
