import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.class';
export declare class AuthService {
    private readonly userRepository;
    private jwtService;
    constructor(userRepository: Repository<UserEntity>, jwtService: JwtService);
    hashPassword(password: string): Observable<string>;
    doesUserExist(email: string): Observable<boolean>;
    registerAccount(user: User): Observable<User>;
    validateUser(email: string, password: string): Observable<User>;
    login(user: User): Observable<string>;
    getJwtUser(jwt: string): Observable<User | null>;
}
