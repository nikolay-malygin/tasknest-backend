import { UserDto } from "../../users/dto/user.dto";

export class AuthenticatedRequest extends Request {
	user: UserDto;
}
