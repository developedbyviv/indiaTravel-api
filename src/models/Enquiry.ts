import mongoose, { Schema, Document } from 'mongoose';

export type EnquiryType = 'itinerary' | 'custom' | 'cart' | 'contact' | 'trip';

export interface IEnquiry extends Document {
  type: EnquiryType;
  userId?: mongoose.Types.ObjectId;

  // Itinerary enquiry
  tourId?: string;
  selections?: {
    transport?: string;
    dining?: string;
    hotelCategory?: string;
    additionalPlaces?: string[];
  };

  // Custom tour enquiry
  region?: string;
  travelStyle?: string;
  cities?: string[];
  travelPurpose?: string;
  budget?: string;
  transport?: string;

  // Cart enquiry
  cartItems?: { id: string; title: string; location: string }[];

  // Trip enquiry (POST /enquiries/trip)
  mainTour?: string;
  addOns?: string[];

  // Contact form enquiry
  subject?: string;
  country?: string;
  countryCode?: string;

  // Common traveller details
  traveller?: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    startDate?: string;
    meetingPoint?: string;
    personCount?: number;
    message?: string;
  };

  status: 'pending' | 'contacted' | 'resolved';
  createdAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    type: { type: String, required: true, enum: ['itinerary', 'custom', 'cart', 'contact', 'trip'] },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },

    // itinerary
    tourId: { type: String },
    selections: {
      transport: String,
      dining: String,
      hotelCategory: String,
      additionalPlaces: [String],
    },

    // custom
    region: { type: String },
    travelStyle: { type: String },
    cities: [{ type: String }],
    travelPurpose: { type: String },
    budget: { type: String },
    transport: { type: String },

    // cart
    cartItems: [
      {
        id: { type: String },
        title: { type: String },
        location: { type: String },
        _id: false,
      },
    ],

    // trip
    mainTour: { type: String },
    addOns: [{ type: String }],

    // contact
    subject: { type: String },
    country: { type: String },
    countryCode: { type: String },

    // traveller (common)
    traveller: {
      firstName: { type: String },
      lastName: { type: String },
      fullName: { type: String },
      email: { type: String },
      phone: { type: String },
      startDate: { type: String },
      meetingPoint: { type: String },
      personCount: { type: Number },
      message: { type: String },
    },

    status: { type: String, enum: ['pending', 'contacted', 'resolved'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
