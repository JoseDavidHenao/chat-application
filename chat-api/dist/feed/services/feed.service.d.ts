import { Observable } from 'rxjs';
import { User } from '../../auth/models/user.class';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { FeedPostEntity } from '../models/post.entity';
import { FeedPost } from '../models/post.interface';
export declare class FeedService {
    private readonly feedPostRepository;
    findPosts(take: number, skip: number): Observable<FeedPost[]>;
    constructor(feedPostRepository: Repository<FeedPostEntity>);
    createPost(user: User, feedPost: FeedPost): Observable<FeedPost>;
    findAllPosts(): Observable<FeedPost[]>;
    findPost(take?: number, skip?: number): Observable<FeedPost[]>;
    updatePost(id: number, feedPost: FeedPost): Observable<UpdateResult>;
    deletePost(id: number): Observable<DeleteResult>;
    findPostById(id: number): Observable<FeedPost>;
}
