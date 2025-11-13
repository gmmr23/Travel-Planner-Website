
import { GoogleGenAI, Type } from "@google/genai";
import type { TripPlan, TripPlanRequest } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    destinationName: { type: Type.STRING, description: 'The name of the destination city and country.' },
    tripSummary: { type: Type.STRING, description: 'A brief, engaging summary of the proposed trip.' },
    dailyItinerary: {
      type: Type.ARRAY,
      description: 'A day-by-day plan of activities, including accommodation, food, and shopping recommendations.',
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: 'The day number (e.g., 1, 2, 3).' },
          title: { type: Type.STRING, description: 'A catchy title for the day\'s plan (e.g., "Eiffel Tower & Louvre Museum").' },
          activities: { type: Type.STRING, description: 'A detailed paragraph of the suggested activities for the day.' },
          accommodation: {
            type: Type.OBJECT,
            description: 'A recommendation for a place to stay that fits the user\'s budget and trip type.',
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING, description: 'e.g., Hotel, Hostel, Resort, Airbnb, Guesthouse' },
              priceRange: { type: Type.STRING, description: 'e.g., "$100 - $150 per night"' },
              description: { type: Type.STRING },
              bookingTip: { type: Type.STRING, description: 'An optional tip for booking.' },
            },
            required: ['name', 'type', 'priceRange', 'description'],
          },
          food: {
            type: Type.ARRAY,
            description: 'A list of recommended restaurants or food stalls for the day.',
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                cuisine: { type: Type.STRING, description: 'e.g., Local, Street Food, Fine Dining' },
                signatureDish: { type: Type.STRING },
                averageCost: { type: Type.STRING, description: 'e.g., "$20 - $40 per meal"' },
                note: { type: Type.STRING, description: 'An optional special note, e.g., "Vegetarian friendly".' },
              },
              required: ['name', 'cuisine', 'signatureDish', 'averageCost'],
            },
          },
          shopping: {
            type: Type.OBJECT,
            description: 'Shopping recommendations including famous local items and markets, tailored to the trip style.',
            properties: {
              famousItems: {
                type: Type.ARRAY,
                description: 'A list of iconic products or souvenirs the destination is famous for.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING, description: 'A short description of the item and why it is special.' },
                  },
                  required: ['name', 'description'],
                },
              },
              recommendedMarkets: {
                type: Type.ARRAY,
                description: 'A list of recommended markets or shops.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    type: { type: Type.STRING, description: 'e.g., Local Market, Mall, Boutique, Street Shop' },
                    famousFor: { type: Type.STRING, description: 'e.g., Handicrafts, Fashion, Spices' },
                    priceRange: { type: Type.STRING, description: 'e.g., "$5 - $50"' },
                    note: { type: Type.STRING, description: 'An optional special note, e.g., "Bargaining recommended".' },
                  },
                  required: ['name', 'type', 'famousFor', 'priceRange'],
                },
              },
              shoppingTip: { type: Type.STRING, description: 'A useful tip for shopping at this destination.' },
            },
          },
        },
        required: ['day', 'title', 'activities'],
      },
    },
    budgetSummary: {
      type: Type.ARRAY,
      description: 'A breakdown of the estimated budget.',
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: 'The expense category (e.g., Accommodation, Food, Activities, Shopping).' },
          estimatedCost: { type: Type.STRING, description: 'The estimated cost for the category, including currency symbol (e.g., "$500 - $800").' },
        },
        required: ['category', 'estimatedCost'],
      },
    },
    travelTips: {
      type: Type.ARRAY,
      description: 'A list of useful travel tips for the destination.',
      items: { type: Type.STRING },
    },
  },
  required: ['destinationName', 'tripSummary', 'dailyItinerary', 'budgetSummary', 'travelTips'],
};

export const generateTravelPlan = async (request: TripPlanRequest): Promise<TripPlan> => {
  const { destination, startDate, endDate, budget, tripType } = request;

  const prompt = `
    Generate a personalized travel plan for a trip to ${destination}.
    Travel Dates: From ${startDate} to ${endDate}.
    Budget: Approximately $${budget} USD. This is a ${budget > 3000 ? 'premium' : 'budget-friendly'} trip.
    Type of Trip: ${tripType}.

    Please provide a detailed plan including:
    1.  A short, exciting summary of the trip.
    2.  A daily itinerary with a title and detailed activities for each day.
    3.  For each day in the itinerary, provide ONE accommodation suggestion and a list of 2-3 food recommendations. These suggestions MUST align with the user's budget and trip type (${tripType}).
        - Accommodation should include name, type (e.g., Hotel, Airbnb), price range, a short description, and an optional booking tip.
        - Food recommendations should include the restaurant/stall name, cuisine type, a signature dish, average cost per meal, and an optional special note.
    4.  For each day, provide a shopping guide. This should include a list of 2-3 famous local items/souvenirs, recommendations for 1-2 local markets or shops (with details like type, specialty, and price range), and a relevant shopping tip. This MUST align with the user's budget and trip type (${tripType}).
    5.  A budget summary breaking down estimated costs for flights, accommodation, food, shopping, and activities.
    6.  Some useful travel and safety tips for ${destination}.

    Adhere strictly to the provided JSON schema for your response.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const parsedResponse = JSON.parse(response.text);
    return parsedResponse as TripPlan;
  } catch (error) {
    console.error("Error generating travel plan:", error);
    throw new Error("Failed to generate travel plan. The model might be overloaded. Please try again later.");
  }
};


export const getChatbotResponse = async (message: string, history: { user: string; bot: string }[]): Promise<string> => {
    const prompt = `
        You are a friendly and knowledgeable AI Travel Assistant. 
        A user is asking a question. Keep your answers concise and helpful.
        
        Conversation History:
        ${history.map(turn => `User: ${turn.user}\nAssistant: ${turn.bot}`).join('\n')}

        New User Question: "${message}"

        Your response:
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting chatbot response:", error);
        return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
};