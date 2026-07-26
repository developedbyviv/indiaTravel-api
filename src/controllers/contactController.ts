import { Request, Response } from 'express';
import Enquiry from '../models/Enquiry';
import { sendEnquiryNotification } from '../utils/mailer';

const buildContactEmailHtml = (data: Record<string, unknown>): string => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
    <h2 style="color: #2563eb;">New Contact Enquiry — indiaTravel.net</h2>
    <table style="width:100%; border-collapse: collapse; font-size: 14px;">
      <tr><td style="padding:8px; font-weight:bold;">Name</td><td style="padding:8px;">${data.firstName} ${data.lastName}</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:8px; font-weight:bold;">Email</td><td style="padding:8px;">${data.email}</td></tr>
      <tr><td style="padding:8px; font-weight:bold;">Phone</td><td style="padding:8px;">${data.countryCode} ${data.phone}</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:8px; font-weight:bold;">Country</td><td style="padding:8px;">${data.country}</td></tr>
      <tr><td style="padding:8px; font-weight:bold;">Subject</td><td style="padding:8px;">${data.subject}</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:8px; font-weight:bold;">Message</td><td style="padding:8px;">${data.message}</td></tr>
    </table>
  </div>
`;

// POST /contact/enquiries
export const createContactEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, countryCode, phone, country, subject, message } = req.body;

    const enquiry = await Enquiry.create({
      type: 'contact',
      subject,
      country,
      countryCode,
      traveller: { firstName, lastName, email, phone, message },
    });

    try {
      await sendEnquiryNotification(
        `Contact Form: ${subject} — ${firstName} ${lastName}`,
        buildContactEmailHtml({ firstName, lastName, email, countryCode, phone, country, subject, message })
      );
    } catch (emailError) {
      console.error('Failed to send contact email notification:', emailError);
    }

    res.status(201).json({ success: true, message: 'Enquiry submitted successfully', data: enquiry });
  } catch (error) {
    console.error('Contact enquiry error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit enquiry' });
  }
};
