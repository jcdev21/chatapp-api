import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const parsedValue = this.schema.parse(value);
    return parsedValue;

    // Berdasarkan dokumentasi nest
    // try {
    //   const parsedValue = this.schema.parse(value);
    //   return parsedValue;
    // } catch (error) {
    //   throw new BadRequestException('Validation failed');
    // }
  }
}
