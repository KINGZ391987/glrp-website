<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="title desc">
  <title id="title">GLRP emblem</title>
  <desc id="desc">A red and gold circular GLRP emblem.</desc>
  <defs>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff435d"/>
      <stop offset=".48" stop-color="#9d1028"/>
      <stop offset="1" stop-color="#ffd073"/>
    </linearGradient>
    <radialGradient id="core" cx="50%" cy="40%" r="65%">
      <stop offset="0" stop-color="#30101a"/>
      <stop offset="1" stop-color="#08090d"/>
    </radialGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <circle cx="256" cy="256" r="226" fill="url(#core)" stroke="url(#ring)" stroke-width="18"/>
  <circle cx="256" cy="256" r="188" fill="none" stroke="#ffffff" stroke-opacity=".08" stroke-width="2"/>
  <path d="M118 337 175 157l34 111h94l35-111 56 180-62-45-29 58h-94l-29-58z" fill="none" stroke="url(#ring)" stroke-width="18" stroke-linejoin="round" filter="url(#glow)"/>
  <text x="256" y="286" text-anchor="middle" fill="#f7f1e7" font-family="Arial Black, Arial, sans-serif" font-size="90" letter-spacing="6">GLRP</text>
  <text x="256" y="385" text-anchor="middle" fill="#ffd073" font-family="Arial, sans-serif" font-size="20" letter-spacing="8">LOYALTY • RESPECT • DISCIPLINE</text>
</svg>
