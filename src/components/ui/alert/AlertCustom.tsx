import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom"; // 1. TAMBAHKAN IMPORT INI

interface AlertCustomProps {
  isOpen: boolean;
  onClose: () => void;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  btnText?: string;
}

const AlertCustom: React.FC<AlertCustomProps> = ({
  isOpen,
  onClose,
  variant,
  title,
  message,
  btnText = "Baik, Saya Mengerti",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Mencegah scroll pada body saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Cek mounted agar aman saat Server Side Rendering (Next.js)
  if (!mounted || !isOpen) return null;

  const variantClasses = {
    success: {
      iconBg: "bg-success-50 text-success-500 dark:bg-success-500/10 dark:text-success-400",
      button: "bg-success-500 hover:bg-success-600 focus:ring-success-500 shadow-success-500/20",
    },
    error: {
      iconBg: "bg-error-50 text-error-500 dark:bg-error-500/10 dark:text-error-400",
      button: "bg-error-500 hover:bg-error-600 focus:ring-error-500 shadow-error-500/20",
    },
    warning: {
      iconBg: "bg-warning-50 text-warning-500 dark:bg-warning-500/10 dark:text-warning-400",
      button: "bg-warning-500 hover:bg-warning-600 focus:ring-warning-500 shadow-warning-500/20",
    },
    info: {
      iconBg: "bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/10 dark:text-blue-light-400",
      button: "bg-blue-light-500 hover:bg-blue-light-600 focus:ring-blue-light-500 shadow-blue-light-500/20",
    },
  };

  const icons = {
    success: (
      <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.7 8.7L10.7 14.7L7.3 11.3C6.9 10.9 6.3 10.9 5.9 11.3C5.5 11.7 5.5 12.3 5.9 12.7L10 16.8C10.4 17.2 11 17.2 11.4 16.8L18.1 10.1C18.5 9.7 18.5 9.1 18.1 8.7C17.7 8.3 17.1 8.3 16.7 8.7Z" />
      </svg>
    ),
    error: (
      <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.53 15.53C15.24 15.82 14.76 15.82 14.47 15.53L12 13.06L9.53 15.53C9.24 15.82 8.76 15.82 8.47 15.53C8.18 15.24 8.18 14.76 8.47 14.47L10.94 12L8.47 9.53C8.18 9.24 8.18 8.76 8.47 8.47C8.76 8.18 9.24 8.18 9.53 8.47L12 10.94L14.47 8.47C14.76 8.18 15.24 8.18 15.53 8.47C15.82 8.76 15.82 9.24 15.53 9.53L13.06 12L15.53 14.47C15.82 14.76 15.82 15.24 15.53 15.53Z" />
      </svg>
    ),
    warning: (
      <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
      </svg>
    ),
    info: (
      <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" />
      </svg>
    ),
  };

  // 2. GUNAKAN createPortal UNTUK MELEMPAR KONTEN KE BODY
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px] dark:bg-gray-900/60"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-[20px] shadow-2xl p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`flex items-center justify-center w-20 h-20 rounded-full ${variantClasses[variant].iconBg}`}>
            {icons[variant]}
          </div>
        </div>

        {/* Text Content */}
        <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mb-8 text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          {message}
        </p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className={`w-full py-3 px-4 rounded-xl text-white font-bold text-base transition-all transform active:scale-95 ${variantClasses[variant].button}`}
        >
          {btnText}
        </button>
      </div>
    </div>,
    document.body // Target render di body
  );
};

export default AlertCustom;