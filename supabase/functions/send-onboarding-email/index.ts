
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OnboardingEmailRequest {
  email: string;
  purpose: string;
  contact_preference: string;
  contact_other?: string;
  phone?: string;
  company?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: OnboardingEmailRequest = await req.json();
    console.log("Received request data:", data);

    const purposeMap = {
      personal: "an AI Agent for personal use",
      business: "AI solutions for your business",
      looking: "exploring AI solutions"
    };

    const contactMethod = data.contact_preference === 'other' 
      ? data.contact_other 
      : data.contact_preference;

    const emailResponse = await resend.emails.send({
      from: "Lovable AI <onboarding@resend.dev>",
      to: [data.email],
      subject: "Welcome to Lovable AI - We'll Be In Touch Soon!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #000000; margin-bottom: 20px;">Thank you for reaching out!</h1>
          
          <p>We're excited that you're interested in ${purposeMap[data.purpose]}.</p>
          
          <p>Our team will carefully review your requirements and get back to you soon via your preferred contact method (${contactMethod}).</p>
          
          ${data.message ? `<p>We've received your message: "${data.message}"</p>` : ''}
          
          <p>In the meantime, if you need to reach us urgently:</p>
          <ul>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Email: support@lovable-ai.com</li>
          </ul>
          
          ${data.company ? `<p>We look forward to potentially working with ${data.company}!</p>` : ''}
          
          <p style="margin-top: 30px;">Best regards,<br>The Lovable AI Team</p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-onboarding-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
