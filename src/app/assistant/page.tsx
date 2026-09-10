'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  AlertTriangle,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { ChatMessage } from '@/types';

let messageCounter = 100;
function getNextMessageId(prefix: string): string {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
}

export default function AIAssistantPage() {
  const { user } = useApp();
  const { language } = useLanguage();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeQuickPills, setActiveQuickPills] = useState<string[]>([
    'Explain my CBC blood report results',
    'What natural foods lower LDL cholesterol?',
    'What does Fasting Blood Sugar 140 mg/dL indicate?',
    'When should I see a doctor for chest discomfort?',
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello ${user?.name || 'there'}! I am your **MediExplain AI Health Assistant**.\n\nI can help you break down complex lab tests, understand medical terminology, explore lifestyle habits, and formulate insightful questions for your doctor.\n\n*Please remember I provide educational guidance and do not replace professional medical diagnosis or emergencies.* How can I assist you today?`,
      textHi: `नमस्ते ${user?.name || 'मित्र'}! मैं आपका **MediExplain AI हेल्थ असिस्टेंट** हूँ।\n\nमैं आपकी लैब टेस्ट रिपोर्ट समझाने, मेडिकल शब्दों के अर्थ स्पष्ट करने, और आपके डॉक्टर से पूछने योग्य सवाल तैयार करने में मदद कर सकता हूँ।\n\n*कृपया ध्यान दें कि यह जानकारी केवल शैक्षिक मार्गदर्शन के लिए है। किसी भी आपात स्थिति में तुरंत डॉक्टर से संपर्क करें।* आज आप क्या जानना चाहते हैं?`,
      timestamp: 'Just now',
    },
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputMessage).trim();
    if (!messageText || isTyping) return;

    const currentTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: getNextMessageId('usr'),
      sender: 'user',
      text: messageText,
      timestamp: currentTimestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history,
          language,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const assistantMsg: ChatMessage = {
          id: getNextMessageId('asst'),
          sender: 'assistant',
          text: data.reply,
          textHi: data.replyHi,
          timestamp: currentTimestamp,
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (data.suggestedQuestions && data.suggestedQuestions.length > 0) {
          setActiveQuickPills(data.suggestedQuestions);
        }
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: getNextMessageId('asst'),
        sender: 'assistant',
        text: 'I am currently processing your request. Please ensure a stable network connection or consult with your physician for detailed medical assessment.',
        textHi: 'क्षमा करें, तकनीकी कारणों से प्रतिक्रिया में विलंब हो रहा है। कृपया पुनः प्रयास करें।',
        timestamp: currentTimestamp,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full flex flex-col h-[calc(100vh-80px)]">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-2xl p-5 text-white shadow-md mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">
                    {language === 'hi' ? 'एआई स्वास्थ्य सहायक' : 'AI Health Assistant'}
                  </h1>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 rounded-full text-[10px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Gemini Live
                  </span>
                </div>
                <p className="text-xs text-purple-100">
                  {language === 'hi'
                    ? 'अपनी मेडिकल रिपोर्ट और लक्षणों पर सुरक्षित शैक्षिक मार्गदर्शन प्राप्त करें'
                    : 'Interactive medical document explanations & evidence-based wellness guidance'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs text-purple-100 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>
                {language === 'hi'
                  ? 'निजी व सुरक्षित बातचीत'
                  : 'Encrypted & Confidential'}
              </span>
            </div>
          </div>

          {/* Emergency Alert Callout */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between text-xs text-rose-900 shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>{language === 'hi' ? 'आपातकाल:' : 'Emergency Notice:'}</strong>{' '}
                {language === 'hi'
                  ? 'सीने में तेज दर्द, सांस फूलने या बेहोशी जैसी स्थिति में तुरंत 112 या 108 पर संपर्क करें।'
                  : 'For sudden severe chest pressure or shortness of breath, call 112/108 or go to the nearest ER immediately.'}
              </span>
            </div>
            <a
              href="tel:112"
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold flex items-center gap-1 shrink-0 ml-2"
            >
              <PhoneCall className="w-3 h-3" />
              112
            </a>
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 lg:p-6 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold ${
                      isUser
                        ? 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                        : 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line">
                      {language === 'hi' && msg.textHi ? msg.textHi : msg.text}
                    </div>
                    <div
                      className={`text-[10px] mt-2 text-right ${
                        isUser ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-4 text-slate-500 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-purple-600" />
                  <span>
                    {language === 'hi'
                      ? 'AI आपकी मेडिकल क्वेरी का विश्लेषण कर रहा है...'
                      : 'MediExplain AI is analyzing your query...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Pills */}
          <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide shrink-0">
              {language === 'hi' ? 'सुझाए गए विषय:' : 'Suggestions:'}
            </span>
            {activeQuickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(pill)}
                className="px-3 py-1 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 text-xs font-medium rounded-full whitespace-nowrap transition shadow-sm"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex items-center gap-2 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500"
            >
              <input
                type="text"
                placeholder={
                  language === 'hi'
                    ? 'अपनी मेडिकल रिपोर्ट, दवाइयों या लक्षणों के बारे में पूछें...'
                    : 'Ask any question about your medical reports, medicines, or symptoms...'
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm bg-transparent border-none focus:outline-none text-slate-800"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-xs transition shadow flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{language === 'hi' ? 'पूछें' : 'Send'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <p className="text-[11px] text-center text-slate-400 mt-2">
              {language === 'hi'
                ? 'MediExplain AI शैक्षिक जानकारी प्रदान करता है। उपचार के निर्णय हेतु डॉक्टर से अवश्य परामर्श लें।'
                : 'MediExplain AI provides educational medical guidance. Always consult with a licensed healthcare provider.'}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
