import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import type { BookIdGenerator } from '../application/reading-list.service';

@Injectable()
export class RandomBookIdGenerator implements BookIdGenerator {
  public next(): string {
    return randomUUID();
  }
}
