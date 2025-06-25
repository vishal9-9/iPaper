
'use server';

import { generateWallpaper } from '@/ai/flows/generate-wallpaper';
import { generateWallpaperFromTheme } from '@/ai/flows/theme-wallpaper';
import { z } from 'zod';

const GenerateWallpaperActionInput = z.object({
  prompt: z.string().min(3, { message: 'Prompt must be at least 3 characters long.' }),
});

export async function generateWallpaperAction(formData: FormData) {
  const rawInput = {
    prompt: formData.get('prompt'),
  };
  const validation = GenerateWallpaperActionInput.safeParse(rawInput);
  
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.flatten().fieldErrors.prompt?.[0] || 'Invalid input.',
    };
  }

  try {
    const result = await generateWallpaper({ promptText: validation.data.prompt });
    return { success: true, data: result.wallpaperDataUri };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to generate wallpaper. Please try again.' };
  }
}

const GenerateWallpaperFromThemeActionInput = z.object({
    theme: z.enum(['nature', 'abstract', 'minimal']),
});

export async function generateWallpaperFromThemeAction(theme: 'nature' | 'abstract' | 'minimal') {
    const validation = GenerateWallpaperFromThemeActionInput.safeParse({ theme });

    if (!validation.success) {
        return {
            success: false,
            error: 'Invalid theme selected.',
        };
    }

    try {
        const result = await generateWallpaperFromTheme({ theme: validation.data.theme });
        return { success: true, data: result.wallpaperDataUri };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to generate wallpaper from theme. Please try again.' };
    }
}
