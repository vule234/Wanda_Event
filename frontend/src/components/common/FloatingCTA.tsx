'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

const MESSAGE =
  'Liên hệ ngay với Wanda Event để chúng tôi đồng hành cùng bạn từ ý tưởng đến triển khai trọn vẹn';

export const FloatingCTA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const hasAutoOpenedRef = useRef(false);
  const modalCardRef = useRef<HTMLDivElement | null>(null);
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

  const playClickSound = useCallback(() => {
    if (typeof window === 'undefined') return;

    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }).webkitAudioContext;

    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(720, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      980,
      audioContext.currentTime + 0.12,
    );

    gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.16, audioContext.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.22);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.22);

    window.setTimeout(() => {
      void audioContext.close().catch(() => undefined);
    }, 260);
  }, []);

  const openModal = useCallback(
    (withSound = true) => {
      if (withSound) {
        playClickSound();
      }
      setIsTyping((currentTyping) => {
        if (!currentTyping) {
          return true;
        }
        window.setTimeout(() => {
          setIsTyping(true);
        }, 0);
        return false;
      });
      setIsOpen(true);
    },
    [playClickSound],
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIsTyping(false);
  }, []);

  useEffect(() => {
    const modalTimer = window.setTimeout(() => {
      if (!hasAutoOpenedRef.current) {
        hasAutoOpenedRef.current = true;
        openModal(false);
      }
    }, 2600);

    return () => {
      window.clearTimeout(modalTimer);
    };
  }, [openModal]);

  useEffect(() => {
    if (!isOpen || !isTyping) return;

    const typingTimer = window.setTimeout(() => {
      setIsTyping(false);
    }, 1800);

    return () => {
      window.clearTimeout(typingTimer);
    };
  }, [isOpen, isTyping]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClose = (event: PointerEvent) => {
      const target = event.target as Node | null;
      const modalNode = modalCardRef.current;
      const triggerNode = triggerButtonRef.current;

      if (!target || !modalNode) return;
      if (modalNode.contains(target)) return;
      if (triggerNode?.contains(target)) return;

      closeModal();
    };

    document.addEventListener('pointerdown', handleOutsideClose);

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClose);
    };
  }, [closeModal, isOpen]);


  return (
    <>
      <div className="fixed fixed-cta-safe bottom-4 right-4 z-[60] flex max-w-[calc(100vw-1rem)] flex-col items-end gap-3 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6">
        {isOpen ? (
          <div className="relative z-20 w-[min(24rem,calc(100vw-1rem))] animate-[chatSlideUp_420ms_cubic-bezier(0.22,1,0.36,1)] sm:w-[24rem]">
            <div
              ref={modalCardRef}
              id="wanda-premium-contact-modal"
              className="overflow-hidden rounded-[1.7rem] rounded-br-md border border-white/70 bg-white/96 shadow-[0_30px_70px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl"
            >
              <div className="relative border-b border-slate-100/90 bg-[linear-gradient(135deg,#f8fafc_0%,#ffffff_100%)] px-4 py-3 pr-16 sm:px-5 sm:pr-20">

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-[0_10px_24px_rgba(0,17,58,0.22)]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M8 10h8M8 14h5m7-2c0 4.418-4.03 8-9 8a9.94 9.94 0 01-4.25-.939L3 20l1.196-3.388C3.432 15.29 3 13.691 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">Wanda Event</p>
                    <p className="text-xs text-emerald-600">Đang hoạt động</p>
                  </div>
                </div>

                <button
                  id="wanda-premium-contact-close"
                  type="button"
                  onClick={closeModal}
                  className="tap-target-comfort touch-manipulation absolute right-2 top-2 z-30 inline-flex items-center justify-center rounded-full bg-white/94 text-slate-500 shadow-[0_12px_28px_rgba(15,23,42,0.12)] transition-all duration-200 active:scale-[0.97] active:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 sm:right-3 sm:top-3"
                  aria-label="Close"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>

              </div>

              <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-4 sm:px-5">
                <div className="flex justify-start">
                  <div className="max-w-[88%] rounded-[1.35rem] rounded-bl-sm bg-white px-4 py-3 text-sm leading-7 text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
                    {MESSAGE}
                  </div>
                </div>

                {isTyping ? (
                  <div className="mt-3 flex justify-start">
                    <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
                      <span className="h-2 w-2 rounded-full bg-slate-300 animate-[typingBounce_1s_ease-in-out_infinite]" />
                      <span className="h-2 w-2 rounded-full bg-slate-300 animate-[typingBounce_1s_ease-in-out_0.15s_infinite]" />
                      <span className="h-2 w-2 rounded-full bg-slate-300 animate-[typingBounce_1s_ease-in-out_0.3s_infinite]" />
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="space-y-3 border-t border-slate-100 px-4 py-4 sm:px-5">
                <a
                  id="wanda-premium-contact-zalo"
                  href="https://zalo.me/0962622438"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(0,17,58,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  Mở Zalo để phản hồi
                </a>
                <a
                  href="tel:0962622438"
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Gọi hotline ngay
                </a>
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition-all duration-200 active:bg-slate-100"
                >
                  Đóng cửa sổ chat
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {!isOpen ? (
          <button
            ref={triggerButtonRef}
            id="floating-premium-contact-trigger"
            type="button"
            onClick={() => openModal(true)}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls="wanda-premium-contact-modal"
            className="tap-target-comfort touch-manipulation group relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_18px_40px_rgba(0,17,58,0.28)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(0,17,58,0.34)] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-primary/30 sm:h-15 sm:w-15"
          >

            <span className="pointer-events-none absolute -inset-1 rounded-full border border-primary/25 animate-[ping_2.8s_ease-out_infinite]" />
            <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_0_rgba(0,17,58,0.18)] animate-[pulse_2.6s_ease-in-out_infinite]" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full animate-[wiggle_3.4s_ease-in-out_infinite] group-hover:animate-none sm:h-15 sm:w-15">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M8 10h8M8 14h5m7-2c0 4.418-4.03 8-9 8a9.94 9.94 0 01-4.25-.939L3 20l1.196-3.388C3.432 15.29 3 13.691 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </span>
          </button>
        ) : null}
      </div>

      <style jsx>{`
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg) scale(1);
          }
          8% {
            transform: rotate(-7deg) scale(1.02);
          }
          16% {
            transform: rotate(7deg) scale(1.04);
          }
          24% {
            transform: rotate(-5deg) scale(1.02);
          }
          32% {
            transform: rotate(4deg) scale(1);
          }
          40% {
            transform: rotate(0deg) scale(1);
          }
        }

        @keyframes typingBounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
            opacity: 0.45;
          }
          40% {
            transform: translateY(-3px);
            opacity: 1;
          }
        }

        @keyframes chatSlideUp {
          0% {
            opacity: 0;
            transform: translateY(28px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
};
