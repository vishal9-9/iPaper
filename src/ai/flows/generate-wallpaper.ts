// src/ai/flows/generate-wallpaper.ts
'use server';
/**
 * @fileOverview A wallpaper generation AI agent.
 *
 * - generateWallpaper - A function that handles the wallpaper generation process.
 * - GenerateWallpaperInput - The input type for the generateWallpaper function.
 * - GenerateWallpaperOutput - The return type for the generateWallpaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateWallpaperInputSchema = z.object({
  promptText: z.string().describe('The text prompt describing the desired wallpaper.'),
});
export type GenerateWallpaperInput = z.infer<typeof GenerateWallpaperInputSchema>;

const GenerateWallpaperOutputSchema = z.object({
  wallpaperDataUri: z
    .string()
    .describe(
      'The generated wallpaper as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'      
    ),
});
export type GenerateWallpaperOutput = z.infer<typeof GenerateWallpaperOutputSchema>;

export async function generateWallpaper(input: GenerateWallpaperInput): Promise<GenerateWallpaperOutput> {
  return generateWallpaperFlow(input);
}

const generateWallpaperPrompt = ai.definePrompt({
  name: 'generateWallpaperPrompt',
  input: {schema: GenerateWallpaperInputSchema},
  output: {schema: GenerateWallpaperOutputSchema},
  prompt: `You are an AI that generates high-quality wallpapers based on user prompts.

  Generate a wallpaper based on the following description: {{{promptText}}}

  Ensure the wallpaper is high-resolution and suitable for use on iPhone screens.
  Return the wallpaper as a data URI.
  `,
});

const generateWallpaperFlow = ai.defineFlow(
  {
    name: 'generateWallpaperFlow',
    inputSchema: GenerateWallpaperInputSchema,
    outputSchema: GenerateWallpaperOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.promptText,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('No media returned from image generation.');
    }
    
    return {wallpaperDataUri: media.url!};
  }
);
