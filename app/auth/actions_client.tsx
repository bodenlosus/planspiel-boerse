"use client";

import { createClient } from "@/utils/supabase/client";

export async function login(
  redirect: (url: string) => void,
  formData: { email: string; password: string },
) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email as string,
    password: formData.password as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  // revalidatePath('/', 'layout')
  redirect("/");
}

export async function signup(
  redirect: (url: string) => void,
  formData: { email: string; password: string; fullName: string },
) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email as string,
    password: formData.password as string,
    options: {
      data: { name: formData.fullName as string },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  // revalidatePath('/', 'layout')
  redirect("/");
}

export async function logout(redirect: (url: string) => void) {
  const supabase = createClient();

  await supabase.auth.signOut();

  // revalidatePath('/', 'layout')
  redirect("/");
}
