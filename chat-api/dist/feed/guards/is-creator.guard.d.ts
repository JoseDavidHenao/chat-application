import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../../auth/services/user.service';
import { FeedService } from '../services/feed.service';
export declare class IsCreatorGuard implements CanActivate {
    private userService;
    private feedService;
    constructor(userService: UserService, feedService: FeedService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
