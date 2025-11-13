
import React from 'react';
import { POPULAR_DESTINATIONS } from '../constants';

const PopularDestinations: React.FC = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Popular Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {POPULAR_DESTINATIONS.map((dest, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden shadow-lg group transform transition duration-300 hover:scale-105">
              <img src={dest.image} alt={dest.name} className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">
                {dest.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularDestinations;
