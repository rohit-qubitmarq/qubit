-module(dashboard_metricdashboard_controller, [Req]).
-compile(export_all).

% retrieve data for graph plotting
rdks_data('GET', []) ->
	Rdks = boss_db:find(rdks, [], [{order_by, date}]),
	{ json, [ { rdks, Rdks } ] }.

get_tree('GET', [])	->
	Tree = boss_db:find(tree, []),
	{ json, [ { tree, Tree } ] }.

%retreive catalog
get_catalog('GET', []) ->
	Catalogs = boss_db:find(catalog, [], [{order_by, name}]),
	{json, [ { catalogs, Catalogs } ] }.

%retreive roles
get_roles('GET', []) ->
	Roles = boss_db:find(roles, [], [{order_by, name}]),
	{json, [ { roles, Roles } ] }.

%retreive stages
get_stages('GET', []) ->
	Stages = boss_db:find(stages, [], [{order_by, name}]),
	{json, [ { stages, Stages } ] }.

%retrieve metrics
get_metrics('GET', []) ->
	Metrics = boss_db:find(metric, [], [{order_by, name}]),
	{json, [ { metrics, Metrics } ] }.

% get current slected role name
role_name('GET', []) ->
	{output, []};
role_name('POST', []) ->
	RoleName = boss_db:find(roles, [{id, 'equals', Req:post_param("id") }]),
	{json, [ { rolename, RoleName } ] }.

%get current selected stage name
stage_name('GET', []) ->
	{output, []};
stage_name('POST', []) ->
	% io:format("id for role is: ~p~n",[Req:post_param("id")]),
	StageName = boss_db:find(stages, [{id, 'equals', Req:post_param("id") }]),
	{json, [ { stagename, StageName} ] }.

% to retrieved roles for corresponding catalog
catalog_roles('GET', []) ->
	{output, []};
catalog_roles('POST', []) ->
	SelectedCatalog = boss_db:find(catalog_roles, [{catalog_id, 'equals', Req:post_param("id") }]),
	io:format("iddssssssssssssssssssssssssssssss ~p~n",[ Req:post_param("id")]),
	{json, [{ rolesid, SelectedCatalog }]}.

% to retrieve role name for corresponding rolesid
catalog_names('GET', []) ->
	{output, []};
catalog_names('POST', []) ->
	Catalogname = boss_db:find(catalog, [{id, 'equals', Req:post_param("id")}]),
	{json, [ { catalogname, Catalogname} ] }.

roles_names('GET', []) ->
	{output, []};
roles_names('POST', []) ->
	RoleNames = boss_db:find(roles, [{id, 'equals', Req:post_param("id") }]),
	{json, [ { rolenames, RoleNames } ] }.

% to retrieved stages for corresponding roles
role_stages('GET', []) ->
	{output, []};
role_stages('POST', []) ->
	SelectedRole = boss_db:find(roles_stages, [{roles_id, 'equals', Req:post_param("id") }]),
	{json, [ { stagesid, SelectedRole }]}.

% to retrieve stages name for corresponding stagesid
stages_names('GET', []) ->
	{output, []};
stages_names('POST', []) ->
	Stagesnames = boss_db:find(stages, [{id, 'equals', Req:post_param("id")}]),
	{json, [ { stagesnames, Stagesnames} ] }.

% to retrieve metrics for corresponding stage
stage_metrics('GET', []) ->
	{output, []};
stage_metrics('POST', []) ->
	SelectedStage = boss_db:find(stages_metric, [{stages_id, 'equals', Req:post_param("id") }]),
	{json, [ { metricid, SelectedStage }]}.

%to retrieve metrics name for corresponding metricsid

metrics_names('GET', []) ->
	{output, []};
metrics_names('POST', []) ->
	io:format("id for stages ~p~n",[Req:post_param("id")]),
	Metricnames = boss_db:find(metric, [{id, 'equals', Req:post_param("id")}]),
	{json, [ { metricnames, Metricnames} ] }.

