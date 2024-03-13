import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    // jadi hanya request body yang di validasi
    if (metadata.type === 'body') {
      return this.schema.parse(value);
    }
    return value;

    // Berdasarkan dokumentasi nest
    // try {
    //   const parsedValue = this.schema.parse(value);
    //   return parsedValue;
    // } catch (error) {
    //   throw new BadRequestException('Validation failed');
    // }
  }
}
