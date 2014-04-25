-module(dashboard_metricdashboard_controller, [Req]).
-compile(export_all).

get_data('GET', []) ->
	{output, []};
get_data('POST', []) ->
	io:format("here is data========== ~p~n",[Req:request_body()]).

	% {struct, Body} = mochijson2:decode(Req:request_body()),
	% Date = binary_to_list(proplists:get_value(<<"text">>, Body, <<"">>)),
	% Coords = binary_to_list(proplists:get_value(<<"correct">>, Body, <<"">>)),
	% io:format("hi ~p~n",[Date]).
	% NewData = boss_record:new(rdks, [
	% 				{date , Date},
	% 				{coords, Coords}
	% 			]),
	% {ok, SavedData} = NewData:save(),
	% {json, [{saveddata, SavedData}]}.
