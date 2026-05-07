/**
 * Cloudflare Pages Function — Homepage Geo-Routing
 * Serves index-me.html to Middle East visitors.
 * Cookie bl_region=me  → force ME version
 * Cookie bl_region=global → force global version
 */

const ME_COUNTRIES = new Set([
  'AE','SA','QA','KW','BH','OM',   // GCC
  'EG','JO','IQ','LB','YE','SY','PS','LY','TN','MA','DZ'  // Broader ME/NA
]);

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Only intercept root homepage requests
  if (url.pathname !== '/' && url.pathname !== '/index.html') {
    return next();
  }

  const country  = request.cf?.country || '';
  const cookies  = request.headers.get('cookie') || '';
  const forced   = (cookies.match(/bl_region=([a-z]+)/) || [])[1];

  const serveME  = forced ? forced === 'me' : ME_COUNTRIES.has(country);

  if (serveME) {
    const meUrl = new URL('/index-me.html', url.origin);
    const res   = await fetch(meUrl.toString(), { headers: request.headers });
    // Return same body but with canonical URL intact
    return new Response(res.body, {
      status:  res.status,
      headers: res.headers,
    });
  }

  return next();
}
