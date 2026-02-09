//GoogleStrategy handles Google OAuth authentication.
//It extracts user identity from Google and passes it to AuthService

import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(req: Request, accessToken: string, refreshToken: string, profile: any) {
    const role = req.path.includes('patient') ? 'PATIENT' : 'DOCTOR';

    return {
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      role,
    };
  }
}

