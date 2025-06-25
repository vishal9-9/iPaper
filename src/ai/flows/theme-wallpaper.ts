// src/ai/flows/theme-wallpaper.ts
'use server';
/**
 * @fileOverview Generates a wallpaper based on a selected theme using AI.
 *
 * - generateWallpaperFromTheme - A function that generates a wallpaper based on a theme.
 * - GenerateWallpaperFromThemeInput - The input type for the generateWallpaperFromTheme function.
 * - GenerateWallpaperFromThemeOutput - The return type for the generateWallpaperFromTheme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav'

const ThemeOptions = ["nature", "abstract", "minimal"]

const GenerateWallpaperFromThemeInputSchema = z.object({
  theme: z.enum(ThemeOptions).describe('The theme for the wallpaper.'),
});
export type GenerateWallpaperFromThemeInput = z.infer<typeof GenerateWallpaperFromThemeInputSchema>;

const GenerateWallpaperFromThemeOutputSchema = z.object({
  wallpaperDataUri: z
    .string()
    .describe(
      'The generated wallpaper as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type GenerateWallpaperFromThemeOutput = z.infer<typeof GenerateWallpaperFromThemeOutputSchema>;

export async function generateWallpaperFromTheme(input: GenerateWallpaperFromThemeInput): Promise<GenerateWallpaperFromThemeOutput> {
  return generateWallpaperFromThemeFlow(input);
}

const generateWallpaperPrompt = ai.definePrompt({
  name: 'generateWallpaperPrompt',
  input: {schema: GenerateWallpaperFromThemeInputSchema},
  output: {schema: GenerateWallpaperFromThemeOutputSchema},
  prompt: `Generate a high-resolution wallpaper for an iPhone with the following theme: {{{theme}}}.`, 
});

const generateWallpaperFromThemeFlow = ai.defineFlow(
  {
    name: 'generateWallpaperFromThemeFlow',
    inputSchema: GenerateWallpaperFromThemeInputSchema,
    outputSchema: GenerateWallpaperFromThemeOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a high-resolution wallpaper for an iPhone with the following theme: ${input.theme}.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('No media returned from image generation.');
    }
    
    return { wallpaperDataUri: media.url };
  }
);
