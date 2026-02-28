import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const SUPPORTED_LANGS = ['en', 'fr', 'es'];
const DEFAULT_LANG = 'en';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // --- Supabase session refresh ---
  let response = NextResponse.next({ request });

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );
    // Refresh session — do not remove
    await supabase.auth.getUser();
  }

  // --- Language routing ---
  const hasLang = SUPPORTED_LANGS.some(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)
  );
  if (hasLang) return response;

  // 1. Check lang cookie (set by LangSwitcher)
  const cookieLang = request.cookies.get('lang')?.value;
  if (cookieLang && SUPPORTED_LANGS.includes(cookieLang)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${cookieLang}${pathname}`;
    return NextResponse.redirect(url);
  }

  // 2. Detect browser language from Accept-Language header
  const acceptLang = request.headers.get('accept-language') || '';
  let detected = DEFAULT_LANG;
  for (const lang of SUPPORTED_LANGS) {
    if (acceptLang.toLowerCase().includes(lang)) {
      detected = lang;
      break;
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${detected}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
