import { z } from 'zod';

export const createMessageSchema = z.object({
  chatId: z.string(),
  senderId: z.string(),
  message: z.string().min(1),
});

export type CreateMessageDto = z.infer<typeof createMessageSchema>;
