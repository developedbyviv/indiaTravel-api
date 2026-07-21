import { z } from 'zod';

const travellerBase = z.object({
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Phone number too short'),
  startDate: z.string().optional(),
  meetingPoint: z.string().optional(),
});

// ── 1. Itinerary Enquiry (from Itinerary.tsx) ──────────────────────
export const itineraryEnquirySchema = z.object({
  tourId: z.string().min(1),
  selections: z
    .object({
      transport: z.string().optional(),
      dining: z.string().optional(),
      hotelCategory: z.string().optional(),
      additionalPlaces: z.array(z.string()).optional(),
    })
    .optional(),
  traveller: travellerBase.extend({
    fullName: z.string().min(2, 'Full name required'),
  }),
});

// ── 2. Custom Tour Enquiry (from CustomizeTours.tsx) ──────────────
export const customEnquirySchema = z.object({
  region: z.string().min(1, 'Region is required'),
  travelStyle: z.string().min(1, 'Travel style is required'),
  cities: z.array(z.string()).min(1, 'Select at least one city'),
  travelPurpose: z.string().min(1, 'Travel purpose is required'),
  budget: z.string().min(1, 'Budget is required'),
  transport: z.string().min(1, 'Transport is required'),
  traveller: travellerBase.extend({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
  }),
});

// ── 3. Cart Enquiry (from TripCart.tsx) ───────────────────────────
export const cartEnquirySchema = z.object({
  cartItems: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        location: z.string(),
      })
    )
    .min(1, 'Cart is empty'),
  traveller: travellerBase.extend({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    personCount: z.number().int().min(1).optional(),
    message: z.string().max(700, 'Message too long').optional(),
  }),
});

// ── 4. Trip Cart Enquiry (POST /enquiries/trip) ───────────────────
export const tripEnquirySchema = z.object({
  mainTour: z.string().min(1, 'Main tour is required'),
  addOns: z.array(z.string()).optional(),
  traveller: travellerBase.extend({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    personCount: z.number().int().min(1).optional(),
    message: z.string().max(700).optional(),
  }),
});
