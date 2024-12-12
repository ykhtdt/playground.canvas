import { Button } from "@repo/ui/components/ui/button";

export default function Page() {
  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold mb-2">
          Turborepo & Shadcn/ui
        </h1>
        <Button>
          @repo/ui Button
        </Button>
      </main>
    </div>
  );
}
