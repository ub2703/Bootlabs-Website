import { onRequestOptions as __api_whitepaper_lead_js_onRequestOptions } from "/Users/utkarshbhatnagar/bootlabs-clone/Bootlabs Website/functions/api/whitepaper-lead.js"
import { onRequestPost as __api_whitepaper_lead_js_onRequestPost } from "/Users/utkarshbhatnagar/bootlabs-clone/Bootlabs Website/functions/api/whitepaper-lead.js"

export const routes = [
    {
      routePath: "/api/whitepaper-lead",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_whitepaper_lead_js_onRequestOptions],
    },
  {
      routePath: "/api/whitepaper-lead",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_whitepaper_lead_js_onRequestPost],
    },
  ]