'use client';

import React from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          theme?: 'light' | 'dark' | 'auto';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove?: (widgetId: string) => void;
    };
    __wandaTurnstilePromise?: Promise<void>;
  }
}

type TurnstileWidgetProps = {
  id: string;
  siteKey: string;
  theme?: 'light' | 'dark' | 'auto';
  onTokenChange: (token: string | null) => void;
  onError?: (message: string) => void;
};

const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';
const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function loadTurnstileScript() {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (window.turnstile) {
    return Promise.resolve();
  }

  if (window.__wandaTurnstilePromise) {
    return window.__wandaTurnstilePromise;
  }

  window.__wandaTurnstilePromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Không thể tải Turnstile script')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Không thể tải Turnstile script'));
    document.head.appendChild(script);
  });

  return window.__wandaTurnstilePromise;
}

export function TurnstileWidget({
  id,
  siteKey,
  theme = 'light',
  onTokenChange,
  onError,
}: TurnstileWidgetProps) {
  const widgetIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    loadTurnstileScript()
      .then(() => {
        if (!mounted || !window.turnstile) {
          return;
        }

        const container = document.getElementById(id);
        if (!container) {
          return;
        }

        container.innerHTML = '';
        onTokenChange(null);

        widgetIdRef.current = window.turnstile.render(container, {
          sitekey: siteKey,
          theme,
          callback: (token) => {
            onTokenChange(token);
          },
          'expired-callback': () => {
            onTokenChange(null);
          },
          'error-callback': () => {
            onTokenChange(null);
            onError?.('Xác thực CAPTCHA gặp lỗi. Vui lòng thử lại.');
          },
        });
      })
      .catch((error) => {
        onTokenChange(null);
        onError?.(error instanceof Error ? error.message : 'Không thể khởi tạo CAPTCHA');
      });

    return () => {
      mounted = false;
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [id, onError, onTokenChange, siteKey, theme]);

  const handleReset = React.useCallback(() => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      onTokenChange(null);
    }
  }, [onTokenChange]);

  return (
    <div className="space-y-3">
      <div
        id={id}
        className="min-h-[74px] rounded-2xl border border-slate-200 bg-slate-50 p-3"
      />
      <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
        <p>Hệ thống dùng Cloudflare Turnstile để bảo vệ form khỏi bot spam.</p>
        <button
          id={`${id}-reset`}
          type="button"
          onClick={handleReset}
          className="rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-600 transition-colors hover:border-primary/30 hover:text-primary"
        >
          Tải lại CAPTCHA
        </button>
      </div>
    </div>
  );
}
