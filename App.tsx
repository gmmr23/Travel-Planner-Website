
import React, { useState, useRef } from 'react';
import Hero from './components/Hero';
import PlannerForm from './components/PlannerForm';
import TripPlanDisplay from './components/TripPlanDisplay';
import PopularDestinations from './components/PopularDestinations';
import Chatbot from './components/Chatbot';
import { generateTravelPlan } from './services/geminiService';
import type { TripPlan, TripPlanRequest } from './types';

function App() {
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const plannerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handlePlanRequest = async (request: TripPlanRequest) => {
    setIsLoading(true);
    setError(null);
    setTripPlan(null);

    // Smooth scroll to results section
    setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      const plan = await generateTravelPlan(request);
      setTripPlan(plan);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartPlanning = () => {
    plannerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Hero onStartPlanning={handleStartPlanning} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div ref={plannerRef}>
            <PlannerForm onPlanRequest={handlePlanRequest} isLoading={isLoading} />
        </div>
        <div ref={resultsRef} className="mt-8">
            <TripPlanDisplay plan={tripPlan} isLoading={isLoading} error={error} />
        </div>
      </main>
      <PopularDestinations />
      <Chatbot />
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; {new Date().getFullYear()} AI Travel Planner. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
