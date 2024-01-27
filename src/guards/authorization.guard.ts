import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest();
		const token = req.headers.authorization;

		if (!token) {
			throw new UnauthorizedException({ message: 'Unauthorized: Missing token' });
		}

		jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
			if (err) {
				throw new UnauthorizedException({
					message: 'Session expired, sign in again to continue',
				});
			}
			req.user = decoded;
		});

		return true;
	}
}
