import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const shareToken = requestUrl.searchParams.get('share_token')
  const shareType = requestUrl.searchParams.get('share_type')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { data } = await supabase.auth.exchangeCodeForSession(code)

    // If coming from shared link, handle based on whether user is new or existing
    if (shareToken && shareType && data.user) {
      // Check if user has completed onboarding (has a profile)
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      // New user - needs onboarding
      if (!profile) {
        return NextResponse.redirect(
          `${origin}/auth/setup?share_token=${shareToken}&share_type=${shareType}`
        );
      }

      // Existing user - fork content and redirect directly
      try {
        const serviceClient = createServiceClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Fork the shared content
        const forkResponse = await fetch(`${origin}/api/share/fork`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': request.headers.get('cookie') || ''
          },
          body: JSON.stringify({ share_token: shareToken, share_type: shareType })
        });

        if (forkResponse.ok) {
          const { page_id, notebook_id } = await forkResponse.json();
          return NextResponse.redirect(`${origin}/notebooks/${notebook_id}/pages/${page_id}`);
        }
      } catch (error) {
        console.error('Fork failed:', error);
        // Fall through to default redirect
      }
    }
  }

  // If coming from shared link but no code exchange (shouldn't happen)
  if (shareToken && shareType) {
    return NextResponse.redirect(
      `${origin}/auth/setup?share_token=${shareToken}&share_type=${shareType}`
    );
  }

  // Default redirect to notebooks page after successful authentication
  return NextResponse.redirect(`${origin}/notebooks`)
}
