'use server';

import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SubmitLeadData {
  name: string;
  phone: string;
  destination: string;
}

export async function submitLead(data: SubmitLeadData) {
  try {
    // Insert lead into Supabase
    const { error: insertError } = await supabase.from("leads").insert({
      name: data.name,
      phone: data.phone,
      destination: data.destination,
      status: "new",
    });

    if (insertError) {
      throw new Error(insertError.message);
    }

    // Send instant email notification via Resend
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev', // Replace with your verified domain email
        // to: 'sales@oxourholiday.com',
        to: 'aniket09may@gmail.com',
        subject: 'New Lead Submission',
        text: `New Lead Received!

Name: ${data.name}
WhatsApp Number: ${data.phone}
Destination: ${data.destination.charAt(0).toUpperCase() + data.destination.slice(1)}

Please follow up with this lead as soon as possible.`,
      });
    } catch (emailError) {
      // Log email error but don't fail the lead submission
      console.error('Failed to send email notification:', emailError);
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting lead:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to submit. Please try again." 
    };
  }
}
