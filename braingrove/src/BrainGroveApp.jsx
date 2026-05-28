import React, { useState, useEffect } from 'react';
import {
  Moon, Flame, Trophy, Bed, Sparkles, Skull, Calendar,
  Plus, ShoppingBag, Lightbulb, Coins
} from 'lucide-react';

const BrainGroveApp = () => {
  // ===== STATE =====
  const [tab, setTab] = useState('home');
  const [brainHealth, setBrainHealth] = useState(60);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0);
  const [hoursInput, setHoursInput] = useState(7.0);
  const [message, setMessage] = useState(null);
  const [equipped, setEquipped] = useState({ hat: null, accessory: null, aura: null });
  const [owned, setOwned] = useState([]);
  const [history, setHistory] = useState([]);

  // ===== LOAD FROM LOCALSTORAGE =====
  useEffect(() => {
    const saved = localStorage.getItem('brainGroveData');
    if (saved) {
      const data = JSON.parse(saved);
      setBrainHealth(data.brainHealth ?? 60);
      setLevel(data.level ?? 1);
      setStreak(data.streak ?? 0);
      setCoins(data.coins ?? 0);
      setEquipped(data.equipped ?? { hat: null, accessory: null, aura: null });
      setOwned(data.owned ?? []);
      setHistory(data.history ?? []);
    }
  }, []);

  // ===== SAVE TO LOCALSTORAGE =====
  useEffect(() => {
    localStorage.setItem('brainGroveData', JSON.stringify({
      brainHealth, level, streak, coins, equipped, owned, history
    }));
  }, [brainHealth, level, streak, coins, equipped, owned, history]);

  // ===== COSMETICS DATA =====
  const cosmetics = [
    { id: 'hat_basic', name: 'Beanie', emoji: '🧢', type: 'hat', price: 50, rarity: 'common' },
    { id: 'hat_party', name: 'Party Hat', emoji: '🥳', type: 'hat', price: 150, rarity: 'uncommon' },
    { id: 'hat_wizard', name: 'Wizard Hat', emoji: '🎩', type: 'hat', price: 250, rarity: 'rare' },
    { id: 'hat_crown', name: 'Crown', emoji: '👑', type: 'hat', price: 500, rarity: 'legendary' },
    { id: 'acc_bow', name: 'Bowtie', emoji: '🎀', type: 'accessory', price: 100, rarity: 'common' },
    { id: 'acc_glasses', name: 'Smart Glasses', emoji: '👓', type: 'accessory', price: 200, rarity: 'rare' },
    { id: 'acc_headphone', name: 'Headphones', emoji: '🎧', type: 'accessory', price: 300, rarity: 'rare' },
    { id: 'aura_star', name: 'Star Aura', emoji: '✨', type: 'aura', price: 350, rarity: 'epic' },
    { id: 'aura_fire', name: 'Fire Aura', emoji: '🔥', type: 'aura', price: 400, rarity: 'epic' },
    { id: 'aura_rainbow', name: 'Rainbow Aura', emoji: '🌈', type: 'aura', price: 750, rarity: 'legendary' },
  ];

  // ===== SLEEP TIPS DATA =====
  const sleepTips = [
    { icon: '🌡️', title: 'Cool Room', desc: 'Keep bedroom 60-67°F (15-19°C). Cooler temps boost deep sleep.' },
    { icon: '🌑', title: 'Total Darkness', desc: 'Use blackout curtains. Even tiny light disrupts melatonin.' },
    { icon: '📵', title: 'No Screens 1hr Before', desc: 'Blue light tricks your brain into thinking it is daytime.' },
    { icon: '☕', title: 'Cut Caffeine by 2pm', desc: 'Caffeine has a 6-hour half-life. Afternoon coffee = midnight stimulant.' },
    { icon: '🛏️', title: 'Bed = Sleep Only', desc: 'Do not work, eat, or scroll in bed. Train your brain to associate it with rest.' },
    { icon: '🌅', title: 'Same Wake Time Daily', desc: 'Even on weekends. Consistency anchors your circadian rhythm.' },
    { icon: '🏃', title: 'Exercise (Not Late)', desc: '30 min daily, but finish 3+ hours before bed.' },
    { icon: '🍽️', title: 'No Heavy Meals Late', desc: 'Stop eating 3 hours before bed. Digestion disrupts deep sleep.' },
    { icon: '🧘', title: 'Wind-Down Ritual', desc: 'Read, stretch, journal. Signal your body it is bedtime.' },
    { icon: '☀️', title: 'Morning Sunlight', desc: '10 min outside within an hour of waking. Locks in your rhythm.' },
  ];

  const rarityColors = {
    common: 'border-gray-400 bg-gray-700',
    uncommon: 'border-green-400 bg-green-900',
    rare: 'border-blue-400 bg-blue-900',
    epic: 'border-purple-400 bg-purple-900',
    legendary: 'border-yellow-400 bg-yellow-900',
  };

  // ===== HELPERS =====
  const showToast = (text, type = 'good') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  // ===== CORE LOGIC: LOG SLEEP =====
  const logSleep = () => {
    const hours = parseFloat(hoursInput);
    let newHealth = brainHealth;
    let newStreak = streak;
    let newCoins = coins;
    let newLevel = level;
    let status = 'grow';

    if (hours < 6) {
      newHealth = Math.max(0, brainHealth - 20);
      newStreak = 0;
      newCoins = Math.floor(coins * 0.5);
      status = 'rot';
      showToast(`💀 Only ${hours}h! Brain rotting. Coins HALVED: ${coins} → ${newCoins}`, 'bad');
    } else if (hours >= 6 && hours < 6.5) {
      newHealth = Math.min(100, brainHealth + 2);
      newStreak = 0;
      newCoins = Math.floor(coins * 0.5);
      status = 'meh';
      showToast(`😐 ${hours}h not enough. Streak broken. Coins HALVED!`, 'bad');
    } else if (hours >= 6.5 && hours <= 7) {
      newHealth = Math.min(100, brainHealth + 8);
      newStreak = streak + 1;
      status = 'grow';

      if (newStreak >= 7) {
        newCoins = coins + 200;
        newStreak = 0;
        newLevel = level + 1;
        newHealth = Math.min(100, newHealth + 25);
        showToast(`🎉 7-DAY STREAK! +200 coins! LEVEL ${newLevel}!`, 'levelup');
      } else {
        showToast(`🌱 Perfect zone! Streak: ${newStreak}/7. Coins on day 7!`, 'good');
      }
    } else {
      newHealth = Math.min(100, brainHealth + 5);
      newStreak = 0;
      status = 'grow';
      showToast(`😴 ${hours}h is too much. Aim for 6.5-7h. Streak reset.`, 'meh');
    }

    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const newEntry = { day: days[history.length % 7], hours, status };
    const newHistory = history.length >= 7
      ? [...history.slice(1), newEntry]
      : [...history, newEntry];

    setBrainHealth(newHealth);
    setStreak(newStreak);
    setCoins(newCoins);
    setLevel(newLevel);
    setHistory(newHistory);
  };

  // ===== SHOP ACTIONS =====
  const buyItem = (item) => {
    if (coins >= item.price && !owned.includes(item.id)) {
      setCoins(coins - item.price);
      setOwned([...owned, item.id]);
      showToast(`✨ Unlocked ${item.name}!`, 'good');
    } else if (coins < item.price) {
      showToast(`Not enough coins! Need ${item.price - coins} more.`, 'bad');
    }
  };

  const equipItem = (item) => {
    setEquipped({ ...equipped, [item.type]: equipped[item.type] === item.id ? null : item.id });
  };

  // ===== BRAIN VISUAL =====
  const getBrainScale = () => 0.6 + (brainHealth / 100) * 0.5;
  const getBrainFilter = () => {
    if (brainHealth >= 75) return 'drop-shadow(0 0 35px #ec4899) saturate(1.3)';
    if (brainHealth >= 50) return 'drop-shadow(0 0 20px #a855f7)';
    if (brainHealth >= 25) return 'drop-shadow(0 0 15px #84cc16) sepia(0.4)';
    return 'sepia(0.8) hue-rotate(40deg) brightness(0.6) drop-shadow(0 0 10px #65a30d)';
  };
  const getStatus = () => {
    if (brainHealth >= 75) return { text: 'Thriving', color: 'text-pink-300', emoji: '🌟' };
    if (brainHealth >= 50) return { text: 'Healthy', color: 'text-purple-300', emoji: '💜' };
    if (brainHealth >= 25) return { text: 'Wilting', color: 'text-yellow-300', emoji: '🍂' };
    return { text: 'Rotting', color: 'text-green-400', emoji: '💀' };
  };

  const equippedAura = cosmetics.find(c => c.id === equipped.aura);
  const equippedHat = cosmetics.find(c => c.id === equipped.hat);
  const equippedAcc = cosmetics.find(c => c.id === equipped.accessory);

  const renderBrain = () => (
    <div className="relative inline-block">
      {equippedAura && (
        <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-60 animate-pulse">
          {equippedAura.emoji}
        </div>
      )}
      {equippedHat && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-5xl z-10">
          {equippedHat.emoji}
        </div>
      )}
      <div
        className="text-9xl transition-all duration-1000 relative z-0"
        style={{ filter: getBrainFilter(), transform: `scale(${getBrainScale()})` }}
      >
        🧠
      </div>
      {equippedAcc && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-4xl z-10">
          {equippedAcc.emoji}
        </div>
      )}
    </div>
  );

  const status = getStatus();

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-white pb-24">
      {message && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-50 font-bold text-sm max-w-md text-center ${
          message.type === 'good' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
          message.type === 'bad' ? 'bg-gradient-to-r from-red-600 to-orange-700' :
          message.type === 'levelup' ? 'bg-gradient-to-r from-yellow-400 to-pink-500 animate-pulse' :
          'bg-gradient-to-r from-yellow-600 to-orange-600'
        }`}>
          {message.text}
        </div>
      )}

      <div className="max-w-2xl mx-auto p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🧠</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
              BrainGrove
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-yellow-500 bg-opacity-20 px-3 py-1 rounded-full border border-yellow-400 border-opacity-40">
              <Coins className="w-4 h-4 text-yellow-300" />
              <span className="font-bold">{coins}</span>
            </div>
            <div className="flex items-center gap-1 bg-orange-500 bg-opacity-20 px-3 py-1 rounded-full border border-orange-400 border-opacity-40">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="font-bold">{streak}/7</span>
            </div>
          </div>
        </div>

        {tab === 'home' && (
          <>
            <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-3xl p-8 mb-5 border border-purple-500 border-opacity-30 text-center relative overflow-hidden">
              <div className={`absolute inset-0 opacity-20 ${brainHealth >= 50 ? 'bg-pink-500' : 'bg-green-700'} blur-3xl`}></div>
              <div className="relative">
                <p className="text-xs text-purple-200 mb-2 uppercase tracking-wider">Your Brain</p>
                <div className="my-6 h-40 flex items-center justify-center">
                  {renderBrain()}
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-2xl font-bold">Lv. {level}</span>
                  <span className={`text-sm font-semibold ${status.color}`}>• {status.text} {status.emoji}</span>
                </div>
                <div className="max-w-sm mx-auto">
                  <div className="flex justify-between text-xs text-purple-200 mb-1">
                    <span>Health</span>
                    <span>{brainHealth}%</span>
                  </div>
                  <div className="w-full bg-purple-950 rounded-full h-3 overflow-hidden border border-purple-700">
                    <div
                      className={`h-full transition-all duration-700 ${
                        brainHealth >= 50
                          ? 'bg-gradient-to-r from-pink-400 to-purple-400'
                          : 'bg-gradient-to-r from-yellow-600 to-green-700'
                      }`}
                      style={{ width: `${brainHealth}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-5 mb-5 border border-white border-opacity-20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" /> Weekly Coin Quest
                </h3>
                <span className="text-sm text-yellow-300 font-bold">+200 coins</span>
              </div>
              <div className="flex justify-between gap-1 mb-2">
                {[0,1,2,3,4,5,6].map(i => (
                  <div
                    key={i}
                    className={`flex-1 h-12 rounded-lg flex items-center justify-center text-2xl transition-all ${
                      i < streak
                        ? 'bg-gradient-to-br from-pink-500 to-purple-600 scale-110'
                        : 'bg-purple-950 border border-purple-800'
                    }`}
                  >
                    {i < streak ? '🧠' : '🌑'}
                  </div>
                ))}
              </div>
              <p className="text-xs text-purple-200">
                Get 6.5–7 hours every night for 7 nights to unlock 200 coins. <strong className="text-red-300">One bad night = 50% coin loss!</strong>
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-5 mb-5 border border-white border-opacity-20">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Bed className="w-5 h-5" /> Log Last Night
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setHoursInput(Math.max(0, parseFloat((hoursInput - 0.5).toFixed(1))))}
                  className="w-12 h-12 rounded-full bg-purple-700 hover:bg-purple-600 font-bold text-xl"
                >−</button>
                <div className={`flex-1 text-center rounded-2xl py-4 transition-all ${
                  hoursInput >= 6.5 && hoursInput <= 7
                    ? 'bg-gradient-to-r from-green-700 to-emerald-700 ring-2 ring-green-400'
                    : 'bg-purple-950'
                }`}>
                  <span className="text-4xl font-bold">{hoursInput}</span>
                  <span className="text-purple-300 ml-1">hrs</span>
                  {hoursInput >= 6.5 && hoursInput <= 7 && (
                    <p className="text-xs text-green-300 mt-1">✨ Perfect zone</p>
                  )}
                </div>
                <button
                  onClick={() => setHoursInput(Math.min(12, parseFloat((hoursInput + 0.5).toFixed(1))))}
                  className="w-12 h-12 rounded-full bg-purple-700 hover:bg-purple-600 font-bold text-xl"
                >+</button>
              </div>
              <button
                onClick={logSleep}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 transition-all py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Log Sleep
              </button>
            </div>

            {history.length > 0 && (
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-5 border border-white border-opacity-20">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Recent Nights
                </h3>
                <div className="flex items-end justify-between gap-2 h-28">
                  {history.map((log, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end h-20">
                        <div
                          className={`w-full rounded-t-lg transition-all ${
                            log.status === 'rot' ? 'bg-gradient-to-t from-green-800 to-yellow-700' :
                            log.hours >= 6.5 && log.hours <= 7 ? 'bg-gradient-to-t from-purple-500 to-pink-400' :
                            'bg-gradient-to-t from-yellow-700 to-yellow-500'
                          }`}
                          style={{ height: `${Math.max(15, (log.hours / 10) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-purple-200">{log.day}</span>
                      <span className="text-xs font-bold">{log.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'shop' && (
          <>
            <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl p-5 mb-5 text-center border border-purple-500 border-opacity-30">
              <div className="h-32 flex items-center justify-center mb-2">{renderBrain()}</div>
              <p className="text-xs text-purple-200">Tap items to equip / unequip</p>
            </div>

            {['hat', 'accessory', 'aura'].map(category => (
              <div key={category} className="mb-5">
                <h3 className="font-bold mb-3 capitalize text-purple-200">{category}s</h3>
                <div className="grid grid-cols-2 gap-3">
                  {cosmetics.filter(c => c.type === category).map(item => {
                    const isOwned = owned.includes(item.id);
                    const isEquipped = equipped[item.type] === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => isOwned ? equipItem(item) : buyItem(item)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${rarityColors[item.rarity]} ${
                          isEquipped ? 'ring-2 ring-pink-400 scale-105' : 'hover:scale-105'
                        } bg-opacity-40`}
                      >
                        <div className="text-4xl text-center mb-2">{item.emoji}</div>
                        <p className="font-bold text-sm text-center">{item.name}</p>
                        <p className="text-xs text-center text-gray-300 capitalize mb-2">{item.rarity}</p>
                        {isOwned ? (
                          <div className={`text-xs text-center font-bold ${isEquipped ? 'text-pink-300' : 'text-green-300'}`}>
                            {isEquipped ? '✓ Equipped' : 'Tap to equip'}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1 text-xs font-bold text-yellow-300">
                            <Coins className="w-3 h-3" /> {item.price}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'tips' && (
          <>
            <div className="bg-gradient-to-br from-indigo-800 to-purple-900 rounded-2xl p-5 mb-5 border border-purple-500 border-opacity-30">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-300" /> Optimal Sleep Conditions
              </h2>
              <p className="text-sm text-purple-200">Master these and your brain will flourish 🧠✨</p>
            </div>
            <div className="space-y-3">
              {sleepTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-20 flex gap-3 items-start"
                >
                  <div className="text-3xl">{tip.icon}</div>
                  <div>
                    <h4 className="font-bold mb-1">{tip.title}</h4>
                    <p className="text-sm text-purple-100">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 bg-opacity-95 backdrop-blur-lg border-t border-purple-800">
        <div className="max-w-2xl mx-auto flex">
          {[
            { id: 'home', icon: Bed, label: 'Sleep' },
            { id: 'shop', icon: ShoppingBag, label: 'Shop' },
            { id: 'tips', icon: Lightbulb, label: 'Tips' },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-3 flex flex-col items-center gap-1 transition-all ${
                  tab === t.id ? 'text-pink-400' : 'text-purple-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-semibold">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BrainGroveApp;
