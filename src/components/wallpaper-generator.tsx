'use client';

import { useState, useTransition, useRef } from 'react';
import Image from 'next/image';
import { Download, History, Loader2, Paintbrush, Sparkles } from 'lucide-react';
import { generateWallpaperAction, generateWallpaperFromThemeAction } from '@/app/actions';
import { IphonePreview } from '@/components/iphone-preview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/icons';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const THEMES = [
  { name: 'Nature', value: 'nature', icon: <span className="text-xl">🏞️</span> },
  { name: 'Abstract', value: 'abstract', icon: <span className="text-xl">🎨</span> },
  { name: 'Minimal', value: 'minimal', icon: <span className="text-xl">🧘</span> },
];

const INITIAL_WALLPAPER = 'https://placehold.co/375x812.png';

export function WallpaperGenerator() {
  const [isPending, startTransition] = useTransition();
  const [currentWallpaper, setCurrentWallpaper] = useState<string>(INITIAL_WALLPAPER);
  const [history, setHistory] = useState<string[]>([INITIAL_WALLPAPER]);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleAction = (action: () => Promise<{ success: boolean; data?: string; error?: string }>) => {
    startTransition(async () => {
      const result = await action();
      if (result.success && result.data) {
        setCurrentWallpaper(result.data);
        setHistory(prev => [result.data!, ...prev].slice(0, 10)); // Keep last 10
      } else {
        toast({
          variant: 'destructive',
          title: 'Oh no! Something went wrong.',
          description: result.error || 'There was a problem with your request.',
        });
      }
    });
  };

  const handlePromptSubmit = (formData: FormData) => {
    handleAction(() => generateWallpaperAction(formData));
    formRef.current?.reset();
  };

  const handleThemeClick = (theme: 'nature' | 'abstract' | 'minimal') => {
    handleAction(() => generateWallpaperFromThemeAction(theme));
  };
  
  return (
    <div className="container mx-auto p-4 md:p-8 grid md:grid-cols-2 gap-8 lg:gap-12 min-h-screen items-center">
      <div className="flex flex-col gap-8 h-full justify-center">
        <header className="flex items-center gap-3">
          <Logo className="w-8 h-8 text-accent" />
          <h1 className="text-3xl font-bold tracking-tight font-headline">iPaper</h1>
        </header>
        <p className="text-muted-foreground">
          Craft your perfect iPhone wallpaper. Describe your vision, pick a theme, and let AI bring it to life.
        </p>

        <Card>
          <CardContent className="p-6 space-y-6">
            <form action={handlePromptSubmit} ref={formRef} className="space-y-2">
              <label htmlFor="prompt" className="font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                Generate with a prompt
              </label>
              <div className="flex gap-2">
                <Input name="prompt" id="prompt" placeholder="e.g., A cat wearing sunglasses on a beach" required />
                <Button type="submit" disabled={isPending} className="w-28 bg-accent text-accent-foreground hover:bg-accent/90">
                  {isPending ? <Loader2 className="animate-spin" /> : 'Generate'}
                </Button>
              </div>
            </form>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2"><Paintbrush className="w-4 h-4 text-accent" />Or pick a theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {THEMES.map((theme) => (
                  <Button
                    key={theme.value}
                    variant="outline"
                    className="flex flex-col h-20 gap-2"
                    onClick={() => handleThemeClick(theme.value as any)}
                    disabled={isPending}
                  >
                    {theme.icon}
                    <span>{theme.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {history.length > 1 && (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2"><History className="w-4 h-4 text-accent" />History</h3>
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-4">
                {history.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentWallpaper(img)}
                    className="rounded-lg overflow-hidden shrink-0 w-20 h-40 focus:outline-none focus:ring-2 focus:ring-ring ring-offset-2 ring-offset-background"
                  >
                    <Image
                      src={img}
                      alt={`History item ${index + 1}`}
                      width={80}
                      height={160}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                      data-ai-hint={!img.startsWith('data:') ? 'lavender abstract' : undefined}
                    />
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 items-center justify-center">
        <IphonePreview imageUrl={currentWallpaper} isLoading={isPending} />
        <Button asChild size="lg" disabled={currentWallpaper === INITIAL_WALLPAPER || isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <a href={currentWallpaper} download="iPaper-wallpaper.png">
            <Download className="mr-2" />
            Save Wallpaper
          </a>
        </Button>
      </div>
    </div>
  );
}
