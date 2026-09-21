import React, { useState } from 'react';
import { FileItem } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { DICTIONARY, Language } from '../../services/i18n';

interface ReportBrokenLinkModalProps {
  file: FileItem | null;
  language: Language;
  onClose: () => void;
}

export const ReportBrokenLinkModal: React.FC<ReportBrokenLinkModalProps> = ({
  file,
  language,
  onClose,
}) => {
  const t = DICTIONARY[language];
  const { submitBrokenLinkReport } = useStore();
  const { currentUser } = useAuth();

  const [reason, setReason] = useState<string>(t.reasonBroken);
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!file) return null;

  const reasonsList = [
    t.reasonBroken,
    t.reasonSlow,
    t.reasonExpired,
    t.reasonWrongFile,
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitBrokenLinkReport({
        fileId: file.id,
        fileName: file.name,
        userEmail: email || currentUser?.email || 'guest@user',
        reason,
        details,
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-white relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.reportBrokenLink}</h3>
              <p className="text-xs text-neutral-400 truncate max-w-[240px]">{file.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl border border-emerald-500/30">
              <i className="fa-solid fa-check"></i>
            </div>
            <h4 className="text-sm font-bold text-white">{t.reportSuccess}</h4>
            <p className="text-xs text-neutral-400">Our admin team will review and replace the link promptly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Issue Description
              </label>
              <div className="space-y-2">
                {reasonsList.map((r, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      reason === r
                        ? 'bg-amber-400/10 border-amber-400/50 text-amber-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="accent-amber-400"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {t.notesOptional}
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="e.g. Server returned 404 Not Found error..."
                rows={2}
                className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 transition"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-extrabold shadow-md shadow-amber-400/20 active:scale-95 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : t.submitReport}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
