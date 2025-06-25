'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type IphonePreviewProps = {
  imageUrl: string;
  isLoading: boolean;
  className?: string;
};

export function IphonePreview({ imageUrl, isLoading, className }: IphonePreviewProps) {
  return (
    <div className={cn("relative w-[300px] h-[609px] bg-black rounded-[48px] border-[8px] border-black shadow-2xl overflow-hidden", className)}>
      <div className="absolute top-0 left-0 w-full h-full">
        <Image
          src={imageUrl}
          alt="Generated wallpaper preview"
          className="object-cover w-full h-full"
          width={375}
          height={812}
          data-ai-hint={!imageUrl.startsWith('data:') ? 'lavender abstract' : undefined}
        />
      </div>
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      )}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-black rounded-b-2xl"></div>
      <div className="absolute -left-1 top-24 h-24 w-1.5 bg-black rounded-r-sm"></div>
      <div className="absolute -right-1 top-28 h-12 w-1.5 bg-black rounded-l-sm"></div>
      <div className="absolute -right-1 top-44 h-12 w-1.5 bg-black rounded-l-sm"></div>
    </div>
  );
}
