
(() => {
  const root = document.getElementById('firstWeekPlanner');
  if (!root) return;

  const plans = {
    civilian:{label:'Civilian foundation',title:'Build a life before choosing a label',days:[
      ['Land, settle and learn','Claim your starter home, unpack the backpack and learn where your phone, storage and essentials live.'],
      ['Make two real contacts','Introduce yourself in character and save two people you could naturally call again.'],
      ['Earn your first clean money','Complete a starter job or Life Path objective without rushing straight to the highest payout.'],
      ['Learn the city properly','Visit City Hall, a player business and a garage so your character knows where to turn later.'],
      ['Choose one useful skill','Begin a path that fits your personality—driving, business, recycling, collecting or service work.'],
      ['Create a social scene','Spend time at coffee, food, casino or another public spot and let a conversation lead somewhere unexpected.'],
      ['Set a thirty-day goal','Decide what your character wants next: a home, vehicle, career, business, crew or reputation.']
    ]},
    business:{label:'Business builder',title:'Turn a job into a name customers remember',days:[
      ['Learn the customer side','Visit two businesses as a customer and notice what makes each place feel alive.'],
      ['Find work or pitch value','Ask for a shift, offer help or bring one realistic idea to an existing owner.'],
      ['Understand stock and money','Learn how supplies, storage, crafting, sales and business accounts connect.'],
      ['Build three contacts','Meet a supplier, potential colleague and future customer through roleplay.'],
      ['Create a reason to visit','Plan a special item, small event, promotion or service that gives players a scene.'],
      ['Protect the reputation','Handle one complaint, mistake or shortage in character rather than treating it like a menu problem.'],
      ['Write the next chapter','Choose whether to grow inside the business, manage staff or prepare a future ownership proposal.']
    ]},
    mechanic:{label:'Kingz Autos route',title:'Earn trust one vehicle at a time',days:[
      ['Meet the shop properly','Visit Kingz Autos, introduce yourself and learn what the team expects before touching customer cars.'],
      ['Learn the service flow','Follow a vehicle from diagnosis to repair so you understand how the in-house system creates roleplay.'],
      ['Complete a roadside scene','Help with a breakdown, recovery or tow and make the customer interaction matter.'],
      ['Build your first project goal','Choose a vehicle style or project build your character wants to earn over time.'],
      ['Meet the car community','Attend a meet, dealership or garage scene and make contacts beyond the workshop.'],
      ['Show careful workmanship','Complete a repair or upgrade without rushing, and explain the result to the customer.'],
      ['Choose your speciality','Aim toward diagnostics, towing, performance, project cars, customer service or future management.']
    ]},
    service:{label:'Police or EMS route',title:'Become dependable when the city is under pressure',days:[
      ['Register your interest','Use Discord to follow the correct Police or EMS recruitment route and read department expectations.'],
      ['Build a believable reason','Make sure your character background explains why they want responsibility, not just equipment or authority.'],
      ['Learn city standards','Read the rules closely and understand how serious roleplay changes emergency scenes.'],
      ['Observe public life','Spend time around businesses and citizens so you understand the community you may serve.'],
      ['Practise clear communication','Create calm, useful conversations and show that you can listen before reacting.'],
      ['Prepare for training','Review procedures, availability and the attitude expected from a department member.'],
      ['Create a service goal','Choose the kind of officer, medic or leader your character wants to become over time.']
    ]},
    street:{label:'Street reputation',title:'Start small and let trust open the dangerous doors',days:[
      ['Build a legitimate cover','Get housing, basic money and a believable daily routine before chasing criminal progression.'],
      ['Listen more than you speak','Meet people naturally and learn who has influence without asking direct out-of-character questions.'],
      ['Take one small risk','Accept a low-level opportunity and let success or failure create consequences.'],
      ['Earn one person’s trust','Follow through on a promise, debt or favour instead of treating contacts like mission markers.'],
      ['Protect your name','Decide what your character will not do and how they respond when respect is challenged.'],
      ['Create a rival or problem','Let a disagreement, mistake or unpaid favour produce a story that can continue.'],
      ['Choose the next level','Decide whether to build a crew, specialise in a hustle, chase robberies or step back before it costs too much.']
    ]},
    racing:{label:'Car and racing scene',title:'Make the city remember your plate',days:[
      ['Earn the first set of keys','Secure a realistic starter vehicle and give it a reason to matter to your character.'],
      ['Meet Kingz Autos','Learn who can repair, recover and eventually transform the car you are building around.'],
      ['Learn the roads safely','Explore routes, garages and fuel stops before treating every road like a race.'],
      ['Attend a car scene','Join a meet or dealership interaction and introduce yourself through the car, not only the speed.'],
      ['Plan the build','Choose a visual and performance direction you can earn instead of instantly maxing everything.'],
      ['Find competition','Build a respectful rivalry or connection with another driver through roleplay.'],
      ['Create your signature','Choose the plate, colour, sound or driving style the city will eventually associate with your name.']
    ]},
    collector:{label:'Creature collector',title:'Follow the signal and find what everyone else misses',days:[
      ['Open the starter supplies','Learn the card box, scanner and early collection items without skipping the reveal experience.'],
      ['Complete a real scan','Follow a signal, understand distance and capture your first creature through the intended gameplay.'],
      ['Build the first team','Choose creatures for a reason—stats, personality, rarity or the story of where you found them.'],
      ['Learn duplicates and growth','Use duplicate pulls, training and evolution to improve a collection rather than discarding it.'],
      ['Meet another collector','Compare discoveries, trade information or chase the same rare signal with another player.'],
      ['Hunt a district properly','Survey one area, learn its patterns and record where interesting signals appear.'],
      ['Set a collection target','Choose a rare creature, evolved form, complete set or competitive team to chase long term.']
    ]}
  };

  const storageKey = 'glrp-first-week-planner-v1';
  const daysEl = document.getElementById('plannerDays');
  const bar = document.getElementById('plannerProgressBar');
  const percentage = document.getElementById('plannerPercentage');
  const routeLabel = document.getElementById('plannerRouteLabel');
  const routeTitle = document.getElementById('plannerRouteTitle');
  const stateEl = document.getElementById('plannerSaveState');
  let state = {plan:'civilian',completed:{}};

  try { state = {...state,...JSON.parse(localStorage.getItem(storageKey) || '{}')}; } catch (_) {}
  if (!plans[state.plan]) state.plan = 'civilian';
  if (!state.completed || typeof state.completed !== 'object') state.completed = {};

  let hasSavedPlan = false;
  try { hasSavedPlan = Boolean(localStorage.getItem(storageKey)); } catch (_) {}
  if (!hasSavedPlan) {
    try {
      const character = JSON.parse(localStorage.getItem('glrp-character-builder-v1') || '{}');
      const map = {
        'Player business and entrepreneurship':'business','Kingz Autos and car culture':'mechanic',
        'Police Department':'service','EMS and medical roleplay':'service','Street life and criminal progression':'street',
        'Racing and performance cars':'racing','Creature hunting and collecting':'collector'
      };
      if (map[character.cbPath]) state.plan = map[character.cbPath];
    } catch (_) {}
  }

  function key(index){ return `${state.plan}-${index}`; }
  function save(message='Progress saved on this device.'){
    try { localStorage.setItem(storageKey, JSON.stringify(state)); stateEl.textContent=message; stateEl.classList.add('saved'); }
    catch (_) { stateEl.textContent='Progress updated for this visit.'; }
    clearTimeout(save.timer); save.timer=setTimeout(()=>stateEl.classList.remove('saved'),1800);
  }
  function render(){
    const plan=plans[state.plan];
    routeLabel.textContent=plan.label;
    routeTitle.textContent=plan.title;
    root.querySelectorAll('.planner-path').forEach(btn=>btn.classList.toggle('active',btn.dataset.plan===state.plan));
    daysEl.innerHTML='';
    plan.days.forEach((day,index)=>{
      const complete=Boolean(state.completed[key(index)]);
      const article=document.createElement('article');
      article.className=`planner-day${complete?' complete':''}`;
      article.innerHTML=`<div class="planner-day-number"><small>Day</small><strong>${index+1}</strong></div><div class="planner-day-copy"><h3>${day[0]}</h3><p>${day[1]}</p></div><button class="planner-check" type="button" aria-label="${complete?'Mark incomplete':'Mark complete'}" aria-pressed="${complete}">✓</button>`;
      article.querySelector('.planner-check').addEventListener('click',()=>{state.completed[key(index)]=!complete;save();render();});
      daysEl.appendChild(article);
    });
    const done=plan.days.filter((_,index)=>state.completed[key(index)]).length;
    const value=Math.round((done/plan.days.length)*100);
    percentage.textContent=`${value}%`;
    bar.style.width=`${value}%`;
  }

  root.querySelectorAll('.planner-path').forEach(btn=>btn.addEventListener('click',()=>{state.plan=btn.dataset.plan;save(`${plans[state.plan].label} route selected.`);render();}));
  document.getElementById('resetWeekPlan')?.addEventListener('click',()=>{
    if (!window.confirm('Reset the completed tasks for this route?')) return;
    plans[state.plan].days.forEach((_,index)=>delete state.completed[key(index)]);
    save('This route has been reset.'); render();
  });
  document.getElementById('copyWeekPlan')?.addEventListener('click',async()=>{
    const plan=plans[state.plan];
    const output=[`GLRP FIRST WEEK PLAN — ${plan.label.toUpperCase()}`,plan.title,'',...plan.days.map((day,index)=>`${state.completed[key(index)]?'✓':'○'} DAY ${index+1}: ${day[0]}\n   ${day[1]}`),'','Created with the GLRP website First Week Planner.'].join('\n');
    try { await navigator.clipboard.writeText(output); save('First-week plan copied.'); }
    catch (_) { const area=document.createElement('textarea');area.value=output;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();save('First-week plan copied.'); }
  });

  render();
})();
