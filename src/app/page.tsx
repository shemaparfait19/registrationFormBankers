import FormContainer from '@/components/form-container';
import Logo from '@/components/logo';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl pb-8">
        <div className="flex items-center gap-4">
          <Logo className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              InvestRight Onboarding
            </h1>
            <p className="text-muted-foreground">
              Bankers Investment Fund Application
            </p>
          </div>
        </div>
      </header>
      <div className="w-full max-w-4xl">
        <FormContainer />
      </div>
      <footer className="w-full max-w-4xl pt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Bankers Investment Fund. All rights reserved.</p>
      </footer>
    </main>
  );
}
