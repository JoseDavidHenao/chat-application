import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { FeedPost } from '../models/post.interface';
import { FeedService } from '../services/feed.service';
export declare class FeedController {
    private feedService;
    constructor(feedService: FeedService);
    create(feedPost: FeedPost, req: any): Observable<FeedPost>;
    findSelected(take?: number, skip?: number): Observable<FeedPost[]>;
    update(id: number, feedPost: FeedPost): Observable<UpdateResult>;
    delete(id: number): Observable<DeleteResult>;
    findImageByName(fileName: string, res: any): any;
}
