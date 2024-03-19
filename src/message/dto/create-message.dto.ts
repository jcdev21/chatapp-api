import { z } from 'zod';

export const createMessageSchema = z.object({
  chatId: z.string().min(1),
  senderId: z.string().min(1),
  message: z.string().min(1),
});

export type CreateMessageDto = z.infer<typeof createMessageSchema>;
