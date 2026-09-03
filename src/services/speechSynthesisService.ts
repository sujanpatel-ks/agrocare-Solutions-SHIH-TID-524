import { Task, Language } from '../types';

export interface SpeechStatus {
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  currentTaskIndex: number;
  totalTasks: number;
}

class SpeechSynthesisService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices(): void {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    if (this.voices.length > 0) {
      this.voicesLoaded = true;
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  private findBestVoice(lang: Language): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    if (!voices || voices.length === 0) return null;

    let targetLangCode = 'en-IN';
    if (lang === 'hi') targetLangCode = 'hi-IN';
    else if (lang === 'kn') targetLangCode = 'kn-IN';
    else if (lang === 'ta') targetLangCode = 'ta-IN';
    else if (lang === 'te') targetLangCode = 'te-IN';
    else if (lang === 'mr') targetLangCode = 'mr-IN';

    // 1. Exact match on target locale (e.g., 'hi-IN')
    const exactMatch = voices.find(v => v.lang.toLowerCase() === targetLangCode.toLowerCase());
    if (exactMatch) return exactMatch;

    // 2. Prefix match on primary language (e.g., 'hi', 'kn', 'en')
    const langPrefix = lang;
    const prefixMatch = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
    if (prefixMatch) return prefixMatch;

    // 3. Indian English fallback if Hindi/regional voice isn't installed
    if (lang !== 'en') {
      const indianEnglish = voices.find(v => v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india'));
      if (indianEnglish) return indianEnglish;
    }

    // 4. Default English voice
    const englishMatch = voices.find(v => v.lang.toLowerCase().startsWith('en'));
    if (englishMatch) return englishMatch;

    return voices[0] || null;
  }

  public formatUrgentTasksSpeechText(urgentTasks: Task[], lang: Language): string {
    if (urgentTasks.length === 0) return '';

    const count = urgentTasks.length;

    if (lang === 'hi') {
      const intro = count === 1 
        ? `नमस्ते किसान भाई! आपके पास एक ज़रूरी लंबित कार्य है। कृपया ध्यान दें:`
        : `नमस्ते किसान भाई! आपके पास ${count} ज़रूरी लंबित कार्य हैं। कृपया ध्यान दें:`;
      
      const taskTexts = urgentTasks.map((task, idx) => {
        const title = task.titleHi || task.title;
        const desc = task.description || '';
        return `कार्य ${idx + 1}: ${title}। ${desc}`;
      }).join(' ');

      return `${intro} ${taskTexts}। कृपया इन कार्यों को समय पर पूरा करें। धन्यवाद!`;
    }

    if (lang === 'kn') {
      const intro = count === 1
        ? `ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೇ! ನಿಮಗೆ ಒಂದು ತುರ್ತು ಬಾಕಿ ಕಾರ್ಯವಿದೆ. ದಯವಿಟ್ಟು ಗಮನಿಸಿ:`
        : `ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೇ! ನಿಮಗೆ ${count} ತುರ್ತು ಬಾಕಿ ಕಾರ್ಯಗಳಿವೆ. ದಯವಿಟ್ಟು ಗಮನಿಸಿ:`;

      const taskTexts = urgentTasks.map((task, idx) => {
        const title = task.titleKn || task.title;
        const desc = task.description || '';
        return `ಕಾರ್ಯ ${idx + 1}: ${title}. ${desc}`;
      }).join(' ');

      return `${intro} ${taskTexts}. ದಯವಿಟ್ಟು ಈ ಕಾರ್ಯಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ. ಧನ್ಯವಾದಗಳು!`;
    }

    // Default English
    const intro = count === 1
      ? `Attention Farmer! You have 1 urgent pending task that requires your immediate action:`
      : `Attention Farmer! You have ${count} urgent pending tasks that require your immediate action:`;

    const taskTexts = urgentTasks.map((task, idx) => {
      return `Task ${idx + 1}: ${task.title}. ${task.description}.`;
    }).join(' ');

    return `${intro} ${taskTexts} Please attend to these tasks promptly.`;
  }

  public speak(
    text: string,
    lang: Language = 'en',
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
      onPause?: () => void;
      onResume?: () => void;
      rate?: number;
      pitch?: number;
      volume?: number;
    }
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.isSupported() || !this.synth) {
        console.warn('SpeechSynthesis is not supported in this browser.');
        options?.onError?.(new Error('SpeechSynthesis not supported'));
        resolve(false);
        return;
      }

      try {
        // Cancel any ongoing speech
        this.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance = utterance;

        const bestVoice = this.findBestVoice(lang);
        if (bestVoice) {
          utterance.voice = bestVoice;
        }

        // Set locale code
        let langCode = 'en-IN';
        if (lang === 'hi') langCode = 'hi-IN';
        else if (lang === 'kn') langCode = 'kn-IN';
        utterance.lang = bestVoice?.lang || langCode;

        utterance.rate = options?.rate ?? 0.95; // slightly slower for clear agricultural instructions
        utterance.pitch = options?.pitch ?? 1.0;
        utterance.volume = options?.volume ?? 1.0;

        utterance.onstart = () => {
          options?.onStart?.();
        };

        utterance.onend = () => {
          this.currentUtterance = null;
          options?.onEnd?.();
          resolve(true);
        };

        utterance.onerror = (event) => {
          console.warn('SpeechSynthesis utterance error:', event);
          this.currentUtterance = null;
          options?.onError?.(event);
          resolve(false);
        };

        utterance.onpause = () => {
          options?.onPause?.();
        };

        utterance.onresume = () => {
          options?.onResume?.();
        };

        this.synth.speak(utterance);
      } catch (err) {
        console.error('Failed to initiate speech synthesis:', err);
        options?.onError?.(err);
        resolve(false);
      }
    });
  }

  public pause(): void {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public cancel(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return !!this.synth && (this.synth.speaking || !!this.currentUtterance);
  }

  public isPaused(): boolean {
    return !!this.synth && this.synth.paused;
  }
}

export const speechService = new SpeechSynthesisService();
