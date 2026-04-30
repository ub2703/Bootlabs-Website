/**
 * Cloudflare Pages Function — Whitepaper Lead Capture
 * Endpoint: POST /api/whitepaper-lead
 *
 * Setup:
 *  1. wrangler d1 create bootlabs-leads
 *  2. wrangler d1 execute bootlabs-leads --file=./db/schema.sql
 *  3. In Cloudflare Pages dashboard → Settings → Functions → D1 bindings:
 *     Variable name: LEADS_DB   →   Database: bootlabs-leads
 */

export async function onRequestPost({ request, env }) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    // Parse JSON body
    const body = await request.json().catch(() => null);
    if (!body) {
      return Response.json({ error: 'Invalid request body' }, { status: 400, headers: corsHeaders });
    }

    const { name, email, company, phone, interest, whitepaper } = body;

    // Required field validation
    if (!name || !email || !company) {
      return Response.json({ error: 'name, email, and company are required' }, { status: 400, headers: corsHeaders });
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400, headers: corsHeaders });
    }

    // Insert into D1
    await env.LEADS_DB.prepare(
      `INSERT INTO whitepaper_leads (name, email, company, phone, interest, whitepaper, ip, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    ).bind(
      name.trim(),
      email.trim().toLowerCase(),
      company.trim(),
      (phone || '').trim(),
      (interest || 'Not specified').trim(),
      (whitepaper || 'Unknown').trim(),
      request.headers.get('CF-Connecting-IP') || ''
    ).run();

    return Response.json({ success: true }, { headers: corsHeaders });

  } catch (err) {
    console.error('[whitepaper-lead] Error:', err.message);
    return Response.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle preflight OPTIONS
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
