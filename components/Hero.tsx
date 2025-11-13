
import React from 'react';

interface HeroProps {
  onStartPlanning: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartPlanning }) => {
  return (
    <div className="relative h-screen flex items-center justify-center text-center text-white px-4">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: `url(https://picsum.photos/seed/travel-hero/1920/1080)` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-down">Plan Your Perfect Trip with AI!</h1>
        <p className="text-lg md:text-2xl mb-8 max-w-2xl animate-fade-in-up">
          Let our intelligent assistant craft a personalized itinerary just for you. Adventure awaits.
        </p>
        <button 
          onClick={onStartPlanning}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Start Planning
        </button>
      </div>
    </div>
  );
};

export default Hero;
