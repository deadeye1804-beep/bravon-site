/* Add this script to your index.html (after the button exists) */
const btn = document.getElementById('genDemoBtn');
const out = document.getElementById('demoResult');

btn?.addEventListener('click', async () => {
  if (!btn || !out) return;
  btn.disabled = true; out.textContent = 'Generating…';
  try {
    const res = await fetch('/.netlify/functions/generate-demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: window.demoDesc || '',
        language: window.demoLang || 'EN'
      })
    });
    const data = await res.json();
    out.innerHTML = data.url
      ? `<a href="${data.url}" target="_blank" rel="noopener">${data.url}</a>`
      : (data.error || 'Something went wrong.');
  } catch (e) {
    out.textContent = e.message || 'Request failed.';
  } finally {
    btn.disabled = false;
  }
});
