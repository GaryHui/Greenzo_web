const COUNTRY_LANGUAGE_MAP = {
  CN: 'zh',
  JP: 'ja',
  HK: 'hk',
  MO: 'hk',
  TW: 'hk',
};

function mapCountryToLanguage(country) {
  if (!country) return null;
  return COUNTRY_LANGUAGE_MAP[country.toUpperCase()] || 'en';
}

export default function handler(req, res) {
  const headerValue = req.headers['x-vercel-ip-country'];
  const country = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  const language = mapCountryToLanguage(country);

  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600');
  res.status(200).json({
    country: country || null,
    language,
  });
}
