'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { LeadInput, validateLeadInput } from '@/lib/validation';

interface SubmitLeadData extends LeadInput {
  website?: string;
  startedAt?: number;
}

export async function submitLead(input: SubmitLeadData) {
  try {
    const requestHeaders = await headers();
    const ipAddress = getClientIp(requestHeaders);
    const rateLimit = checkRateLimit(`lead:${ipAddress}`, {
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return {
        success: false,
        error: 'You have sent several requests. Please wait a few minutes and try again.',
      };
    }

    // Honeypot and minimum completion time stop basic automated submissions.
    if (input.website || !input.startedAt || Date.now() - input.startedAt < 700) {
      return { success: true };
    }

    const validated = validateLeadInput(input);

    if ('error' in validated) {
      return { success: false, error: validated.error };
    }

    const { data } = validated;
    const { error: insertError } = await supabase.from('leads').insert({
      name: data.name,
      phone: data.phone,
      destination: data.destination,
      status: 'new',
    });

    if (insertError) {
      console.error('Failed to insert lead:', insertError);
      return { success: false, error: 'We could not save your request. Please try again.' };
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error: emailError } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: process.env.LEAD_NOTIFICATION_EMAIL || 'aniket09may@gmail.com',
        subject: `New travel inquiry: ${data.destination}`,
        text: `New Lead Received!

Name: ${data.name}
WhatsApp Number: ${data.phone}
Destination: ${data.destination}

Please follow up with this lead as soon as possible.`,
      });

      if (emailError) {
        console.error('Failed to send lead notification:', emailError);
      }
    } else {
      console.warn('RESEND_API_KEY is not configured; lead saved without an email notification.');
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected lead submission error:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
