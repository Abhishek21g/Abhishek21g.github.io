(function () {
  try {
    if (location.pathname.indexOf('/admin') === 0) return;
    fetch('/api/track/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: location.pathname, referrer: document.referrer || '' }),
      keepalive: true,
    }).catch(function () {});
  } catch (e) {}
})();
