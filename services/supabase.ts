import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ndlvkbhcwtntrhtkdllg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbHZrYmhjd3RudHJodGtkbGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMjg5OTAsImV4cCI6MjA1MjYwNDk5MH0.3apSGbuNmXhHLtNMKQzrozoJoZ8GkIkXiep4nOSgpis";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

class SupabaseService {
  static async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.log("Error getting user:", error);
      return null;
    }
    return data.user;
  }

  static async getUserWords() {
    // Retrieve user information
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.log("Error getting user:", authError);
      return null;
    }

    const user = authData.user;
    if (!user) {
      console.log("No user found");
      return null;
    }

    // Retrieve user profile information
    const { data, error, status } = await supabase
      .from("profiles") // Ensure the table name matches exactly with your database
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.log("Error fetching user words:", error);
      return null;
    }

    console.log("User profile data:", data);
    return data.words;
  }
  static async updateUserWords(words: any) {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.log("Error getting user:", authError);
      return null;
    }

    const user = authData.user;
    if (!user) {
      console.log("No user found");
      return null;
    }

    // Retrieve user profile information
    const { data, error, status } = await supabase
      .from("profiles") // Ensure the table name matches exactly with your database
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.log("Error fetching user words:", error);
      return null;
    }
    const updates = {
      id: data.id,
      words: words,
    };
    const { er } = await supabase.from("profiles").upsert(updates);
  }
}

export default SupabaseService;
