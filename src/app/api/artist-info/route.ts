import { NextRequest } from "next/server";
import { supabaseServer } from "../../../../utils/supabaseServer";
import { NextResponse } from "next/server";

const sendEmail = async (artistData: any, email: string) => {
  try {
    //localhost:3000/api/mail
    const emailResponse = await fetch(`https://art-commission.vercel.app/api/mail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: artistData.email,
        subject: 'New Commission Request Received',
        text: `Commission request from ${email}`,
        html: `
          <div style="background-color: #f3f4f6; padding: 0.5rem; font-family: 'Lexend', sans-serif;">
            <div style="background-color: white; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 1rem; max-width: 28rem; margin: 0 auto;">
              <div style="text-align: center; margin-bottom: 0.75rem;">
                <h1 style="font-size: 1.125rem; font-weight: 700; color: #1f2937; margin: 0; font-family: 'Lexend', sans-serif;">Commission Request Received</h1>
                <p style="color: #4b5563; margin: 0.25rem 0 0 0; font-size: 0.75rem; font-family: 'Lexend', sans-serif;">Commission Request from ${email}</p>
              </div>

              <div style="background-color: #f9fafb; padding: 0.5rem; border-radius: 0.375rem; margin-bottom: 0.75rem;">
                <p style="font-size: 0.75rem; color: #1f2937; margin: 0; font-family: 'Lexend', sans-serif;">
                    A new commission request has been received from ${email}. View it in your <a href="https://art-commission.vercel.app/dash" style="color: #2563eb; text-decoration: underline;">dashboard</a>.
                </p>
              </div>
            </div>
          </div>
        `,
      })
    });
    
    if (emailResponse.ok) {
      console.log('Email notification sent successfully');
    } else {
      console.error('Failed to send email notification');
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

export async function POST(request: NextRequest) {
  const { commissionId, email } = await request.json();
  const { data, error } = await supabaseServer.from("commissions").select("profile_id").eq("id", commissionId).single();
  const {data: artistEmail, error: artistEmailError} = await supabaseServer.from("emails").select("email").eq("user_id", data?.profile_id).single();
  if (artistEmailError) {
    console.error(artistEmailError);
  }
  sendEmail(artistEmail, email);
  return NextResponse.json(data);
}