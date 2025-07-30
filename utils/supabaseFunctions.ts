import { supabaseClient } from "./supabaseClient";

export const getUser = async () => {
  const { data, error } = await supabaseClient.auth.getUser();
  return { data, error };
};  