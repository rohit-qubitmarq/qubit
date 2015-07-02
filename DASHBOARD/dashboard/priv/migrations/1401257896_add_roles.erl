%% Migration: add_roles
{add_roles,
	fun(up) ->
		Roles = [
			{"Operational" },
			{"Executive" }
		],
		lists:foreach(
			fun({Name}) ->
				AddRole = roles:new(id, Name), 
				AddRole:save() 
			end,
			Roles
		);
		
	(down) ->
		RoleNames = ["Operational", "Executive"],
		Roles = boss_db:find(roles, [{name, 'in', RoleNames}]),
		lists:foreach(
			fun(Role) -> 
				boss_db:delete(Role:id())
			end,
			Roles
		)
end}.
