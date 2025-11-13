
import React, { useState } from 'react';
import { TripPlanRequest, TripType } from '../types';
import { TRIP_TYPES } from '../constants';
import Loader from './ui/Loader';

interface PlannerFormProps {
  onPlanRequest: (request: TripPlanRequest) => void;
  isLoading: boolean;
}

interface FormErrors {
    destination?: string;
    startDate?: string;
    endDate?: string;
}

const PlannerForm: React.FC<PlannerFormProps> = ({ onPlanRequest, isLoading }) => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState(1000);
  const [tripType, setTripType] = useState<TripType>(TripType.Adventure);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
      const newErrors: FormErrors = {};

      if (!destination.trim()) {
          newErrors.destination = 'Destination is required.';
      }

      if (!startDate) {
          newErrors.startDate = 'Start date is required.';
      }
      
      if (!endDate) {
          newErrors.endDate = 'End date is required.';
      }

      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
          newErrors.endDate = 'End date cannot be before the start date.';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onPlanRequest({ destination, startDate, endDate, budget, tripType });
    }
  };
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <div id="planner" className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl max-w-4xl mx-auto -mt-20 relative z-20">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Create Your Dream Itinerary</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        
        <div className="lg:col-span-1">
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., Paris, France"
            className={`w-full px-4 py-2 border ${errors.destination ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-orange-500 focus:border-orange-500`}
            aria-invalid={!!errors.destination}
            aria-describedby={errors.destination ? 'destination-error' : undefined}
          />
          {errors.destination && <p id="destination-error" className="text-red-500 text-xs mt-1">{errors.destination}</p>}
        </div>
        
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`w-full px-4 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-orange-500 focus:border-orange-500`}
            min={today}
            aria-invalid={!!errors.startDate}
            aria-describedby={errors.startDate ? 'startDate-error' : undefined}
          />
          {errors.startDate && <p id="startDate-error" className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`w-full px-4 py-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-orange-500 focus:border-orange-500`}
            min={startDate || today}
            aria-invalid={!!errors.endDate}
            aria-describedby={errors.endDate ? 'endDate-error' : undefined}
          />
          {errors.endDate && <p id="endDate-error" className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
        </div>
        
        <div className="md:col-span-2 lg:col-span-1">
          <label htmlFor="tripType" className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
          <select
            id="tripType"
            value={tripType}
            onChange={(e) => setTripType(e.target.value as TripType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          >
            {TRIP_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:bg-blue-300"
        >
          {isLoading ? <Loader className="w-6 h-6" /> : 'Generate My Travel Plan'}
        </button>
      </form>
       <div className="mt-4">
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Budget (USD): ${budget.toLocaleString()}</label>
          <input
            type="range"
            id="budget"
            min="500"
            max="10000"
            step="100"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>
    </div>
  );
};

export default PlannerForm;
