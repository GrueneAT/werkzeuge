import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const werkzeuge = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/werkzeuge' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    url: z.string().url(),
    source: z.string().url().nullable().optional(),
    own_tool: z.boolean(),
    status: z.enum(['live', 'beta', 'unreleased', 'unmaintained']),
    maintained_by: z.string(),
    hosted_by: z.string(),
    license: z.string(),
    language: z.string(),
    categories: z.array(z.string()),
    audience: z.array(z.string()),
    tags: z.array(z.string()),
    related: z.array(z.string()).default([]),
    last_verified: z.date(),
  }),
});

export const collections = { werkzeuge };
