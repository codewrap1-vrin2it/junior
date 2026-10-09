import { useState, useEffect } from 'react';
import { Flame, CloudRain, Activity, Stethoscope, UserX, Phone, MapPin, CheckSquare, Trophy, ShieldCheck, PlayCircle, ChevronLeft, AlertTriangle, LayoutDashboard, Lightbulb, Medal, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';

const emergencies = [
  { id: 'fire', name: 'Fire Incident', icon: Flame, color: 'text-red-500', bg: 'bg-red-500', lightBg: 'bg-red-50' },
  { id: 'flood', name: 'Flash Flood', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-500', lightBg: 'bg-blue-50' },
  { id: 'earthquake', name: 'Earthquake', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-500', lightBg: 'bg-amber-50' },
  { id: 'injury', name: 'Minor Injury', icon: Stethoscope, color: 'text-emerald-500', bg: 'bg-emerald-500', lightBg: 'bg-emerald-50' },
  { id: 'stranger', name: 'Stranger Danger', icon: UserX, color: 'text-purple-500', bg: 'bg-purple-500', lightBg: 'bg-purple-50' },
];

const scenarioSteps = {
  fire: [
    "Stop, Drop, and Roll if your clothes catch fire.",
    "Stay low to crawl under smoke.",
    "Do not open doors that feel hot.",
    "Get out and stay out. Don't go back for anything."
  ],
  flood: [
    "Move to higher ground immediately.",
    "Do not walk or swim through flowing water.",
    "Stay away from power lines and electrical wires.",
    "Wait for adults to tell you it's safe."
  ],
  earthquake: [
    "Drop to your hands and knees.",
    "Cover your head and neck under a sturdy table or desk.",
    "Hold on to your shelter until the shaking stops.",
    "Stay away from windows and tall furniture."
  ],
  injury: [
    "Tell an adult immediately.",
    "If bleeding, press firmly on the wound with a clean cloth.",
    "Do not move someone if they have fallen badly.",
    "Stay calm and wait for help."
  ],
  stranger: [
    "Yell 'NO' loudly if someone tries to take you.",
    "Run away as fast as you can.",
    "Tell a trusted adult right away.",
    "Never go anywhere with a stranger."
  ]
};

const safetyItems = [
  { id: 'whistle', name: 'Whistle', desc: 'To signal for help loudly' },
  { id: 'flashlight', name: 'Flashlight', desc: 'To see in the dark' },
  { id: 'firstaid', name: 'First Aid Kit', desc: 'For minor injuries and cuts' },
  { id: 'water', name: 'Bottled Water', desc: 'Stay hydrated during emergencies' },
  { id: 'idcard', name: 'ID Card', desc: 'With emergency contacts and info' },
];

const quizzes = {
  fire: [
    { q: "What should you do if your clothes catch fire?", options: ["Run fast", "Stop, Drop, and Roll", "Get a drink of water"], a: 1 },
    { q: "How should you move in a room full of smoke?", options: ["Walk normally", "Jump around", "Stay low and crawl"], a: 2 },
    { q: "Should you go back inside for a toy?", options: ["Yes, if it's quick", "No, never go back", "Only for my favorite toy"], a: 1 },
    { q: "What number should you call for a fire emergency?", options: ["101", "102", "112"], a: 0 },
    { q: "If a door feels hot, what should you do?", options: ["Open it fast", "Find another way out", "Wait near the door"], a: 1 }
  ],
  earthquake: [
    { q: "What is the first thing you should do?", options: ["Drop to the floor", "Run outside", "Call a friend"], a: 0 },
    { q: "Where should you take cover?", options: ["Under a sturdy table", "Near a window", "On the bed"], a: 0 },
    { q: "When is it safe to come out?", options: ["When the shaking stops", "After 1 minute", "When you feel like it"], a: 0 },
    { q: "What should you stay away from during an earthquake?", options: ["Heavy furniture and windows", "The floor", "Soft pillows"], a: 0 }
  ],
  flood: [
    { q: "What should you do during a flood?", options: ["Move to higher ground", "Play in the water", "Stay in the basement"], a: 0 },
    { q: "Should you walk through flowing water?", options: ["Yes, it's fun", "No, it's dangerous", "Only with boots"], a: 1 },
    { q: "Who should you wait for to tell you it's safe?", options: ["Friends", "Pets", "Adults or Emergency Workers"], a: 2 }
  ],
  injury: [
    { q: "What should you do if someone falls badly?", options: ["Try to move them", "Tell an adult immediately", "Ignore them"], a: 1 },
    { q: "How do you stop a cut from bleeding?", options: ["Wash it with mud", "Press firmly with a clean cloth", "Blow on it"], a: 1 }
  ],
  stranger: [
    { q: "What should you do if a stranger tries to take you?", options: ["Go with them", "Yell 'NO' loudly and run", "Ask them questions"], a: 1 },
    { q: "Who should you tell if a stranger approaches you?", options: ["A trusted adult", "A friend", "Keep it a secret"], a: 0 }
  ],
  default: [
    { q: "Who should you call in an emergency?", options: ["A friend", "Emergency Services (112)", "Nobody"], a: 1 },
    { q: "Should you stay calm?", options: ["Yes", "No", "Only sometimes"], a: 0 },
    { q: "Is it good to be prepared?", options: ["Yes", "No", "Maybe"], a: 0 }
  ]
};

const mockPeers = [
  { id: 'p1', name: 'Aarav', avatar: '🦸‍♂️', score: 450 },
  { id: 'p2', name: 'Zara', avatar: '🦊', score: 380 },
  { id: 'p3', name: 'Rohan', avatar: '🚀', score: 320 },
  { id: 'p4', name: 'Ananya', avatar: '🌟', score: 210 },
  { id: 'p5', name: 'Kabir', avatar: '🦁', score: 150 },
];

function playChime() {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
  osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // C6
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.5);
}

function speak(text: string) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'checklist' | 'contacts' | 'leaderboard'>('home');
  const [activeEmergency, setActiveEmergency] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);

  // Profile State
  const [profile, setProfile] = useState<{name: string, avatar: string, score: number, completedItems: string[], completedDrills: string[]} | null>(null);
  const [onboardName, setOnboardName] = useState('');
  const [onboardAvatar, setOnboardAvatar] = useState('🦸‍♂️');

  useEffect(() => {
    const saved = localStorage.getItem('lifeline_user_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const saveProfile = (newProfile: any) => {
    setProfile(newProfile);
    localStorage.setItem('lifeline_user_profile', JSON.stringify(newProfile));
  };

  const handleOnboard = () => {
    if (!onboardName.trim()) return;
    const newProfile = {
      name: onboardName.trim(),
      avatar: onboardAvatar,
      score: 0,
      completedItems: [],
      completedDrills: []
    };
    saveProfile(newProfile);
    playChime();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const handleLogout = () => {
    localStorage.removeItem('lifeline_user_profile');
    setProfile(null);
    setOnboardName('');
    setOnboardAvatar('🦸‍♂️');
  };

  const updateScore = (points: number) => {
    if (!profile) return;
    saveProfile({ ...profile, score: profile.score + points });
    if (points > 0) {
      playChime();
    }
  };

  const toggleItem = (id: string) => {
    if (!profile) return;
    let newItems = [...profile.completedItems];
    let scoreChange = 0;
    if (newItems.includes(id)) {
      newItems = newItems.filter(i => i !== id);
      scoreChange = -10;
    } else {
      newItems.push(id);
      scoreChange = 10;
      confetti({ particleCount: 50, spread: 60, angle: 90, origin: { y: 0.8 }, shapes: ['star'] });
    }
    saveProfile({ ...profile, completedItems: newItems, score: profile.score + scoreChange });
    if (scoreChange > 0) playChime();
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] p-10 max-w-lg w-full shadow-2xl text-center">
          <div className="bg-blue-100 text-blue-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-2">Welcome to LifeLine!</h1>
          <p className="text-slate-500 mb-8 text-lg">Your smart emergency companion. Let's create your profile.</p>
          
          <div className="mb-8">
            <label className="block text-left text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Pick your avatar</label>
            <div className="flex justify-center gap-4 text-4xl">
              {['🦸‍♂️', '🦊', '🚀', '🌟', '🛡️'].map(av => (
                <button 
                  key={av} 
                  onClick={() => setOnboardAvatar(av)}
                  className={`p-2 rounded-2xl transition-all ${onboardAvatar === av ? 'bg-blue-100 scale-125 ring-4 ring-blue-500' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-left text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">What's your name?</label>
            <input 
              type="text" 
              value={onboardName}
              onChange={(e) => setOnboardName(e.target.value)}
              placeholder="e.g. Arjun"
              className="w-full text-2xl font-bold bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-center"
            />
          </div>

          <button 
            onClick={handleOnboard}
            disabled={!onboardName.trim()}
            className="w-full bg-blue-600 text-white font-bold text-xl py-5 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
          >
            Start My Adventure &rarr;
          </button>
        </div>
      </div>
    );
  }

  const renderSidebar = () => (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-xl">
          <AlertTriangle size={32} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">LifeLine</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Junior</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
        <button 
          onClick={() => { setActiveTab('home'); setActiveEmergency(null); }}
          className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'home' && !activeEmergency ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
          <LayoutDashboard size={24} />
          Dashboard
        </button>
        <button 
          onClick={() => { setActiveTab('checklist'); setActiveEmergency(null); }}
          className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'checklist' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
          <CheckSquare size={24} />
          Go-Bag
        </button>
        <button 
          onClick={() => { setActiveTab('leaderboard'); setActiveEmergency(null); }}
          className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'leaderboard' ? 'bg-purple-50 text-purple-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
          <Trophy size={24} />
          Leaderboard
        </button>
        <button 
          onClick={() => { setActiveTab('contacts'); setActiveEmergency(null); }}
          className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'contacts' ? 'bg-orange-50 text-orange-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
          <Phone size={24} />
          Contacts
        </button>
      </nav>

      <div className="p-4 mb-4">
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-20">
            <Lightbulb size={40} />
          </div>
          <div className="flex items-center gap-2 text-amber-600 mb-2 relative z-10">
            <Lightbulb size={20} />
            <h3 className="font-bold">Safety Tip</h3>
          </div>
          <p className="text-sm text-amber-800 relative z-10">Always know two ways out of every room in your house!</p>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl border-2 border-white shadow-sm">
            {profile.avatar}
          </div>
          <div>
            <p className="font-bold text-slate-800">{profile.name}</p>
            <p className="text-sm font-bold text-amber-500 flex items-center gap-1">
              <Medal size={14} /> {profile.score} pts
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );

  const renderDashboard = () => (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Welcome back, {profile.name}!</p>
          <h2 className="text-4xl font-black text-slate-800">Ready to learn about safety? 🛡️</h2>
        </div>
        <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100">
          <Trophy className="text-amber-500" size={24} />
          <span className="font-bold text-xl text-slate-700">{profile.score} Points</span>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl p-10 text-white shadow-lg shadow-blue-500/20 mb-10 flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold tracking-widest uppercase mb-4 inline-block backdrop-blur-sm">Module 1</span>
          <h3 className="text-4xl font-black mb-4">Be Prepared, Be Safe.</h3>
          <p className="text-blue-50 text-lg mb-8">Learn what to do in different emergencies. Earn points by completing scenarios and packing your go-bag!</p>
          <button onClick={() => { setActiveEmergency('fire'); setCurrentStep(0); }} className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-md hover:scale-105 active:scale-95 transition-all">
            Start First Scenario &rarr;
          </button>
        </div>
        <div className="hidden lg:block relative z-10 mr-10 animate-bounce">
          <ShieldCheck size={180} className="text-white opacity-90 drop-shadow-2xl" />
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-20 translate-x-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-white opacity-10 rounded-full translate-y-20 blur-2xl"></div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-sm text-slate-400 font-bold mb-2 uppercase tracking-widest">Safety Score</div>
          <div className="text-3xl font-black text-slate-800 flex items-center gap-2">
            <Trophy className="text-amber-500" /> {profile.score}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-sm text-slate-400 font-bold mb-2 uppercase tracking-widest">Go-Bag</div>
          <div className="text-3xl font-black text-slate-800 flex items-center gap-2">
            <CheckSquare className="text-emerald-500" /> {profile.completedItems.length}/{safetyItems.length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-sm text-slate-400 font-bold mb-2 uppercase tracking-widest">Drills</div>
          <div className="text-3xl font-black text-slate-800 flex items-center gap-2">
            <Activity className="text-blue-500" /> {profile.completedDrills.length}/{emergencies.length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-sm text-slate-400 font-bold mb-2 uppercase tracking-widest">Status</div>
          <div className="text-3xl font-black text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-purple-500" /> {profile.completedDrills.length === emergencies.length ? 'Pro' : 'Scout'}
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-slate-800 mb-6 uppercase tracking-widest text-sm">Emergency Scenarios</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emergencies.map(em => {
          const isCompleted = profile.completedDrills.includes(em.id);
          return (
            <button
              key={em.id}
              onClick={() => { setActiveEmergency(em.id); setCurrentStep(0); setShowQuiz(false); }}
              className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-slate-200 transition-all text-left flex flex-col group relative"
            >
              {isCompleted && (
                <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                  <CheckSquare size={14} /> Done
                </div>
              )}
              <div className={`${em.lightBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <em.icon size={32} className={em.color} />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">{em.name}</h4>
              <p className="text-slate-500 mb-6">Learn the steps to stay safe during a {em.name.toLowerCase()}.</p>
              <div className={`mt-auto flex items-center gap-2 text-sm font-bold transition-colors ${isCompleted ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-700'}`}>
                {isCompleted ? <ShieldCheck size={18} /> : <PlayCircle size={18} />}
                {isCompleted ? 'REVIEW SCENARIO' : 'START SCENARIO'}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );

  const renderStepViewer = () => {
    if (!activeEmergency) return null;
    const steps = scenarioSteps[activeEmergency as keyof typeof scenarioSteps] || [];
    const stepText = steps[currentStep];
    const emConfig = emergencies.find(e => e.id === activeEmergency);

    return (
      <div className="max-w-4xl mx-auto h-full flex flex-col py-8 animate-in slide-in-from-right-8 duration-300">
        <button onClick={() => { setActiveEmergency(null); setShowQuiz(false); }} className="mb-8 text-slate-500 font-bold flex items-center gap-2 hover:text-slate-800 transition-colors w-fit">
          <ChevronLeft /> Back to Dashboard
        </button>
        
        {!showQuiz ? (
          <div className="bg-white rounded-[2rem] p-12 shadow-xl flex-1 flex flex-col items-center justify-center text-center relative border border-slate-100 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-slate-100">
              <div 
                className={`h-full ${emConfig?.bg || 'bg-blue-500'} transition-all duration-500 ease-out`} 
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
            <span className="absolute top-8 left-8 text-xl font-black text-slate-300 tracking-widest uppercase">STEP {currentStep + 1} OF {steps.length}</span>
            <button onClick={() => speak(stepText)} className="absolute top-8 right-8 text-blue-500 hover:text-blue-600 bg-blue-50 p-3 rounded-full transition-colors">
              <PlayCircle size={32} />
            </button>
            
            <div className={`${emConfig?.lightBg} p-8 rounded-full mb-12`}>
              {emConfig && <emConfig.icon size={80} className={emConfig.color} />}
            </div>

            <p className="text-4xl font-bold text-slate-800 mb-16 max-w-2xl leading-tight">{stepText}</p>
            
            <div className="flex w-full max-w-md justify-between mt-auto gap-4">
              <button 
                disabled={currentStep === 0} 
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex-1 py-4 rounded-2xl font-bold text-lg bg-slate-100 text-slate-600 disabled:opacity-50 hover:bg-slate-200 transition-colors"
              >
                Previous
              </button>
              {currentStep < steps.length - 1 ? (
                <button 
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className={`flex-1 py-4 rounded-2xl font-bold text-lg text-white shadow-md transition-transform hover:scale-105 ${emConfig?.bg || 'bg-blue-500'}`}
                >
                  Next Step
                </button>
              ) : (
                <button 
                  onClick={() => { setShowQuiz(true); setQuizIndex(0); }}
                  className="flex-1 py-4 rounded-2xl font-bold text-lg bg-emerald-500 text-white shadow-md hover:scale-105 transition-transform animate-pulse"
                >
                  Take Quiz!
                </button>
              )}
            </div>
          </div>
        ) : (
          renderQuizModal(emConfig)
        )}
      </div>
    );
  };

  const renderQuizModal = (emConfig: any) => {
    if (!activeEmergency) return null;
    const qList = quizzes[activeEmergency as keyof typeof quizzes] || quizzes['default'];
    
    if (quizIndex >= qList.length) {
      if (!profile.completedDrills.includes(activeEmergency)) {
        setTimeout(() => {
          saveProfile({
            ...profile,
            score: profile.score + 50,
            completedDrills: [...profile.completedDrills, activeEmergency]
          });
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, shapes: ['star'] });
          playChime();
        }, 100);
      }
      return (
        <div className="bg-white rounded-[2rem] p-12 shadow-xl flex-1 flex flex-col items-center justify-center text-center border border-slate-100 animate-in zoom-in-95 duration-500">
          <div className="w-40 h-40 bg-amber-50 rounded-full flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 bg-amber-200 animate-ping rounded-full opacity-20"></div>
            <Trophy size={80} className="text-amber-400" />
          </div>
          <h2 className="text-5xl font-black text-slate-800 mb-4">Drill Completed!</h2>
          <p className="text-2xl text-slate-500 mb-12 max-w-lg">Great job learning how to stay safe. You've earned 50 bonus points!</p>
          <button 
            onClick={() => { setActiveEmergency(null); setShowQuiz(false); }}
            className="px-12 py-5 rounded-2xl font-bold text-xl bg-blue-500 text-white shadow-lg hover:scale-105 transition-transform"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    const q = qList[quizIndex];

    const handleAnswer = (idx: number) => {
      if (idx === q.a) {
        updateScore(20);
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      }
      setQuizIndex(prev => prev + 1);
    };

    return (
      <div className="bg-white rounded-[2rem] p-12 shadow-xl flex-1 flex flex-col border border-slate-100">
        <div className="flex justify-between items-center mb-12 text-slate-400 font-bold uppercase tracking-widest">
          <span>Quiz: {emConfig?.name}</span>
          <span>Question {quizIndex + 1} of {qList.length}</span>
        </div>
        <h3 className="text-4xl font-bold text-slate-800 mb-12 text-center max-w-2xl mx-auto leading-tight">{q.q}</h3>
        <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto w-full">
          {q.options.map((opt, idx) => (
            <button 
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="p-6 rounded-2xl bg-slate-50 hover:bg-blue-50 border-2 border-slate-100 hover:border-blue-200 active:bg-blue-100 font-bold text-2xl text-slate-700 text-left transition-all"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderLeaderboard = () => {
    // Combine current user with mock peers and sort
    const allUsers: Array<{ id: string; name: string; avatar: string; score: number; isCurrent?: boolean }> = [
      ...mockPeers,
      { id: 'current_user', name: profile.name + ' (You)', avatar: profile.avatar, score: profile.score, isCurrent: true }
    ].sort((a, b) => b.score - a.score);

    return (
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        <header className="mb-10 text-center">
          <div className="w-24 h-24 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={48} />
          </div>
          <h2 className="text-4xl font-black text-slate-800">Safety Leaderboard</h2>
          <p className="text-slate-500 text-lg mt-4 max-w-xl mx-auto">See how your safety skills compare to other Junior Scouts!</p>
        </header>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          {allUsers.map((user, index) => (
            <div 
              key={user.id} 
              className={`flex items-center gap-6 p-6 border-b border-slate-50 last:border-0 transition-colors ${user.isCurrent ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
            >
              <div className={`w-12 h-12 flex items-center justify-center font-black text-2xl rounded-full ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-slate-200 text-slate-600' : index === 2 ? 'bg-orange-100 text-orange-600' : 'text-slate-400'}`}>
                {index + 1}
              </div>
              <div className="text-4xl">
                {user.avatar}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${user.isCurrent ? 'text-blue-700' : 'text-slate-800'}`}>
                  {user.name}
                </h3>
                {user.isCurrent && <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Current Player</span>}
              </div>
              <div className="flex items-center gap-2 text-2xl font-black text-slate-800">
                <Medal className={index === 0 ? 'text-amber-500' : 'text-slate-400'} /> {user.score}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContactHub = () => (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h2 className="text-4xl font-black text-slate-800">Emergency Contacts</h2>
        <p className="text-slate-500 text-lg mt-2">Quick access to important numbers.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-red-500 text-white rounded-[2rem] p-8 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-10">
            <ShieldCheck size={200} />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2">Police</h2>
            <p className="text-2xl font-bold opacity-90 mb-8">112</p>
            <a href="tel:112" className="inline-flex items-center gap-3 bg-white text-red-500 px-6 py-3 rounded-full font-bold shadow-md hover:scale-105 transition-transform">
              <Phone size={20} /> Call Now
            </a>
          </div>
        </div>
        
        <div className="bg-amber-500 text-white rounded-[2rem] p-8 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-10">
            <Flame size={200} />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2">Fire Dept</h2>
            <p className="text-2xl font-bold opacity-90 mb-8">101</p>
            <a href="tel:101" className="inline-flex items-center gap-3 bg-white text-amber-500 px-6 py-3 rounded-full font-bold shadow-md hover:scale-105 transition-transform">
              <Phone size={20} /> Call Now
            </a>
          </div>
        </div>
        
        <div className="bg-emerald-500 text-white rounded-[2rem] p-8 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-10">
            <Stethoscope size={200} />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2">Ambulance</h2>
            <p className="text-2xl font-bold opacity-90 mb-8">102</p>
            <a href="tel:102" className="inline-flex items-center gap-3 bg-white text-emerald-500 px-6 py-3 rounded-full font-bold shadow-md hover:scale-105 transition-transform">
              <Phone size={20} /> Call Now
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="bg-blue-100 text-blue-600 p-6 rounded-3xl">
            <MapPin size={48} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Where Am I?</h2>
            <p className="text-slate-500 text-lg">Use this if you need to tell someone your location.</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div className="bg-slate-50 px-8 py-4 rounded-2xl text-xl font-mono text-slate-700 text-center border border-slate-200">
            123 Main Street, Cityville
          </div>
          <button 
            onClick={() => { navigator.clipboard.writeText("123 Main Street, Cityville"); alert("Location Copied!"); }}
            className="bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl shadow-md hover:bg-blue-700 transition-colors w-full"
          >
            Copy My Location
          </button>
        </div>
      </div>
    </div>
  );

  const renderSafetyChecklist = () => (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10 text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckSquare size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-800">My Go-Bag</h2>
        <p className="text-slate-500 text-lg mt-4 max-w-xl mx-auto">Check off items as you pack them. Be prepared for any emergency by having these essentials ready.</p>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
        <div className="flex justify-between items-center mb-8 px-4">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-sm">Packing Progress</span>
          <span className="font-bold text-emerald-500 bg-emerald-50 px-4 py-2 rounded-full">{Math.round((profile.completedItems.length / safetyItems.length) * 100)}% Complete</span>
        </div>
        
        <div className="w-full bg-slate-100 h-3 rounded-full mb-10 overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${(profile.completedItems.length / safetyItems.length) * 100}%` }}
          ></div>
        </div>

        <div className="flex flex-col gap-4">
          {safetyItems.map(item => {
            const checked = profile.completedItems.includes(item.id);
            return (
              <label key={item.id} className={`flex items-center gap-6 p-6 rounded-2xl cursor-pointer transition-all border-2 ${checked ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center shrink-0 transition-colors ${checked ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200 bg-slate-50'}`}>
                  {checked && <ShieldCheck size={20} className="text-white" />}
                </div>
                <div>
                  <span className={`text-2xl font-bold block mb-1 ${checked ? 'text-emerald-700 line-through opacity-70' : 'text-slate-700'}`}>
                    {item.name}
                  </span>
                  <span className={`text-slate-500 ${checked ? 'opacity-70' : ''}`}>{item.desc}</span>
                </div>
                <input type="checkbox" checked={checked} onChange={() => toggleItem(item.id)} className="hidden" />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans">
      {renderSidebar()}
      
      <main className="flex-1 ml-64 p-10 overflow-y-auto">
        {activeEmergency ? (
          renderStepViewer()
        ) : (
          <>
            {activeTab === 'home' && renderDashboard()}
            {activeTab === 'checklist' && renderSafetyChecklist()}
            {activeTab === 'leaderboard' && renderLeaderboard()}
            {activeTab === 'contacts' && renderContactHub()}
          </>
        )}
      </main>
    </div>
  );
}
