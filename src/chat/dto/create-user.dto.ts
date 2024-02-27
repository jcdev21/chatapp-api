import { z } from 'zod';

export const createChatSchema = z.object({
  name: z.string().array(),
});

export type CreateChatDto = z.infer<typeof createChatSchema>;
