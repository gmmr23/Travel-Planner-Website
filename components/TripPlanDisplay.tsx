
import React, { useState } from 'react';
import type { TripPlan } from '../types';
import Loader from './ui/Loader';

interface TripPlanDisplayProps {
  plan: TripPlan | null;
  isLoading: boolean;
  error: string | null;
}

const TripPlanDisplay: React.FC<TripPlanDisplayProps> = ({ plan, isLoading, error }) => {
  const [openDay, setOpenDay] = useState<number | null>(1);

  const toggleDay = (day: number) => {
    setOpenDay(openDay === day ? null : day);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg mt-8">
        <Loader className="w-12 h-12" />
        <p className="mt-4 text-gray-600 font-medium">Crafting your personalized adventure...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-red-100 text-red-700 rounded-lg mt-8">
        <h3 className="text-xl font-semibold">Oops! Something went wrong.</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <div className="mt-12 p-4 md:p-8 bg-white rounded-2xl shadow-lg animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Your Trip to {plan.destinationName}</h2>
      <p className="text-gray-600 mb-8">{plan.tripSummary}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-orange-400 pb-2">Daily Itinerary</h3>
          <div className="space-y-4">
            {plan.dailyItinerary.map((item) => (
              <div key={item.day} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleDay(item.day)}
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
                >
                  <span className="font-semibold text-lg text-blue-700 text-left">Day {item.day}: {item.title}</span>
                  <svg className={`w-6 h-6 transform transition-transform ${openDay === item.day ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {openDay === item.day && (
                  <div className="p-4 bg-white">
                    <p className="text-gray-700 whitespace-pre-line">{item.activities}</p>
                    
                    {item.accommodation && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Where to Stay
                        </h4>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h5 className="font-bold text-blue-800">{item.accommodation.name}</h5>
                          <p className="text-sm text-gray-600 font-medium">{item.accommodation.type} &bull; {item.accommodation.priceRange}</p>
                          <p className="mt-2 text-gray-700">{item.accommodation.description}</p>
                          {item.accommodation.bookingTip && (
                            <p className="mt-2 text-xs italic text-blue-600"><strong>Tip:</strong> {item.accommodation.bookingTip}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {item.food && item.food.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0c-.454-.303-.977-.454-1.5-.454V8.546c.523 0 1.046-.151 1.5-.454a2.704 2.704 0 013 0 2.704 2.704 0 003 0 2.704 2.704 0 013 0 2.704 2.704 0 003 0c.454.303.977.454 1.5.454v7zm-5-9.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0" />
                          </svg>
                          What to Eat
                        </h4>
                        <div className="space-y-4">
                          {item.food.map((foodItem, index) => (
                            <div key={index} className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                              <h5 className="font-bold text-orange-800">{foodItem.name}</h5>
                              <p className="text-sm text-gray-600 font-medium">{foodItem.cuisine} &bull; {foodItem.averageCost}</p>
                              <p className="mt-2 text-gray-700"><strong>Try:</strong> {foodItem.signatureDish}</p>
                              {foodItem.note && (
                                <p className="mt-2 text-xs italic text-orange-600"><strong>Note:</strong> {foodItem.note}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.shopping && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Shopping Guide
                        </h4>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-4">
                            <div>
                                <h5 className="font-bold text-green-800">Famous Items to Look For</h5>
                                <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
                                {item.shopping.famousItems.map((shopItem, index) => (
                                    <li key={index}>
                                    <strong>{shopItem.name}:</strong> {shopItem.description}
                                    </li>
                                ))}
                                </ul>
                            </div>
                             {item.shopping.recommendedMarkets && item.shopping.recommendedMarkets.length > 0 && (
                                <div>
                                    <h5 className="font-bold text-green-800">Where to Shop</h5>
                                    <div className="space-y-3 mt-2">
                                    {item.shopping.recommendedMarkets.map((market, index) => (
                                        <div key={index} className="p-3 bg-white rounded-md border border-green-100">
                                        <h6 className="font-semibold text-gray-900">{market.name}</h6>
                                        <p className="text-sm text-gray-600 font-medium">{market.type} &bull; {market.famousFor}</p>
                                         <p className="text-sm text-gray-600 font-medium">Price Range: {market.priceRange}</p>
                                        {market.note && (
                                            <p className="mt-1 text-xs italic text-green-700">{market.note}</p>
                                        )}
                                        </div>
                                    ))}
                                    </div>
                                </div>
                             )}
                            {item.shopping.shoppingTip && (
                                <p className="mt-2 text-xs italic text-green-600"><strong>Shopping Tip:</strong> {item.shopping.shoppingTip}</p>
                            )}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Budget Summary</h3>
            <ul className="space-y-2">
              {plan.budgetSummary.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{item.category}</span>
                  <span className="font-semibold text-blue-800">{item.estimatedCost}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Travel Tips</h3>
            <ul className="space-y-3 list-disc list-inside text-gray-700">
              {plan.travelTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanDisplay;