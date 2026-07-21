import { Request, Response } from 'express';
import Enquiry from '../models/Enquiry';
import { sendEnquiryNotification } from '../utils/mailer';

// Static metadata — can be moved to DB later if dynamic options are needed
const CUSTOMIZE_META = {
  regions: [
    'Rajasthan', 'Kerala', 'Goa', 'Himachal Pradesh', 'Uttarakhand',
    'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Uttar Pradesh', 'Gujarat',
    'Madhya Pradesh', 'West Bengal', 'Sikkim', 'Andaman & Nicobar',
  ],
  travelStyles: [
    'Adventure', 'Cultural', 'Luxury', 'Budget', 'Wildlife',
    'Spiritual', 'Honeymoon', 'Family', 'Solo', 'Photography',
  ],
  budgetRanges: [
    'Under ₹25,000', '₹25,000 – ₹50,000', '₹50,000 – ₹1,00,000',
    '₹1,00,000 – ₹2,00,000', 'Above ₹2,00,000',
  ],
  transportOptions: [
    'Private Car', 'Train', 'Flight', 'Bus', 'Bike Rental', 'Mixed',
  ],
  travelPurposes: [
    'Leisure', 'Honeymoon', 'Family Vacation', 'Business', 'Pilgrimage',
    'Adventure', 'Education / Study Tour',
  ],
};

// GET /customize/meta
export const getCustomizeMeta = (_req: Request, res: Response): void => {
  res.json({ success: true, data: CUSTOMIZE_META });
};

// POST /customize/enquiries
export const createCustomizeEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { region, travelStyle, cities, travelPurpose, budget, transport, travellerDetails } = req.body;

    const enquiry = await Enquiry.create({
      type: 'custom',
      region,
      travelStyle,
      cities,
      travelPurpose,
      budget,
      transport,
      traveller: travellerDetails,
    });

    try {
      await sendEnquiryNotification(
        `New Custom Trip Enquiry — ${travellerDetails?.firstName || ''} ${travellerDetails?.lastName || ''}`,
        `<div style="font-family:sans-serif;"><pre>${JSON.stringify({ region, travelStyle, cities, travelPurpose, budget, transport, travellerDetails }, null, 2)}</pre></div>`
      );
    } catch (emailError) {
      console.error('Failed to send customize enquiry email:', emailError);
    }

    res.status(201).json({ success: true, message: 'Custom tour enquiry submitted', data: enquiry });
  } catch (error) {
    console.error('Customize enquiry error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit custom tour enquiry' });
  }
};
