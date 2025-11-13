
export enum TripType {
  Adventure = 'Adventure',
  Relaxation = 'Relaxation',
  Family = 'Family',
  Solo = 'Solo',
  Romantic = 'Romantic',
  Cultural = 'Cultural',
}

export interface TripPlanRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  tripType: TripType;
}

export interface AccommodationSuggestion {
  name: string;
  type: string;
  priceRange: string;
  description: string;
  bookingTip?: string;
}

export interface FoodRecommendation {
  name: string;
  cuisine: string;
  signatureDish: string;
  averageCost: string;
  note?: string;
}

export interface ShoppingItem {
  name: string;
  description: string;
}

export interface MarketRecommendation {
  name: string;
  type: string;
  famousFor: string;
  priceRange: string;
  note?: string;
}

export interface ShoppingRecommendation {
  famousItems: ShoppingItem[];
  recommendedMarkets: MarketRecommendation[];
  shoppingTip?: string;
}

export interface DailyItinerary {
  day: number;
  title: string;
  activities: string;
  accommodation?: AccommodationSuggestion;
  food?: FoodRecommendation[];
  shopping?: ShoppingRecommendation;
}

export interface BudgetSummary {
  category: string;
  estimatedCost: string;
}

export interface TripPlan {
  destinationName: string;
  tripSummary: string;
  dailyItinerary: DailyItinerary[];
  budgetSummary: BudgetSummary[];
  travelTips: string[];
}