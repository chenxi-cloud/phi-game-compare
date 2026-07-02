import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const reviews = defineCollection({
  loader: glob({ pattern: '*.md', base: './docs/logtail_article' }),
  schema: z.object({
    title: z.string(),
    brand: z.string(),
    seo_description: z.string(),
  }),
});

export const collections = { reviews };
