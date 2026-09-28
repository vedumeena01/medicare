'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Gauge,
  Languages,
  Headphones,
} from 'lucide-react';
import { MedicalReport } from '@/types';

interface ReportAudioNarratorProps {
  report: MedicalReport;
  defaultLanguage?: 'en' | 'hi';
}

export default function ReportAudioNarrator({
  report,
  defaultLanguage = 'en',
}: ReportAudioNarratorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechLang, setSpeechLang] = useState<'en' | 'hi'>(defaultLanguage);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [totalSentences, setTotalSentences] = useState<number>(1);
  const [activeSpeechText, setActiveSpeechText] = useState<string>('');

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Generate doctor-like narration script based on report data
  const generateNarrationScript = useCallback(
    (lang: 'en' | 'hi'): string => {
      if (lang === 'hi') {
        const summary =
          report.summaryHi ||
          report.summary ||
          'आपकी रिपोर्ट का विश्लेषण तैयार है।';
        const abnormalFindings = report.findings
          .filter((f) => f.status === 'high' || f.status === 'low')
          .map(
            (f) =>
              `${f.testHi || f.test} का स्तर ${f.value} ${f.unit} है, जो कि सामान्य सीमा से ${
                f.status === 'high' ? 'अधिक' : 'कम'
              } है। ${f.explanationHi || f.explanation || ''}`
          )
          .join(' ');

        return (
          `नमस्ते। यह आपकी ${report.reportType || 'मेडिकल'} रिपोर्ट का सरल ऑडियो सारांश है। ` +
          `${summary} ` +
          (abnormalFindings
            ? `मुख्य ध्यान देने योग्य बिंदु: ${abnormalFindings} `
            : 'आपकी रिपोर्ट के मुख्य पैरामीटर संतोषजनक स्थिति में हैं। ') +
          'कृपया याद रखें, यह ऑडियो व्याख्या केवल आपकी समझ के लिए है। किसी भी दवा या उपचार के लिए हमेशा अपने डॉक्टर से परामर्श अवश्य लें।'
        );
      } else {
        const summary =
          report.summary ||
          'Your medical analysis is ready for review.';
        const abnormalFindings = report.findings
          .filter((f) => f.status === 'high' || f.status === 'low')
          .map(
            (f) =>
              `${f.test} is measured at ${f.value} ${f.unit}, which is ${
                f.status === 'high' ? 'above' : 'below'
              } the standard clinical range. ${f.explanation || ''}`
          )
          .join(' ');

        return (
          `Hello. Here is a simplified audio explanation for your ${report.reportType || 'diagnostic'} report. ` +
          `${summary} ` +
          (abnormalFindings
            ? `Key findings that require attention: ${abnormalFindings} `
            : 'All primary parameters in your report appear to be within acceptable ranges. ') +
          'Please remember, this AI narration is for your informational clarity only. Always discuss these results with your treating doctor.'
        );
      }
    },
    [report]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIndex(0);
    setActiveSpeechText('');
  }, []);

  // Clean up synthesis on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  const selectVoiceForLanguage = (
    synth: SpeechSynthesis,
    lang: 'en' | 'hi'
  ): SpeechSynthesisVoice | null => {
    const voices = synth.getVoices();
    if (lang === 'hi') {
      const hindiVoice = voices.find(
        (v) =>
          v.lang === 'hi-IN' ||
          v.lang.startsWith('hi') ||
          v.name.toLowerCase().includes('hindi')
      );
      if (hindiVoice) return hindiVoice;
    }
    const indianEnglishVoice = voices.find(
      (v) => v.lang === 'en-IN' || v.name.toLowerCase().includes('india')
    );
    if (indianEnglishVoice) return indianEnglishVoice;
    return voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
  };

  const startAudio = () => {
    if (!speechSupported || typeof window === 'undefined') return;

    window.speechSynthesis.cancel();

    const fullScript = generateNarrationScript(speechLang);
    setActiveSpeechText(fullScript);

    const sentences = fullScript
      .split(/(?<=[.।!?])\s+/)
      .filter((s) => s.trim().length > 0);
    setTotalSentences(sentences.length);

    const utterance = new SpeechSynthesisUtterance(fullScript);
    utteranceRef.current = utterance;

    utterance.lang = speechLang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = playbackSpeed;
    utterance.volume = isMuted ? 0 : 1;

    const voice = selectVoiceForLanguage(window.speechSynthesis, speechLang);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onboundary = (event) => {
      if (event.name === 'sentence' || event.charIndex !== undefined) {
        const charProgress = event.charIndex / (fullScript.length || 1);
        const estimatedSentence = Math.min(
          sentences.length - 1,
          Math.floor(charProgress * sentences.length)
        );
        setCurrentSentenceIndex(estimatedSentence);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceIndex(0);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const togglePlayPause = () => {
    if (!speechSupported) return;

    if (!isPlaying) {
      startAudio();
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);

    if (isPlaying) {
      stopAudio();
      setTimeout(() => startAudio(), 100);
    }
  };

  const toggleLanguage = () => {
    const nextLang = speechLang === 'en' ? 'hi' : 'en';
    setSpeechLang(nextLang);
    if (isPlaying) {
      stopAudio();
      setTimeout(() => {
        // Will start in new language
        setIsPlaying(false);
      }, 50);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (utteranceRef.current) {
      utteranceRef.current.volume = isMuted ? 1 : 0;
    }
  };

  if (!speechSupported) {
    return null;
  }

  return (
    <section
      aria-label="Multilingual Report Audio Narrator"
      className="relative overflow-hidden rounded-3xl border border-blue-200/90 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 shadow-md"
    >
      {/* Background Decorative Sound Waves */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-6">
        <Headphones className="w-40 h-40 text-blue-300" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left: Info & Status */}
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide">
              <Sparkles className="w-3 h-3 text-cyan-300" />
              <span>Voice Readout • बोलकर सुनें</span>
            </span>
            {isPlaying && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{isPaused ? 'Paused' : 'Playing...'}</span>
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>
              {speechLang === 'hi'
                ? 'रिपोर्ट का ऑडियो सारांश सुनें'
                : 'Listen to Simplified Clinical Summary'}
            </span>
          </h3>

          <p className="text-xs text-blue-100/80 leading-relaxed">
            {speechLang === 'hi'
              ? 'आसान भाषा में डॉक्टर जैसी आवाज़ में रिपोर्ट का विवरण और महत्वपूर्ण परिणाम सुनें।'
              : 'Clear voice readout explaining normal and abnormal findings in plain terms.'}
          </p>
        </div>

        {/* Right: Controls Strip */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-blue-100 transition-all cursor-pointer"
            title="Switch Narration Language"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-300" />
            <span>{speechLang === 'hi' ? 'हिंदी (Active)' : 'English'}</span>
          </button>

          {/* Speed Toggle */}
          <button
            onClick={cycleSpeed}
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-blue-100 transition-all cursor-pointer"
            title="Cycle Playback Speed"
          >
            <Gauge className="w-3.5 h-3.5 text-amber-300" />
            <span>{playbackSpeed}x</span>
          </button>

          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            type="button"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-blue-100 transition-all cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-300" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-300" />
            )}
          </button>

          {/* Reset / Stop */}
          {isPlaying && (
            <button
              onClick={stopAudio}
              type="button"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-blue-100 transition-all cursor-pointer"
              title="Stop & Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Main Play / Pause Button */}
          <button
            onClick={togglePlayPause}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-xs shadow-lg shadow-blue-500/30 transition-all cursor-pointer active:scale-95"
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isPaused ? 'Resume' : 'Listen Now'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Pulse Bar while playing */}
      {isPlaying && (
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-200/90">
          <div className="flex items-center gap-2">
            <span className="flex gap-0.5 items-end h-3">
              <span className="w-1 bg-cyan-400 animate-[bounce_1s_infinite_100ms] h-full rounded-full"></span>
              <span className="w-1 bg-cyan-400 animate-[bounce_1s_infinite_200ms] h-2/3 rounded-full"></span>
              <span className="w-1 bg-cyan-400 animate-[bounce_1s_infinite_300ms] h-4/5 rounded-full"></span>
              <span className="w-1 bg-cyan-400 animate-[bounce_1s_infinite_150ms] h-1/2 rounded-full"></span>
            </span>
            <span>
              {speechLang === 'hi'
                ? 'रिपोर्ट का ऑडियो चल रहा है...'
                : 'Reading report findings...'}
            </span>
          </div>

          <div className="font-mono text-cyan-300">
            Section {currentSentenceIndex + 1} of {Math.max(1, totalSentences)}
          </div>
        </div>
      )}
    </section>
  );
}
