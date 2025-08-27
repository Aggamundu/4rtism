import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../utils/supabaseServer";

export async function POST(request: NextRequest) {
  const { userId } = await request.json();

  const { data, error } = await supabaseServer.auth.admin.deleteUser(userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
}