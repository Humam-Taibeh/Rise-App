import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Skull, Target } from 'lucide-react';

const translations = {
  en: {
    streakHub: "Streak Hub",
    status: "Status",
    levels: "Levels",
    sevenDayHistory: "7-Day History",
    weeklyRecovery: "Weekly Recovery",
    weeklyRecoveryDesc: "Protect your streak once per week",
    available: "Available",
    used: "Used",
    howItWorks: "How It Works",
    howItWorksItems: [
      "Daily Ignite: Keep your streak alive by completing tasks before midnight.",
      "The Reset: If the fire goes out, your progress resets. Stay consistent!",
      "Shield Up: Use your Weekly Recovery 🛡️ to protect your streak when needed.",
      "Legendary Status: Unlock new colors and icons as your streak grows."
    ],
    levelNames: ["The Flame", "The Focus", "The Legend", "The Beast"],
    levelDescriptions: [
      "Ignite your daily habit fire!",
      "Channel your inner focus!",
      "Become the legendary achiever!",
      "Unleash the beast within!"
    ],
    statusGreetings: [
      "{name}, you've ignited the spark!",
      "{name}, focus is your superpower!",
      "{name}, you're legendary!",
      "{name}, you're unstoppable!"
    ],
    ranges: ["1-7 Days", "8-21 Days", "22-49 Days", "50+ Days"],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    daysLabel: "Days"
  },
  ar: {
    streakHub: "مركز السلسلة",
    status: "الحالة",
    levels: "المستويات",
    sevenDayHistory: "تاريخ 7 أيام",
    weeklyRecovery: "الاستعادة الأسبوعية",
    weeklyRecoveryDesc: "احمِ سلسلتك مرة واحدة في الأسبوع",
    available: "متاح",
    used: "مستخدم",
    howItWorks: "كيف يعمل",
    howItWorksItems: [
      "الشعلة اليومية: حافظ على توهج الستريك بإنجاز مهامك قبل منتصف الليل.",
      "قانون الاستمرارية: إذا انطفأت الشعلة، سيعود التقدم للصفر. الالتزام هو السر!",
      "درع الحماية: استخدم \"التعافي الأسبوعي\" 🛡️ لإنقاذ تعبك عند الحاجة.",
      "الرتب الأسطورية: افتح ألواناً وأيقونات جديدة مع كل إنجاز جديد."
    ],
    levelNames: ["شرارة الانضباط", "سيد الاستمرارية", "مُنجز النخبة", "الوحش الذي لا يُقهر"],
    levelDescriptions: [
      "بداية الطريق - شعلة صغيرة ستحرق المستحيل.",
      "سيد التركيز - لقد وجدت إيقاعك الخاص.",
      "مُنجز النخبة - أنت ترفع سقف التحدي كل يوم.",
      "سيادة كاملة - لقد أصبحت الانضباط بحد ذاته."
    ],
    statusGreetings: [
      "{name}، لقد بدأت بقوة!",
      "{name}، التركيز هو قوتك الخارقة!",
      "{name}، أنت أسطوري!",
      "{name}، أنت لا تقهر!"
    ],
    ranges: ["1-7 أيام", "8-21 يوم", "22-49 يوم", "50+ يوم"],
    days: ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
    daysLabel: "أيام"
  }
};

