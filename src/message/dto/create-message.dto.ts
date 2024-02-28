import { z } from 'zod';

export const createMessageSchema = z.object({
  chatId: z.string(),
  senderId: z.string(),
  message: z.string(),
});

export type CreateMessageDto = z.infer<typeof createMessageSchema>;
