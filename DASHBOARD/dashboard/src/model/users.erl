-module(users, [Id, UserName::string(), FirstName::string(), LastName::string(), Password::string(), Email::string()]).
-compile(export_all).

check_password(PasswordAttempt) ->
	case bcrypt:hashpw(PasswordAttempt, Password) of
		{ok, Password} ->
			true;
		_ ->
			false
	end.