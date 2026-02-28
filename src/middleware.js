import { NextResponse } from 'next/server';

const SUPPORTED_LANGS = ['en', 'fr', 'es'];
const DEFAULT_LANG = 'en';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if path already starts with a supported lang
  const hasLang = SUPPORTED_LANGS.some(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)
  );
  if (hasLang) return NextResponse.next();

  // Skip Next.js internals and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

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
