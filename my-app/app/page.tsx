import { HeroSection } from '@/components/HeroSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to Your Site</h2>
          <p className="text-gray-600 mb-8">
            The hero section above is fully editable by admin. Visit /admin to manage it.
          </p>
        </div>
      </main>
    </div>
  );
}