const StreakModal = ({ isOpen, onClose, streak, displayName, streakRecoveryAvailable, language }) => {
  const [view, setView] = useState('status'); // 'status' or 'levels'

  const getCurrentLevel = (streak, language) => {
    const t = translations[language];
    if (streak >= 50) return { level: 4, name: t.levelNames[3], color: 'text-red-500', bg: 'bg-red-500/20', icon: '💀' };
    if (streak >= 22) return { level: 3, name: t.levelNames[2], color: 'text-purple-500', bg: 'bg-purple-500/20', icon: '👑' };
    if (streak >= 8) return { level: 2, name: t.levelNames[1], color: 'text-blue-500', bg: 'bg-blue-500/20', icon: '🎯' };
    return { level: 1, name: t.levelNames[0], color: 'text-orange-500', bg: 'bg-orange-500/20', icon: '🔥' };
  };

  const currentLevel = getCurrentLevel(streak, language);

  const generateHistory = (streak) => {
    const days = translations[language].days;
    const history = [];
    for (let i = 6; i >= 0; i--) {
      const dayIndex = (new Date().getDay() + 6 - i) % 7; // Get past days
      history.push({
        day: days[dayIndex],
        status: i < streak ? 'success' : 'missed',
        icon: i < streak ? '🔥' : '🔘'
      });
    }
    return history;
  };

  const historyData = generateHistory(streak);

  const levels = [
    { range: translations[language].ranges[0], name: translations[language].levelNames[0], color: 'text-orange-500', bg: 'bg-orange-500/20', icon: '🔥' },
    { range: translations[language].ranges[1], name: translations[language].levelNames[1], color: 'text-blue-500', bg: 'bg-blue-500/20', icon: '🎯' },
    { range: translations[language].ranges[2], name: translations[language].levelNames[2], color: 'text-purple-500', bg: 'bg-purple-500/20', icon: '👑' },
    { range: translations[language].ranges[3], name: translations[language].levelNames[3], color: 'text-red-500', bg: 'bg-red-500/20', icon: '💀' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-black/80 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl text-white border border-white/10"
            style={{ boxShadow: '0 0 50px -10px rgb(var(--accent-main) / 0.4)' }}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">{translations[language].streakHub}</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-white/5 rounded-xl p-1">
              <button
                onClick={() => setView('status')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${view === 'status' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                style={view === 'status' ? { backgroundColor: 'rgb(var(--accent-main))' } : {}}
              >
{translations[language].status}
              </button>
              <button
                onClick={() => setView('levels')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${view === 'levels' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                style={view === 'levels' ? { backgroundColor: 'rgb(var(--accent-main))' } : {}}
              >
{translations[language].levels}
              </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {view === 'status' ? (
                <motion.div
                  key="status"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Current Streak */}
                  <div className="text-center">
                    <div className={`text-8xl mb-4 ${currentLevel.color}`}>{currentLevel.icon}</div>
                    <h3 className="text-4xl font-bold mb-2">{streak} {translations[language].daysLabel}</h3>
                    <p className="text-xl text-gray-300" dangerouslySetInnerHTML={{ __html: translations[language].statusGreetings[currentLevel.level - 1].replace('{name}', `<span class="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-500 font-bold animate-pulse">${displayName}</span>`) }} />
                  </div>

                  {/* 7-Day History */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="font-semibold mb-3">{translations[language].sevenDayHistory}</h4>
                    <div className="grid grid-cols-7 gap-2">
                      {historyData.map((day, i) => (
                        <div key={i} className="text-center">
                          <div className="text-2xl">{day.icon}</div>
                          <div className="text-xs text-gray-400">{day.day}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recovery Status */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🛡️</span>
                        <div>
                          <p className="font-semibold">{translations[language].weeklyRecovery}</p>
                          <p className="text-sm text-gray-400">{translations[language].weeklyRecoveryDesc}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${streakRecoveryAvailable ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
{streakRecoveryAvailable ? translations[language].available : translations[language].used}
                      </span>
                    </div>
                  </div>

                  {/* How It Works */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="font-semibold mb-3">{translations[language].howItWorks}</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      {translations[language].howItWorksItems.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="levels"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid gap-4"
                >
                  {levels.map((level, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border transition-all ${
                        currentLevel.level === index + 1
                          ? `${level.bg} shadow-lg`
                          : 'bg-white/5 border-white/10'
                      }`}
                      style={currentLevel.level === index + 1 ? { borderColor: 'rgb(var(--accent-main) / 0.5)' } : {}}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`text-3xl ${level.color}`} style={currentLevel.level === index + 1 ? { color: 'rgb(var(--accent-main))' } : {}}>{level.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-bold ${level.color}`} style={currentLevel.level === index + 1 ? { color: 'rgb(var(--accent-main))' } : {}}>{level.name}</h4>
                            <span className="text-sm text-gray-400">{level.range}</span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1 text-start">
                            {translations[language].levelDescriptions[index]}
                          </p>
                        </div>
                        {currentLevel.level === index + 1 && (
                          <div className="text-green-400 text-xl">✓</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StreakModal;
