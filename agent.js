const launcher = document.getElementById('agent-launcher');
const panel    = document.getElementById('agent-panel');
const closeBtn = document.getElementById('agent-close');
const form     = document.getElementById('agent-form');
const input    = document.getElementById('agent-input');
const feed     = document.getElementById('agent-feed');
const bookBtn  = document.getElementById('agent-book');

// Calendly – setz hier deinen Link
const CAL_LINK = 'https://calendly.com/your-calendly/intro';

launcher.onclick = () => panel.classList.toggle('hidden');
closeBtn.onclick = () => panel.classList.add('hidden');
bookBtn.onclick = () => window.open(CAL_LINK, '_blank');

function addMsg(text, who='bot'){
  const el = document.createElement('div');
  el.className = `msg ${who}`;
  el.innerHTML = text.replace(/\n/g,'<br>');
  feed.appendChild(el);
  feed.scrollTop = feed.scrollHeight;
}

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;
  addMsg(text,'me');
  input.value = '';
  try{
    const res = await fetch('/.netlify/functions/aurevio-chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ message: text, lang: navigator.language || 'en' })
    });
    const data = await res.json();
    addMsg(data.reply || 'Sorry, something went wrong.');
    if(data.cta === 'book') {
      // Optional: automatisch Kalender öffnen
      // window.open(CAL_LINK,'_blank');
    }
  }catch(err){
    addMsg('Network error. Please try again.');
  }
});

// Quick commands
document.addEventListener('keydown', (e)=>{
  if(e.key==='Escape') panel.classList.add('hidden');
});
