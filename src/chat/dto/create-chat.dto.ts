import { z } from 'zod';

export const createChatSchema = z.object({
  members: z
    .array(z.string())
    .length(2)
    .refine((items) => new Set(items).size === items.length, {
      message: 'Must be an array of unique strings',
    }),
});

export type CreateChatDto = z.infer<typeof createChatSchema>;
