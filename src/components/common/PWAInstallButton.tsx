import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  language?: 'en' | 'bn';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language = 'en' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const label = language === 'bn' ? 'অ্যাপ ইন্সটল করুন' : 'Install App';
  const iosLabel = language === 'bn' ? 'iOS এ ইন্সটল' : 'Install on iOS';

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black px-3.5 py-1.5 text-xs font-bold shadow-md shadow-amber-400/20 hover:from-amber-300 hover:to-amber-400 active:scale-95 transition-all duration-150 cursor-pointer"
        title="Install as Progressive Web App"
      >
        <i className="fa-solid fa-mobile-screen-button text-xs"></i>
        <span>{label}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-amber-400/30 bg-neutral-900/80 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-neutral-800 transition"
        >
          <i className="fa-brands fa-apple text-xs"></i>
          <span>{iosLabel}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-white">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-4">
                <i className="fa-brands fa-apple text-lg"></i>
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {language === 'bn' ? 'iPhone / iPad এ ইন্সটল করুন' : 'Install on iPhone / iPad'}
              </h3>
              <p className="text-xs text-neutral-300 space-y-2 leading-relaxed mb-5">
                {language === 'bn' ? (
                  <>
                    ১. Safari ব্রাউজারের নিচের <strong>Share (শেয়ার)</strong> বাটনে ট্যাপ করুন।<br />
                    ২. নিচে স্ক্রল করে <strong>Add to Home Screen (হোম স্ক্রিনে যোগ)</strong> নির্বাচন করুন।
                  </>
                ) : (
                  <>
                    1. Tap the <strong>Share</strong> button at the bottom of Safari.<br />
                    2. Scroll down and choose <strong>Add to Home Screen</strong>.
                  </>
                )}
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-neutral-800 hover:bg-neutral-700 py-2.5 text-xs font-bold text-neutral-200 transition"
              >
                {language === 'bn' ? 'বুঝেছি / বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
