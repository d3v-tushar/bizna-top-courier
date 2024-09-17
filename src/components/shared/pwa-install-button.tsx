'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaInstallButton() {
  const [installType, setInstallType] = useState<'native' | 'ios' | 'none'>(
    'none',
  );
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setPromptInstall(event);
      setInstallType('native');
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt as EventListener,
    );

    if (
      /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) &&
      !(window.navigator as any).standalone
    ) {
      setInstallType('ios');
    }

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt as EventListener,
      );
    };
  }, []);

  const handleInstall = async () => {
    if (installType === 'native' && promptInstall) {
      try {
        await promptInstall.prompt();
        const { outcome } = await promptInstall.userChoice;
        if (outcome === 'accepted') {
          console.log('User accepted the installation');
        } else {
          console.log('User dismissed the installation');
        }
        setPromptInstall(null);
      } catch (error) {
        console.error('Installation failed:', error);
      }
    }
  };

  if (installType === 'none') {
    return null;
  }

  // if (installType === 'ios') {
  //   return (
  //     <div className="rounded-lg bg-blue-100 p-4 text-blue-800">
  //       To install this app on your iOS Device tap the share button
  //       <span className="mx-1 inline-block">
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           width="20"
  //           height="20"
  //           viewBox="0 0 24 24"
  //           fill="none"
  //           stroke="currentColor"
  //           strokeWidth="2"
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           aria-label="Share icon"
  //         >
  //           <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
  //           <polyline points="16 6 12 2 8 6"></polyline>
  //           <line x1="12" y1="2" x2="12" y2="15"></line>
  //         </svg>
  //       </span>
  //       and then &apos;Add to Home Screen&apos;.
  //     </div>
  //   );
  // }

  return (
    <Button size="sm" onClick={handleInstall} disabled={!promptInstall}>
      Install
    </Button>
  );
}
