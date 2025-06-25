'use client';

import Image from 'next/image';
import { Loader2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
 DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';



type IphonePreviewProps = {
  imageUrl: string;
  isLoading: boolean;
  className?: string;
};

export function IphonePreview({ imageUrl, isLoading, className }: IphonePreviewProps) {
  const [selectedResolution, setSelectedResolution] = useState({ width: 320, height: 568, name: 'iPhone 5/SE (1st gen)', displayType: 'square' });

  const resolutions = [
    { width: 320, height: 568, name: 'iPhone 5/SE (1st gen)', displayType: 'square' },
    { width: 375, height: 667, name: 'iPhone 6/7/8', displayType: 'square' },
    { width: 414, height: 736, name: 'iPhone 6+/7+/8+', displayType: 'square' },
    { width: 375, height: 812, name: 'iPhone X/XS/11 Pro', displayType: 'notched' },
    { width: 414, height: 896, name: 'iPhone XR/11', displayType: 'notched' },
    { width: 390, height: 844, name: 'iPhone 12/12 Pro/13/13 Pro/14', displayType: 'notched' },
    { width: 428, height: 926, name: 'iPhone 12 Pro Max/13 Pro Max', displayType: 'notched' },
    { width: 393, height: 852, name: 'iPhone 14 Pro/15', displayType: 'dynamic-island' },
    { width: 430, height: 932, name: 'iPhone 14 Pro Max/15 Plus/15 Pro Max', displayType: 'dynamic-island' },
  ];

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 mb-4 text-sm text-gray-500 dark:text-gray-400">
          {selectedResolution.name} ({selectedResolution.width}x{selectedResolution.height}) <ChevronDown size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {resolutions.map((res) => (
            <DropdownMenuItem
              key={`${res.width}x${res.height}`}
              onClick={() => setSelectedResolution(res)}
            >
              {res.name} ({res.width}x{res.height})
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className={cn(`relative w-[300px] h-[609px] bg-black rounded-[48px] border-[8px] border-black shadow-2xl overflow-hidden`)}>
      <div className="absolute top-0 left-0 w-full h-full">
        <Image
          src={imageUrl}
          alt="Generated wallpaper preview"
          className="object-cover w-full h-full"
          width={selectedResolution.width}
          height={selectedResolution.height}
          data-ai-hint={!imageUrl.startsWith('data:') ? 'lavender abstract' : undefined}
        />
      </div>
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      )}
      {selectedResolution.displayType === 'notched' && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-black rounded-b-2xl"></div>
      )}
      {selectedResolution.displayType === 'dynamic-island' && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-8 bg-black rounded-b-xl"></div>
      )}
      {/* iPhone hardware details (side buttons) - These are generally consistent across modern iPhones */}
      <div className="absolute -left-1 top-24 h-24 w-1.5 bg-black rounded-r-sm"></div>
      <div className="absolute -right-1 top-28 h-12 w-1.5 bg-black rounded-l-sm"></div>
      <div className="absolute -right-1 top-44 h-12 w-1.5 bg-black rounded-l-sm"></div>
    </div>
    </div>
  );
}
