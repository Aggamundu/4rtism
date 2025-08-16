import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { to, subject, text, html} = await request.json();
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  // sgMail.setDataResidency('eu'); 
  // uncomment the above line if you are sending mail using a regional EU subuser

  const msg = {
    to: to, // Change to your recipient
    from: 'noreply@em6674.4rtism.com', // Change to your verified sender
    subject: subject,
    text: text,
    html: html,
  }
  sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error:any) => {
    console.error(error)
  })
  return NextResponse.json({ message: 'Email sent' })
}