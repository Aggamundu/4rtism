import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../utils/supabaseServer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const { data, error } = await supabaseServer.from("tokens").select("*, responses(rejection_count, status)").eq("token", token).single();
  console.log(data);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (data) {
    return NextResponse.json(data);
  }
  return NextResponse.json({ error: "Token not found" }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {action, token, message ,rejections, rating} = body;
    if(action === "reject") {
      const { data: tokenData } = await supabaseServer.from("tokens").select("response_id").eq("token", token).single();
      if(!tokenData) {
        return NextResponse.json({error: "Token not found"}, {status: 400});
      }

      // Update response status and rejection count
      const {data, error} = await supabaseServer.from("responses")
        .update({
          status: "WIP",
          rejection_count: rejections + 1
        })
        .eq("id", tokenData.response_id)
        .single();
      if(error) {
        console.error('Error updating response status:', error);
        return NextResponse.json({error: "Error updating response status"}, {status: 500});
      }

      // Get client email from emails table
      const { data: clientData, error: clientError } = await supabaseServer
        .from('emails')
        .select('email')
        .eq('response_id', tokenData.response_id)
        .single();
      console.log("Client email fetched");

      if (clientError) {
        console.error('Error fetching client email:', clientError);
        return NextResponse.json({error: "Error fetching client email"}, {status: 500});
      }
        
      // Get artist profile ID through joined tables
      const { data: profileData, error: profileError } = await supabaseServer
        .from('responses')
        .select(`
          commissions (
            profiles (
              id
            )
          )
        `)
        .eq('id', tokenData.response_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return NextResponse.json({error: "Error fetching artist profile"}, {status: 500});
      }

      const profileId = (profileData as any)?.commissions?.profiles?.id ?? (profileData as any)?.commissions?.[0]?.profiles?.[0]?.id;
      console.log('artist profileId:', profileId);
      if (!profileId) {
        return NextResponse.json({ error: 'Artist profile not found' }, { status: 400 });
      }

      // Get artist email using profile ID
      const { data: artistData, error: artistError } = await supabaseServer
        .from('emails')
        .select('email')
        .eq('user_id', profileId)
        .single(); 

      if (artistError) {
        console.error('Error fetching artist email:', artistError);
        return NextResponse.json({error: "Error fetching artist email"}, {status: 500});
      }

      const artistEmail = artistData.email;
      console.log("Artist email fetched");
      
      if (artistData && clientData) {
        try {
          const emailResponse = await fetch(`http://localhost:3000/api/mail`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: artistEmail,
              subject: `Commission rejection from ${clientData.email}`,
              text: `Your commission has been rejected.`,
              html: `
                 <div style="background-color: #f3f4f6; padding: 0.5rem; font-family: 'Lexend', sans-serif;">
                   <div style="background-color: white; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 1rem; max-width: 28rem; margin: 0 auto;">
                     <div style="text-align: center; margin-bottom: 0.75rem;">
                       <h1 style="font-size: 1.125rem; font-weight: 700; color: #1f2937; margin: 0; font-family: 'Lexend', sans-serif;">Commission Rejected from ${clientData.email}</h1>
                     </div>
  
                     <div style="background-color: #f9fafb; padding: 0.5rem; border-radius: 0.375rem; margin-bottom: 0.75rem;">
                       <p style="font-size: 0.75rem; color: #1f2937; margin: 0; font-family: 'Lexend', sans-serif;">
                         Your commission has been rejected with the following feedback:
                       </p>
                       <div style="background-color: white; border-radius: 0.25rem; padding: 0.75rem; margin-top: 0.5rem; font-style: italic;">
                         ${message}
                       </div>
                     </div>
  
                     <div style="text-align: center;">
                       <p style="font-size: 0.625rem; color: #6b7280; margin: 0; font-family: 'Lexend', sans-serif;">
                         Please revise and resubmit your work
                       </p>
                     </div>
                   </div>
                 </div>
               `,
            })
          });
        } catch (error) {
          console.error('Error sending email:', error);
        }
      }
      return NextResponse.json({message: "Rejection Updated"}, {status: 200});
    }
    if(action === "accept") {
      //get response id from responses table
      const { data: tokenData } = await supabaseServer.from("tokens").select("response_id").eq("token", token).single();
      if(!tokenData) {
        return NextResponse.json({error: "Token not found"}, {status: 400});
      }

      // Update response status and rejection count
      const {data: responseData, error: responseError} = await supabaseServer.from("responses")
      .update({
        status: "Completed"
      })
      .eq("id", tokenData.response_id);
      if(responseError) {
      console.error('Error updating response status:', responseError);
      return NextResponse.json({error: "Error updating response status"}, {status: 500});
    }
      // Get artist profile ID through joined tables
      const { data: profileData, error: profileError } = await supabaseServer
        .from('responses')
        .select(`
          commissions (
            profiles (
              id
            )
          )
        `)
        .eq('id', tokenData.response_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return NextResponse.json({error: "Error fetching artist profile"}, {status: 500});
      }

      const profileId = (profileData as any)?.commissions?.profiles?.id ?? (profileData as any)?.commissions?.[0]?.profiles?.[0]?.id;

      if (!profileId) {
        return NextResponse.json({ error: 'Artist profile not found' }, { status: 400 });
      }
      //insert review into reviews table
      const {data, error} = await supabaseServer.from("reviews")
        .insert({
          reviewText: message,
          rating: rating,
          artist_id: profileId,
        });
      if(error) {
        console.error('Error inserting review:', error);
        return NextResponse.json({error: "Error inserting review"}, {status: 500});
      }

      // Get artist email using profile ID
      const { data: artistData, error: artistError } = await supabaseServer
      .from('emails')
      .select('email')
      .eq('user_id', profileId)
      .single(); 

      if (artistError) {
        console.error('Error fetching artist email:', artistError);
        return NextResponse.json({error: "Error fetching artist email"}, {status: 500});
      }
      const artistEmail = artistData.email;
      console.log("Artist email fetched");

      // Get client email from emails table
      const { data: clientData, error: clientError } = await supabaseServer
        .from('emails')
        .select('email')
        .eq('response_id', tokenData.response_id)
        .single();
      console.log("Client email fetched");

      if (clientError) {
        console.error('Error fetching client email:', clientError);
        return NextResponse.json({error: "Error fetching client email"}, {status: 500});
      }

      if(artistData && clientData) {
        try {
          const emailResponse = await fetch(`http://localhost:3000/api/mail`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: artistEmail,
              subject: `Commission completed from ${clientData.email}`,
              text: `Your commission has been completed.`,
              html: `
                 <div style="background-color: #f3f4f6; padding: 0.5rem; font-family: 'Lexend', sans-serif;">
                   <div style="background-color: white; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 1rem; max-width: 28rem; margin: 0 auto;">
                     <div style="text-align: center; margin-bottom: 0.75rem;">
                       <h1 style="font-size: 1.125rem; font-weight: 700; color: #1f2937; margin: 0; font-family: 'Lexend', sans-serif;">Commission for ${clientData.email} Completed</h1>
                     </div>
                     <div style="text-align: center; margin-bottom: 1rem;">
                       <p style="color: #4b5563; margin: 0;">Rating: ${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</p>
                     </div>
                     <div style="background-color: #f9fafb; padding: 1rem; border-radius: 0.375rem; margin-bottom: 1rem;">
                       <p style="color: #4b5563; margin: 0; white-space: pre-wrap;">${message}</p>
                     </div>
                     
            `,
            })
          });
        } catch (error) {
          console.error('Error sending email:', error);
        }
      }
      return NextResponse.json({message: "Commission completed"}, {status: 200});
    }
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }

}

