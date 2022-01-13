import { User } from '../src/auth/models/user.class';

import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';

import { HttpStatus } from '@nestjs/common';
import { response } from 'express';

describe('AuthController (e2e)', () => {
  const authUrl = `http://localhost:3000/api/auth`;

  const mockUser: User = {
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email@homtail.com',
    password: 'password',
  };

  describe('/auth/register (POST)', () => {
    it('it should register a user and return the new user object', () => {
      return request(authUrl)
        .post('/register')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect((response: request.Response) => {
          const { id, firstName, lastName, password, email, imagePath, role } =
            response.body;

          expect(typeof id).toBe('number'),
            expect(firstName).toEqual(mockUser.firstName),
            expect(lastName).toEqual(mockUser.lastName),
            expect(email).toEqual(mockUser.email),
            expect(password).toBeUndefined();
          expect(imagePath).toBeNull();
          expect(role).toEqual('user');
        })
        .expect(HttpStatus.CREATED);
    });

    it('it should not register a new user if the passed email already exists', () => {
      return request(authUrl)
        .post('/register')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  it('it should not log in not return a JWT for an unregistered user', () => {
    return request(authUrl)
      .post('/login')
      .set('Accept', 'application/json')
      .send({ email: 'doesnot@exist.com', password: 'password' })
      .expect((response: request.Response) => {
        const { token }: { token: string } = response.body;

        expect(token).toBeUndefined();
      })
      .expect(HttpStatus.FORBIDDEN);
  });
    
  it('it shouLd not log and return a JWT for a registered user', () => {
    return request(authUrl)
      .post('/login')
      .set('Accept', 'application/json')
      .send(mockUser)
      .expect((response: request.Response) => {
        const { token }: { token: string } = response.body;

        expect(jwt.verify(token, 'Andalucia345')).toBeTruthy();
      })
      .expect(HttpStatus.OK);
  });
 
});
