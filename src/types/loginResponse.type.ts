export interface LoginResponse {
	access_token: string;
	refresh_token: string;
	user: IUser;
}

export interface IUser {
	id: string;
	aud: string;
	role: string;
	email: string;
	email_confirmed_at: string;
	phone: string;
	confirmed_at: string;
	last_sign_in_at: string;
	user_metadata: {
		department: string;
		email: string;
		email_verified: true;
		name: string;
		phone_verified: false;
		sub: string;
	};
}