% registering a new user
register_person('GET', []) ->
	{output, []};
register_person('POST',[]) ->
	{ok, Salt} = bcrypt:gen_salt(),
	{ok, Password} = bcrypt:hashpw(Req:post_param("password"), Salt),
	UserName = Req:post_param("username"),
	io:format("username is ~p~n", [UserName]),
	NewPerson = boss_record:new(users, [
			{user_name, UserName}, 
			{password, Password}, 
			{first_name, Req:post_param("firstname")},
			{last_name, Req:post_param("lastname")},
			{email, Req:post_param("email")}
		]),
	{ok, SavedPerson} = NewPerson:save(),
	{json, SavedPerson}.

% _------------------------------uploads files action----------------------------------
store_rdks('GET', []) ->
	{output, []};
store_rdks('POST',[]) ->
% io:format("dates = ~p~n",[Req:post_param("date")]),
% io:format("coords = = ~p~n",[Req:post_param("coords")]),
% io:format("higdtemp = = = ~p~n",[Req:post_param("hightemp")]),
% io:format("lowtemp = = = = ~p~n",[Req:post_param("lowtemp")]).
	Storerdks = boss_record:new(rdks, [
					{date ,Req:post_param("date")},
					{coords ,Req:post_param("coords")},
					{hightemp, Req:post_param("hightemp")},
					{lowtemp, Req:post_param("lowtemp")}
				]),
	{ok, Storedrdks} = Storerdks:save(),
	{json, [{storedrdks,Storerdks}]}.



uploads('GET', []) ->
	{output, []};
uploads('POST', []) ->
io:format("HI, I'm called in uploads action ~p~n",[Req:post_files()]),
	[{UploadedFile, FileName, Location, Length, _}] = Req:post_files(),
	case Req:post_files() of 
		[{UploadedFile, FileName, Location, Length, _}] ->
			Extension = filename:extension(FileName),
			Path  = "../dashboard/priv/static/dashboard/Uploadedfiles",
			{ok, Raw} = file:read_file(Location),
			% {struct, Body} = mochijson2:decode(Req:request_body()),
			% Key = binary_to_list(proplists:get_value(<<"key">>, Body, <<"">>)),
			% Coordinates = proplists:get_value(<<"coords">>, Body, <<"">>),
			% Coords = boss_record:new(rdks, [{coords, Raw}]),
			% {ok, SavedCoords} = Coords:save(),
			% {json, [{savedcoords, SavedCoords}]},
			io:format("---uploaded files data or coordinates---~n~p~n", [Raw]),
			% io:format("---decoded coordinates--->>>>>~n~p~n", [Coordinates]),
			FileNameAndLocation = Path ++ "/" ++ FileName,
			file:write_file(FileNameAndLocation, Raw),
			NewPath = FileNameAndLocation,
			{json, [{path, NewPath}]};
			% io:format("path ~p~n",[NewPath]);
		_undefined ->
			io:format("------------error------------------")
	end,
	{output, "{}"}.


find_catalogs('GET', []) ->
	{output, []};
find_catalogs('POST', []) ->
	Role_catalogs = boss_db:find(catalog, [{roles_id, 'equals', Req:post_param("id") }]),
	{json, [{catalogs, Role_catalogs}]}.

find_stages('GET', []) ->
	{output, []};
find_stages('POST', []) ->
	Catalog_stages = boss_db:find(stages, [{catalog_id, 'equals', Req:post_param("id") }]),
	{json, [{stages, Catalog_stages}]}.

find_metrics('GET', []) ->
	{output, []};
find_metrics('POST', []) ->
	io:format("posted id ~p~n",[ Req:post_param("id")]),
	Stage_metrics = boss_db:find(metric, [{stages_id, 'equals', Req:post_param("id") }]),
	io:format("return values for corresponding id ==>> ~p~n",[Stage_metrics]),
	{json, [{metrics, Stage_metrics}]}.



