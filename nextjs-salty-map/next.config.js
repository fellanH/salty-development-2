/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['uploads-ssl.webflow.com', 'assets.website-files.com'],
  },
  env: {
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    NEXT_PUBLIC_WEBFLOW_SITE_ID: process.env.NEXT_PUBLIC_WEBFLOW_SITE_ID,
    NEXT_PUBLIC_WEBFLOW_BEACHES_COLLECTION_ID: process.env.NEXT_PUBLIC_WEBFLOW_BEACHES_COLLECTION_ID,
    NEXT_PUBLIC_WEBFLOW_POI_COLLECTION_ID: process.env.NEXT_PUBLIC_WEBFLOW_POI_COLLECTION_ID,
  },
}

module.exports = nextConfig