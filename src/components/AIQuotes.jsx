import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const quotes = {
  en: [
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Don't watch the clock; do what it does. Keep going.",
    "The best way to predict the future is to create it.",
    "Glow up starts with small steps.",
    "Consistency is the key to transformation.",
    "Believe in your glow up journey.",
    "Every day is a chance to shine brighter.",
    "Embrace change, embrace growth.",
    "Rise above, glow within.",
    "Your potential is limitless.",
    "Transform habits, transform life."
  ],
  ar: [
    "النجاح ليس نهائيًا، والفشل ليس قاتلاً: إنه الشجاعة للاستمرار التي تحسب.",
    "الطريقة الوحيدة للقيام بعمل كبير هي حب ما تفعله.",
    "صدق أنك تستطيع وأنت في منتصف الطريق.",
    "المستقبل ينتمي إلى أولئك الذين يؤمنون بجمال أحلامهم.",
    "لا تشاهد الساعة؛ افعل ما تفعله. استمر.",
    "أفضل طريقة للتنبؤ بالمستقبل هي خلقه.",
    "بدء التوهج يبدأ بخطوات صغيرة.",
    "الاستمرارية هي مفتاح التحول.",
    "صدق برحلتك في التوهج.",
    "كل يوم فرصة للتألق أكثر.",
    "اعتنق التغيير، اعتنق النمو.",
    "ارتفع فوقه، أضئ من الداخل.",
    "إمكانياتك لا حدود لها.",
    "حول العادات، حول الحياة."
  ]
}

function AIQuotes({ language = 'en' }) {
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes[language].length)
    }, 15000)
    return () => clearInterval(interval)
  }, [language])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-8 mb-12 text-center"
    >
      <p className="text-lg italic text-gray-300">"{quotes[language][currentQuote]}"</p>
    </motion.div>
  )
}

export default AIQuotes