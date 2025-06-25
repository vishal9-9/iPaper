'use server';

/**
 * @fileOverview Enhances an existing wallpaper to create a variation or improve its quality.
 *
 * - enhanceWallpaper - A function that enhances an existing wallpaper.
 * - EnhanceWallpaperInput - The input type for the enhanceWallpaper function.
 * - EnhanceWallpaperOutput - The return type for the enhanceWallpaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceWallpaperInputSchema = z.object({
  originalWallpaper: z
    .string()
    .describe(
      'The original wallpaper to enhance, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // as a data URI
    ),
  enhancementDescription: z
    .string()
    .describe(
      'A description of the desired enhancements, such as \'add more detail\' or \'refine the color palette\'.' // description of enhancements
    ),
});
export type EnhanceWallpaperInput = z.infer<typeof EnhanceWallpaperInputSchema>;

const EnhanceWallpaperOutputSchema = z.object({
  enhancedWallpaper: z
    .string()
    .describe(
      'The enhanced wallpaper, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // as a data URI
    ),
});
export type EnhanceWallpaperOutput = z.infer<typeof EnhanceWallpaperOutputSchema>;

export async function enhanceWallpaper(
  input: EnhanceWallpaperInput
): Promise<EnhanceWallpaperOutput> {
  return enhanceWallpaperFlow(input);
}

const enhanceWallpaperPrompt = ai.definePrompt({
  name: 'enhanceWallpaperPrompt',
  input: {schema: EnhanceWallpaperInputSchema},
  output: {schema: EnhanceWallpaperOutputSchema},
  prompt: `You are an AI that enhances existing wallpapers based on user descriptions.

Given the original wallpaper and the desired enhancements, generate an enhanced version of the wallpaper.

Original Wallpaper: {{media url=originalWallpaper}}
Enhancements: {{{enhancementDescription}}}

Enhanced Wallpaper:`, // added media template
  model: 'googleai/gemini-2.0-flash-preview-image-generation',
  config: {
    responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
  },
});

const enhanceWallpaperFlow = ai.defineFlow(
  {
    name: 'enhanceWallpaperFlow',
    inputSchema: EnhanceWallpaperInputSchema,
    outputSchema: EnhanceWallpaperOutputSchema,
  },
  async input => {
    const {media} = await enhanceWallpaperPrompt({
      ...input,
    });

    return {enhancedWallpaper: media!.url!};
  }
);
