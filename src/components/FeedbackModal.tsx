'use client';

import React, { useState } from 'react';
import {
  X,
  Star,
  MessageSquare,
  Bug,
  Sparkles,
  Languages,
  CheckCircle2,
  Send,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { FeedbackCategory } from '@/types';
import { trackEvent } from '@/lib/analytics';
import { isOnline, enqueueSyncAction } from '@/lib/offlineSync';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { language } = useLanguage();
  const { user } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<FeedbackCategory>('general');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories: { id: FeedbackCategory; labelEn: string; labelHi: string; icon: React.ElementType }[] = [
    { id: 'bug', labelEn: 'Bug / Glitch', labelHi: 'तकनीकी समस्या', icon: Bug },
    { id: 'feature', labelEn: 'Feature Idea', labelHi: 'नया सुझाव', icon: Sparkles },
    { id: 'translation', labelEn: 'Hindi / Translation', labelHi: 'भाषा व अनुवाद', icon: Languages },
    { id: 'accuracy', labelEn: 'Medical OCR Quality', labelHi: 'रिपोर्ट पठनीयता', icon: HelpCircle },
    { id: 'general', labelEn: 'General Feedback', labelHi: 'सामान्य अनुभव', icon: MessageSquare },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया अपना संदेश या विवरण लिखें।' : 'Please enter your feedback description.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      userId: user?.id || 'anon-patient',
      userName: user?.name || 'Anonymous Patient',
      rating,
      category,
      description: description.trim(),
      deviceDetails: {
        browser: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        language: typeof navigator !== 'undefined' ? navigator.language : 'en',
        screenResolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Desktop',
      },
    };

    try {
      if (!isOnline()) {
        enqueueSyncAction({
          type: 'SUBMIT_FEEDBACK',
          endpoint: '/api/feedback',
          method: 'POST',
          payload: payload as unknown as Record<string, unknown>,
        }).catch(() => {});
        trackEvent('feedback_saved_offline', { rating, category });
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setDescription('');
          onClose();
        }, 2200);
        return;
      }

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        trackEvent('feedback_submitted', { rating, category });
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setDescription('');
          setRating(5);
          onClose();
        }, 2200);
      } else {
        throw new Error('Failed to save feedback');
      }
    } catch {
      // Fallback local logging & offline queue
      enqueueSyncAction({
        type: 'SUBMIT_FEEDBACK',
        endpoint: '/api/feedback',
        method: 'POST',
        payload: payload as unknown as Record<string, unknown>,
      }).catch(() => {});
      trackEvent('feedback_saved_offline', { rating, category });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setDescription('');
        onClose();
      }, 2200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-dialog-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 relative space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100"
              aria-hidden="true"
            >
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 id="feedback-dialog-title" className="font-bold text-slate-900 text-base">
                {language === 'hi' ? 'प्रतिक्रिया व सुझाव साझा करें' : 'Share Feedback & Report Issues'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'आपकी राय MediExplain AI को और अधिक उपयोगी बनाती है'
                  : 'Help us make healthcare reports simpler and more accessible'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={language === 'hi' ? 'डायलॉग बंद करें' : 'Close feedback dialog'}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {language === 'hi' ? 'धन्यवाद! आपकी प्रतिक्रिया प्राप्त हुई।' : 'Thank You! Feedback Recorded.'}
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {language === 'hi'
                ? 'हमारी इंजीनियरिंग व क्लिनिकल टीम आपके सुझाव की समीक्षा करेगी।'
                : 'Our clinical and engineering team reviews every submission.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating */}
            <div className="space-y-1.5 text-center bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-xs font-bold text-slate-700 block">
                {language === 'hi' ? 'आपका समग्र अनुभव कैसा रहा?' : 'How would you rate your experience?'}
              </span>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-300 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category Chips */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {language === 'hi' ? 'प्रतिक्रिया की श्रेणी चुनें' : 'Category'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{language === 'hi' ? cat.labelHi : cat.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                {language === 'hi' ? 'सुझाव या समस्या का विवरण' : 'Description'}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder={
                  language === 'hi'
                    ? 'कृपया विस्तार से बताएं कि हम इस अनुभव को और बेहतर कैसे बना सकते हैं...'
                    : 'Tell us what went well, what broke, or what features you would like to see...'
                }
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : (language === 'hi' ? 'जमा करें' : 'Submit Feedback')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
