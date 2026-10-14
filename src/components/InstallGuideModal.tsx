import React, { useState } from 'react';
import { X, Smartphone, Download, QrCode, Wifi, Check, ExternalLink } from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  localIp: string;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  localIp,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const url = `http://${localIp || '192.168.0.14'}:5173`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Como Ter no Celular Android
              </h2>
              <p className="text-xs text-slate-500">
                Instale no seu telefone em menos de 1 minuto
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* Método 1 - O Oficial do Android (WebAPK) */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
              <Download className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Método 1: Instalação Direta no Android (Recomendado)
              </h3>
            </div>
            <p className="text-xs text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed">
              O Android possui uma tecnologia chamada <strong>WebAPK</strong>. Quando você acessa pelo Chrome no celular e clica em <strong>"Instalar aplicativo"</strong>, o próprio sistema Android gera o APK e instala como um app comum na gaveta de aplicativos do seu celular.
            </p>

            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 space-y-2">
              <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                1. No celular conectado ao mesmo Wi-Fi de casa, abra o Chrome e acesse:
              </p>
              <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-lg">
                <span className="font-mono text-xs font-bold text-emerald-600 select-all">
                  {url}
                </span>
                <button
                  onClick={handleCopyUrl}
                  className="text-xs px-2 py-1 rounded bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:scale-95"
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>

              <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 pt-1">
                2. Toque nos <strong>3 pontinhos (⋮)</strong> no topo do Chrome do celular:
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-3">
                • Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-3">
                • Pronto! O ícone do <strong>NutriDigest</strong> aparecerá na tela do seu celular e funcionará em tela cheia mesmo sem internet!
              </p>
            </div>
          </div>

          {/* Método 2 - O arquivo .APK Físico */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Método 2: Se você precisa do arquivo .APK avulso
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Um arquivo <code>.apk</code> é o pacote compilado pelo Android SDK. Caso você queira gerar o arquivo <code>.apk</code> para compartilhar ou guardar:
            </p>

            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-5">
              <li>
                <strong>PWABuilder (Microsoft - Grátis e Automático):</strong> Você pode publicar o app (por exemplo na Vercel ou Netlify em 1 clique) e colar o link no 
                <a
                  href="https://www.pwabuilder.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 font-bold underline ml-1 inline-flex items-center gap-0.5"
                >
                  PWABuilder <ExternalLink className="w-3 h-3" />
                </a>. Ele compila e baixa o arquivo <code>.apk</code> pronto para você!
              </li>
              <li>
                <strong>Android Studio / Capacitor:</strong> Já deixamos o código preparado com TypeScript e Vite. Se você tiver o Android Studio instalado, basta empacotar com o Capacitor.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold text-xs"
          >
            Entendi, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
