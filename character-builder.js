
// V3.1.6 — GLRP role matcher
(() => {
  const root = document.getElementById('roleMatcher');
  if (!root) return;
  const questions = [...root.querySelectorAll('.match-question')];
  const progress = [...root.querySelectorAll('.matcher-progress span')];
  const label = document.getElementById('matcherStepLabel');
  const back = document.getElementById('matcherBack');
  const controls = document.getElementById('matcherControls');
  const result = document.getElementById('matchResult');
  const restart = document.getElementById('matchRestart');
  const scores = {police:0,ems:0,mechanic:0,business:0,street:0,racing:0,collector:0,civilian:0};
  const answers = [];
  let step = 0;

  const roles = {
    police:{title:'Police Department',line:'Be the person the city notices when control matters most.',description:'You are likely to enjoy structured teamwork, investigations, patrol scenes and the responsibility of making decisions that affect other characters. Police roleplay gives you regular interaction with every side of GLRP—from everyday citizens to the city’s biggest criminal stories.',first:'Join Discord, register your Police interest and begin with the department’s recruitment and training route.',future:'Specialist policing, investigations, command responsibility and a reputation built through how you handle pressure.',link:'departments.html#recruitment'},
    ems:{title:'EMS & Medical',line:'Turn the city’s worst moments into roleplay people remember.',description:'You value teamwork, responsibility and scenes where communication matters. EMS gives you the chance to save lives, build patient stories and become one of the names players trust when everything goes wrong.',first:'Register your EMS interest, meet the medical team and prepare for department training.',future:'Emergency response, hospital roleplay, specialist medical paths and future leadership.',link:'departments.html#recruitment'},
    mechanic:{title:'Kingz Autos',line:'Build machines, customers and a name the whole car scene knows.',description:'You are drawn to hands-on progression and visible results. At Kingz Autos, every repair, recovery and project build can create customers, rivals and long-term connections across the city.',first:'Apply for Kingz Autos, learn the service flow and start building trust one customer at a time.',future:'Custom work, roadside recovery, project vehicles, management and influence across GLRP’s automotive scene.',link:'city-guide.html#directory'},
    business:{title:'Player Business Owner',line:'Create the place other players choose to spend their time.',description:'You enjoy building something social and protecting its reputation. A GLRP business can become a meeting place, employer and daily source of roleplay shaped by your staff, customers and decisions.',first:'Bring a clear business idea to Discord or join an existing team and learn how the player economy works.',future:'Ownership, staff management, supplier relationships, events and a brand recognised throughout the city.',link:'city-guide.html#directory'},
    street:{title:'Street Progression',line:'Start with little, earn the right contacts and decide how far you will go.',description:'You enjoy risk, consequences and a reputation earned through choices rather than menus. Street life can lead from small hustles into crews, robberies, rivalries and deeper opportunities that must be discovered in character.',first:'Begin with starter work, meet people naturally and let contacts open the next door instead of rushing progression.',future:'A known crew, deeper criminal routes, rivalries, territory and consequences that follow your name.',link:'gameplay.html#systems'},
    racing:{title:'Racing & Car Culture',line:'Build the car, learn the roads and make the city remember your plate.',description:'You want competition, automotive identity and scenes that start at the workshop and end under pressure. Racing in GLRP connects builds, meets, rivalries and reputation into one lifestyle.',first:'Get established, build a road-worthy car and find the people connected to meets and racing culture.',future:'Custom builds, recognised rivals, organised events, high-pressure runs and a place in the city’s car scene.',link:'gameplay.html#activities'},
    collector:{title:'Creature Hunter & Collector',line:'Follow the signal, find what others miss and build a collection nobody can copy.',description:'You enjoy discovery, long-term progression and rare rewards. GLRP’s scanner, creature, card-pack and collection systems give you a separate adventure that can grow alongside your main character story.',first:'Use your starter scanner and card supplies, learn how signals work and begin building your first team.',future:'Rare captures, evolved creatures, completed collections, trading and competitive team-building.',link:'gameplay.html#systems'},
    civilian:{title:'Civilian Life',line:'Start small and let the people you meet decide where the story goes.',description:'You prefer freedom over a fixed label. Civilian life lets you explore jobs, businesses, homes, hobbies and social scenes before committing to a department, crew or specialist path.',first:'Follow the New Player Handbook, complete starter progression and speak to people instead of trying to speed-run the city.',future:'A home, career, business, community role or completely unexpected direction shaped through organic roleplay.',link:'new-players.html#start'}
  };

  function showStep(index){
    step = Math.max(0, Math.min(index, questions.length - 1));
    questions.forEach((q,i)=>q.classList.toggle('active',i===step));
    result.classList.remove('active');
    progress.forEach((bar,i)=>{bar.classList.toggle('done',i<step);bar.classList.toggle('active',i===step);});
    label.textContent = `Question ${step + 1} of ${questions.length}`;
    back.hidden = step === 0;
    controls.hidden = false;
  }

  function choose(tags){
    const list = tags.split(/\s+/).filter(Boolean);
    answers[step] = list;
    list.forEach(tag => { if (tag in scores) scores[tag] += 1; });
    if (step < questions.length - 1) showStep(step + 1); else showResult();
  }

  function undoStep(){
    if (step <= 0) return;
    const previousAnswer = answers[step - 1] || [];
    previousAnswer.forEach(tag => { if (tag in scores) scores[tag] = Math.max(0, scores[tag] - 1); });
    answers[step - 1] = null;
    showStep(step - 1);
  }

  function showResult(){
    questions.forEach(q=>q.classList.remove('active'));
    progress.forEach(bar=>{bar.classList.add('done');bar.classList.remove('active');});
    label.textContent = 'Your match is ready';
    controls.hidden = true;
    const priority = ['police','ems','mechanic','business','street','racing','collector','civilian'];
    const winner = priority.reduce((best,key)=>scores[key] > scores[best] ? key : best, priority[0]);
    const role = roles[winner];
    document.getElementById('matchResultTitle').textContent = role.title;
    document.getElementById('matchResultLine').textContent = role.line;
    document.getElementById('matchResultDescription').textContent = role.description;
    document.getElementById('matchResultFirst').textContent = role.first;
    document.getElementById('matchResultFuture').textContent = role.future;
    document.getElementById('matchExploreLink').href = role.link;
    result.classList.add('active');
  }

  function reset(){
    Object.keys(scores).forEach(key=>scores[key]=0);
    answers.length = 0;
    showStep(0);
    root.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
  }

  root.querySelectorAll('.match-option').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.matchTags || 'civilian')));
  back.addEventListener('click',undoStep);
  restart.addEventListener('click',reset);
  showStep(0);
})();
