import { Response } from 'express';
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
