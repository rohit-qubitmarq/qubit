-module(roles, [Id, Name::string()]).
-compile(export_all).

-has({roles_stages, many}).

% stages() ->
% 	StageIds = lists:map(fun(RoleStage) -> RoleStage:stages_id() end, roles_stages()),
% 	boss_db:find(stages, [{id, in, StageIds}]),
% 	io:format("stages id from model stages ~p~n", [StageIds]).