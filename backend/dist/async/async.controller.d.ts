import { type Observable } from 'rxjs';
declare class SearchQueryDto {
    q?: string;
    delayMs?: number;
}
declare class FeedQueryDto {
    cursor?: number;
    limit?: number;
    delayMs?: number;
}
declare class DelayQueryDto {
    ms?: number;
}
export declare class AsyncController {
    search(query: SearchQueryDto): Promise<{
        query: string;
        count: number;
        results: string[];
    }>;
    feed(query: FeedQueryDto): Promise<{
        items: {
            id: number;
            title: string;
            body: string;
        }[];
        nextCursor: number | null;
        total: number;
    }>;
    slow(query: DelayQueryDto): Promise<{
        message: string;
        delayedMs: number;
    }>;
    ticker(): Observable<{
        data: {
            tick: number;
            timestamp: string;
        };
    }>;
    private wait;
}
export {};
