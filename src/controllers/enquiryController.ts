import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Enquiry from '../models/Enquiry';
import { sendEnquiryNotification } from '../utils/mailer';
import { AuthRequest } from '../middleware/auth';

// ── Enquiry email HTML builder ──────────────────────────────────────────

const buildEnquiryEmailHtml = (enquiry: Record<string, unknown>): string => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
    <h2 style="color: #2563eb;">New Enquiry Received — indiaTravel.net</h2>
    <pre style="background: #f9fafb; padding: 16px; border-radius: 8px; font-size: 13px; white-space: pre-wrap;">
${JSON.stringify(enquiry, null, 2)}
    </pre>
  </div>
`;

// ── Static metadata for GET /enquiries/trip/options ────────────────────

const TRIP_OPTIONS = {
  addOns: [
    { id: 'photography', label: 'Photography Tour' },
    { id: 'cooking', label: 'Cooking Class' },
    { id: 'rickshaw', label: 'Rickshaw Ride' },
    { id: 'yoga', label: 'Yoga Session' },
    { id: 'village', label: 'Village Walk' },
    { id: 'sunset', label: 'Sunset Cruise' },
  ],
  categories: [
    { id: 'handpicked', label: 'Handpicked Tours' },
    { id: 'golden-triangle', label: 'Golden Triangle' },
    { id: 'same-day', label: 'Same-Day Tours' },
  ],
  meetingPoints: ['Hotel Lobby', 'Airport', 'Train Station', 'Custom Location'],
};

// GET /enquiries/trip/options
export const getTripOptions = (_req: Request, res: Response): void => {
  res.json({ success: true, data: TRIP_OPTIONS });
};

// POST /api/enquiries  (Itinerary enquiry)
export const createItineraryEnquiry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tourId, selections, traveller } = req.body;
    const enquiry = await Enquiry.create({
      type: 'itinerary',
      userId: req.userId,
      tourId,
      selections,
      traveller,
    });

    try {
      await sendEnquiryNotification(
        `New Itinerary Enquiry — ${traveller.fullName}`,
        buildEnquiryEmailHtml({ type: 'itinerary', tourId, selections, traveller })
      );
    } catch (emailError) {
      console.error('Failed to send itinerary email notification:', emailError);
    }

    res.status(201).json({ success: true, message: 'Enquiry submitted', data: enquiry });
  } catch (error) {
    console.error('Enquiry error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit enquiry' });
  }
};

// POST /api/enquiries/custom  (Custom tour enquiry)
export const createCustomEnquiry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { region, travelStyle, cities, travelPurpose, budget, transport, traveller } = req.body;
    const enquiry = await Enquiry.create({
      type: 'custom',
      userId: req.userId,
      region,
      travelStyle,
      cities,
      travelPurpose,
      budget,
      transport,
      traveller,
    });

    try {
      await sendEnquiryNotification(
        `New Custom Tour Enquiry — ${traveller.firstName} ${traveller.lastName}`,
        buildEnquiryEmailHtml({ type: 'custom', region, cities, travelPurpose, budget, transport, traveller })
      );
    } catch (emailError) {
      console.error('Failed to send custom enquiry email notification:', emailError);
    }

    res.status(201).json({ success: true, message: 'Custom enquiry submitted', data: enquiry });
  } catch (error) {
    console.error('Custom enquiry error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit custom enquiry' });
  }
};

// POST /api/enquiries/cart  (Trip cart enquiry)
export const createCartEnquiry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { cartItems, traveller } = req.body;
    const enquiry = await Enquiry.create({
      type: 'cart',
      userId: req.userId,
      cartItems,
      traveller,
    });

    try {
      await sendEnquiryNotification(
        `New Cart Enquiry — ${traveller.firstName} ${traveller.lastName}`,
        buildEnquiryEmailHtml({ type: 'cart', cartItems, traveller })
      );
    } catch (emailError) {
      console.error('Failed to send cart enquiry email notification:', emailError);
    }

    res.status(201).json({ success: true, message: 'Cart enquiry submitted', data: enquiry });
  } catch (error) {
    console.error('Cart enquiry error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit cart enquiry' });
  }
};

// POST /enquiries/trip  (Trip-cart enquiry — spec shape)
export const createTripEnquiry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mainTour, addOns, traveller } = req.body;
    const enquiry = await Enquiry.create({
      type: 'trip',
      userId: req.userId,
      mainTour,
      addOns: addOns || [],
      traveller,
    });

    try {
      await sendEnquiryNotification(
        `New Trip Enquiry — ${traveller.firstName} ${traveller.lastName}`,
        buildEnquiryEmailHtml({ type: 'trip', mainTour, addOns, traveller })
      );
    } catch (emailError) {
      console.error('Failed to send trip enquiry email notification:', emailError);
    }

    res.status(201).json({ success: true, message: 'Trip enquiry submitted', data: enquiry });
  } catch (error) {
    console.error('Trip enquiry error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit trip enquiry' });
  }
};

// GET /enquiries/:id
export const getEnquiryById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid enquiry ID' });
      return;
    }

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    // Users can only view their own enquiries (unless no userId = admin use)
    if (enquiry.userId && req.userId && enquiry.userId.toString() !== req.userId) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    res.json({ success: true, data: enquiry });
  } catch (error) {
    console.error('Get enquiry error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch enquiry' });
  }
};

// GET /enquiries  (list with filters)
export const getEnquiries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      status,
      email,
      dateFrom,
      dateTo,
      type,
      all,
      page = '1',
      pageSize = '20',
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};

    // Default: return only the requesting user's enquiries unless ?all=true
    if (all !== 'true') {
      filter.userId = req.userId;
    }

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (email) filter['traveller.email'] = email;

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) (filter.createdAt as Record<string, unknown>)['$gte'] = new Date(dateFrom);
      if (dateTo) (filter.createdAt as Record<string, unknown>)['$lte'] = new Date(dateTo);
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limit = Math.min(parseInt(pageSize, 10) || 20, 100);
    const skip = (pageNum - 1) * limit;

    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Enquiry.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: pageNum,
      pageSize: limit,
      pages: Math.ceil(total / limit),
      data: enquiries,
    });
  } catch (error) {
    console.error('List enquiries error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch enquiries' });
  }
};
