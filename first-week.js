
(() => {
  const form = document.getElementById('characterBuilderForm');
  if (!form) return;

  const ids = ['cbName','cbAge','cbOrigin','cbPath','cbStrength','cbFlaw','cbGoal','cbStory','cbScene'];
  const fields = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
  const storageKey = 'glrp-character-builder-v1';
  const saveState = document.getElementById('builderSaveState');

  const preview = {
    name: document.getElementById('previewName'), meta: document.getElementById('previewMeta'), origin: document.getElementById('previewOrigin'),
    path: document.getElementById('previewPath'), strength: document.getElementById('previewStrength'), flaw: document.getElementById('previewFlaw'),
    goal: document.getElementById('previewGoal'), story: document.getElementById('previewStory'), scene: document.getElementById('previewScene'),
    quote: document.getElementById('previewQuote'), score: document.getElementById('previewScore'), scoreNumber: document.getElementById('previewScoreNumber')
  };

  const clean = value => String(value || '').trim();
  const getData = () => Object.fromEntries(ids.map(id => [id, clean(fields[id].value)]));

  const pathQuotes = {
    'Civilian life and honest work': '“A quiet beginning can still become the story everyone remembers.”',
    'Player business and entrepreneurship': '“Build somewhere people choose to return to—and give them a reason to know your name.”',
    'Kingz Autos and car culture': '“Every machine has a story. Your character could be the one trusted to bring it back to life.”',
    'Police Department': '“The badge creates authority. The choices behind it create reputation.”',
    'EMS and medical roleplay': '“When the city falls apart, your character can be the reason somebody gets another chapter.”',
    'Street life and criminal progression': '“Respect is never handed over. It is earned through choices the city does not forget.”',
    'Racing and performance cars': '“Some reputations are built in conversation. Others are built one corner at a time.”',
    'Creature hunting and collecting': '“The rarest discoveries belong to the players willing to look where everyone else walks past.”'
  };

  function updateCounters(){
    document.querySelectorAll('[data-counter-for]').forEach(counter => {
      const input = document.getElementById(counter.dataset.counterFor);
      if (!input) return;
      counter.textContent = `${input.value.length} / ${input.maxLength}`;
      counter.classList.toggle('limit', input.value.length >= input.maxLength * .9);
    });
  }

  function completionScore(data){
    const weights = {cbName:14,cbAge:8,cbOrigin:10,cbPath:12,cbStrength:8,cbFlaw:10,cbGoal:14,cbStory:16,cbScene:8};
    let total = 0;
    Object.entries(weights).forEach(([key,weight]) => {
      const value = data[key];
      if (!value) return;
      if (key === 'cbStory') total += weight * Math.min(1, value.length / 220);
      else if (['cbGoal','cbScene'].includes(key)) total += weight * Math.min(1, value.length / 90);
      else total += weight;
    });
    return Math.round(total);
  }

  function updatePreview(){
    const d = getData();
    preview.name.textContent = d.cbName || 'Unnamed Character';
    preview.meta.textContent = `${d.cbAge ? `Age ${d.cbAge}` : 'Age unknown'} • ${d.cbPath || 'Direction undecided'}`;
    preview.origin.textContent = d.cbOrigin || 'Not chosen yet';
    preview.path.textContent = d.cbPath || 'Not chosen yet';
    preview.strength.textContent = d.cbStrength || 'Still to be defined';
    preview.flaw.textContent = d.cbFlaw || 'Still to be defined';
    preview.goal.textContent = d.cbGoal || 'Give your character something meaningful to chase.';
    preview.story.textContent = d.cbStory || 'Their history will appear here as you build it.';
    preview.scene.textContent = d.cbScene || 'Plan a small first scene that gives other players a reason to respond.';
    preview.quote.textContent = pathQuotes[d.cbPath] || '“A good character arrives with a reason to move forward—and enough flaws for the city to push back.”';
    const score = completionScore(d);
    preview.score.style.setProperty('--score', `${score}%`);
    preview.scoreNumber.textContent = score;
    updateCounters();
  }

  let saveTimer;
  function saveDraft(){
    clearTimeout(saveTimer);
    saveState.textContent = 'Saving your draft…';
    saveState.classList.remove('saved');
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(getData()));
        saveState.textContent = 'Draft saved on this device.';
        saveState.classList.add('saved');
      } catch (_) {
        saveState.textContent = 'Draft preview updated. Local saving is unavailable in this browser.';
      }
    }, 220);
  }

  function loadDraft(){
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      ids.forEach(id => { if (saved[id] !== undefined && fields[id]) fields[id].value = saved[id]; });
    } catch (_) {}
    updatePreview();
  }

  function draftText(){
    const d = getData();
    return [
      'GLRP CHARACTER APPLICATION DRAFT',
      '--------------------------------',
      `Character Name: ${d.cbName || 'Not decided'}`,
      `Character Age: ${d.cbAge || 'Not decided'}`,
      `Background: ${d.cbOrigin || 'Not decided'}`,
      `Starting Direction: ${d.cbPath || 'Not decided'}`,
      `Strongest Quality: ${d.cbStrength || 'Not decided'}`,
      `Character Flaw: ${d.cbFlaw || 'Not decided'}`,
      '',
      'WHAT THEY WANT FROM THE CITY',
      d.cbGoal || 'Not written yet.',
      '',
      'SHORT BACKGROUND STORY',
      d.cbStory || 'Not written yet.',
      '',
      'FIRST SCENE I WANT TO CREATE',
      d.cbScene || 'Not written yet.',
      '',
      'This is a preparation draft created with the GLRP website character builder.'
    ].join('\n');
  }

  async function copyDraft(){
    const text = draftText();
    try {
      await navigator.clipboard.writeText(text);
      saveState.textContent = 'Application draft copied. Paste it into the correct Discord channel.';
      saveState.classList.add('saved');
    } catch (_) {
      const area = document.createElement('textarea'); area.value = text; area.style.position='fixed'; area.style.opacity='0';
      document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
      saveState.textContent = 'Application draft copied.'; saveState.classList.add('saved');
    }
  }

  const promptIdeas = {
    fresh:{cbOrigin:'Moved for a fresh start',cbPath:'Civilian life and honest work',cbStrength:'Patient and willing to learn',cbFlaw:'Too eager to trust the wrong people',cbGoal:'Build a stable life, find reliable work and eventually earn a home that feels permanent.',cbStory:'They arrived with limited money and no powerful contacts after realising their old life was going nowhere. They are determined to rebuild without pretending the past never happened.',cbScene:'Ask around for honest work, meet another new arrival and decide whether the first person offering help can really be trusted.'},
    business:{cbOrigin:'Looking for work and opportunity',cbPath:'Player business and entrepreneurship',cbStrength:'Ambitious and good with people',cbFlaw:'Struggles to accept failure or criticism',cbGoal:'Start as an employee, learn how the city economy works and eventually create a business people genuinely value.',cbStory:'They grew up watching small businesses disappear around them and believe the right idea, team and reputation can create something stronger.',cbScene:'Walk into a player business looking for work and pitch one small idea that could help bring in more customers.'},
    service:{cbOrigin:'Following family or friends',cbPath:'EMS and medical roleplay',cbStrength:'Calm when other people panic',cbFlaw:'Carries guilt after outcomes they cannot control',cbGoal:'Earn training, become someone citizens trust in an emergency and eventually mentor newer medics.',cbStory:'A serious incident involving somebody close to them changed how they see emergency work. They arrived wanting to become useful when a scene turns bad.',cbScene:'Visit the hospital to ask about recruitment and unexpectedly help calm somebody waiting for news about a patient.'},
    street:{cbOrigin:'Escaping an old reputation',cbPath:'Street life and criminal progression',cbStrength:'Loyal once trust is earned',cbFlaw:'Reacts badly when disrespected',cbGoal:'Build contacts and financial security without becoming the same kind of person they once feared.',cbStory:'They left behind a place where one mistake followed them everywhere. Los Santos offers a clean map, but not necessarily a clean path.',cbScene:'Search for quick work, meet someone offering easy money and decide how much risk is worth taking on the first night.'},
    collector:{cbOrigin:'Returning after years away',cbPath:'Creature hunting and collecting',cbStrength:'Observant and persistent',cbFlaw:'Becomes obsessed and ignores practical responsibilities',cbGoal:'Discover rare creatures, build a respected collection and uncover places in the city most people never notice.',cbStory:'They remember stories about strange discoveries around Los Santos and have returned to prove that the rumours were more than childhood nonsense.',cbScene:'Use the starter scanner near an overlooked part of the city and meet another collector chasing the same signal.'}
  };

  document.querySelectorAll('.builder-prompt').forEach(button => button.addEventListener('click', () => {
    const idea = promptIdeas[button.dataset.builderPrompt];
    if (!idea) return;
    Object.entries(idea).forEach(([id,value]) => { if (fields[id]) fields[id].value = value; });
    updatePreview(); saveDraft();
  }));

  const sparks = [
    'A relative already lives in the city—but does not know your character has arrived.',
    'Your character owes a favour to somebody whose real identity they do not know.',
    'A small object in their starter backpack connects to a person from their past.',
    'They recognise a vehicle in Los Santos that should not be there.',
    'Their first honest job creates an opportunity to make dishonest money.',
    'They came to find one person, but only know a nickname and an old location.',
    'Their strongest quality becomes dangerous when pushed too far.',
    'The person who helps them first may be the worst influence they could meet.'
  ];
  let sparkIndex = 0;
  document.getElementById('randomCharacterSpark')?.addEventListener('click', () => {
    sparkIndex = (sparkIndex + 1) % sparks.length;
    preview.quote.textContent = `Story spark: ${sparks[sparkIndex]}`;
  });

  ids.forEach(id => fields[id]?.addEventListener('input', () => { updatePreview(); saveDraft(); }));
  ids.forEach(id => fields[id]?.addEventListener('change', () => { updatePreview(); saveDraft(); }));
  form.addEventListener('submit', event => { event.preventDefault(); updatePreview(); saveDraft(); document.getElementById('characterPreview')?.scrollIntoView({behavior:'smooth',block:'center'}); });
  document.getElementById('copyCharacterDraft')?.addEventListener('click', copyDraft);
  document.getElementById('clearCharacterDraft')?.addEventListener('click', () => {
    if (!window.confirm('Clear the saved character draft on this device?')) return;
    form.reset();
    try { localStorage.removeItem(storageKey); } catch (_) {}
    updatePreview();
    saveState.textContent = 'Character draft cleared.';
    saveState.classList.remove('saved');
  });

  loadDraft();
})();
