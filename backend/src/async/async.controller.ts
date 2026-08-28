import { Controller, Get, Query, Sse } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { interval, map, type Observable } from 'rxjs';

const SEARCH_CORPUS = [
  'Aurora Headphones',
  'Aurora Speaker',
  'Trailhead Backpack',
  'Trailhead Tent',
  'Loom Knit Sweater',
  'Loom Wool Scarf',
  'Harbor Desk Lamp',
  'Harbor Floor Lamp',
  'Meadow Yoga Mat',
  'Meadow Water Bottle',
  'Pixel Drone',
  'Pixel Action Camera',
];

class SearchQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(10_000)
  delayMs?: number;
}

class FeedQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cursor?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(10_000)
  delayMs?: number;
}

class DelayQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(30_000)
  ms?: number;
}

const TOTAL_FEED_ITEMS = 120;

@Controller('async')
export class AsyncController {
  @Get('search')
  async search(@Query() query: SearchQueryDto) {
    await this.wait(query.delayMs ?? 400);

    const term = (query.q ?? '').trim().toLowerCase();
    const results = term
      ? SEARCH_CORPUS.filter((item) => item.toLowerCase().includes(term))
      : [];

    return { query: term, count: results.length, results };
  }

  @Get('feed')
  async feed(@Query() query: FeedQueryDto) {
    await this.wait(query.delayMs ?? 300);

    const cursor = query.cursor ?? 0;
    const limit = query.limit ?? 20;
    const items = Array.from(
      { length: Math.max(0, Math.min(limit, TOTAL_FEED_ITEMS - cursor)) },
      (_, index) => {
        const id = cursor + index + 1;
        return {
          id,
          title: `Feed item ${id}`,
          body: `Deterministic content for item ${id}.`,
        };
      },
    );

    const nextCursor = cursor + items.length;

    return {
      items,
      nextCursor: nextCursor < TOTAL_FEED_ITEMS ? nextCursor : null,
      total: TOTAL_FEED_ITEMS,
    };
  }

  @Get('slow')
  async slow(@Query() query: DelayQueryDto) {
    const ms = query.ms ?? 3000;
    await this.wait(ms);
    return { message: `Responded after ${ms}ms`, delayedMs: ms };
  }

  @Sse('ticker')
  ticker(): Observable<{ data: { tick: number; timestamp: string } }> {
    return interval(1000).pipe(
      map((tick) => ({
        data: { tick: tick + 1, timestamp: new Date().toISOString() },
      })),
    );
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
