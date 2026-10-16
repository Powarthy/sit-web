// Read-only public checks. Run from outside the tailnet (e.g. GitHub Actions).
const base = process.env.SITE_URL || 'https://kahvilathefrench.cafe';
for (const path of ['/fr', '/en', '/fi', '/api/brunch/health', '/api/brunch/dates']) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(25000), cache: 'no-store' });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  if (path.includes('/api/')) {
    const body = await response.json();
    if (body.ok !== true) throw new Error(`${path}: invalid contract`);
    if (path.endsWith('/dates')) {
      for (const date of body.items) {
        for (const locale of ['fr', 'en', 'fi']) {
          const menu = await fetch(new URL(`/api/brunch/menu?date=${date.date}&locale=${locale}`, base), { signal: AbortSignal.timeout(25000) });
          if (!menu.ok || (await menu.json()).ok !== true) throw new Error(`menu ${date.date} ${locale} unavailable`);
        }
      }
    }
  }
  console.log(`${path}: OK`);
}
