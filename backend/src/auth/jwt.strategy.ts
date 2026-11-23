import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'wardwatch-secret-key',
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
    name: string;
    role: 'citizen' | 'ward_admin' | 'municipal_admin';
    municipality?: string;
    wardNo?: number | null;
  }) {
    return {
      sub: payload.sub,
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      municipality: payload.municipality,
      wardNo: payload.wardNo,
    };
  }
}