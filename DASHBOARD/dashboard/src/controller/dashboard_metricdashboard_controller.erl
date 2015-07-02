-module(dashboard_metricdashboard_controller, [Req]).
-compile(export_all).

% retrieve data for graph plotting
rdks_data('GET', []) ->
	Rdks = boss_db:find(rdks, [], [{order_by, date}]),
	{ json, [ { rdks, Rdks } ] }.
%retreive roles
get_roles('GET', []) ->
	Roles = boss_db:find(roles, [], [{order_by, name}]),
	{json, [ { roles, Roles } ] }.

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
	Stage_metrics = boss_db:find(metric, [{stages_id, 'equals', Req:post_param("id") }]),
	{json, [{metrics, Stage_metrics}]}.


% ___________________________registering and login a new user____________________________

%user login
login_person('GET', []) ->
	{output, []};
login_person('POST', []) ->
	UserName = string:to_lower(Req:post_param("username")),
	case boss_db:find(users, [{user_name, 'equals', UserName}]) of
		[Person] ->
			Password = Req:post_param("password"),
			io:format("password is : ~p~n", [Password]),
				case Person:check_password(Password) of
					true ->
						{json, [{person, Person}]};
					false ->
						io:format("PASSWORD DO NOT MATCHED")
				end;
		_error ->
			io:format("PASSWORD DO NOT MATCHED")
	end.

%regitering user
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
	Store_rdks = boss_record:new(rdks, [
					{date ,Req:post_param("date")},
					{coords ,Req:post_param("coords")},
					{hightemp, Req:post_param("hightemp")},
					{lowtemp, Req:post_param("lowtemp")}
				]),
	{ok, Savedrdks} = Store_rdks:save(),
	{json, [{storedrdks,Savedrdks}]}.

% Metric HR uploads
store_operational_sla('GET', []) ->
	{output, []};
store_operational_sla('POST', [] ) ->
	Store_operational_sla = boss_record:new(operational_sla, [
								{sla_level, list_to_integer(Req:post_param("sla_level"))},
								{week, list_to_integer(Req:post_param("week"))},
								{current_year, list_to_integer(Req:post_param("current_year"))},
								{last_year, list_to_integer(Req:post_param("last_year"))},
								{sla_low_range, list_to_integer(Req:post_param("sla_low_range"))},
								{sla_high_range, list_to_integer(Req:post_param("sla_high_range"))}
		]),
	{ok, Saved_operational_sla} = Store_operational_sla:save(),
	{json, [{operational_hr_metric,Saved_operational_sla}]}.

operational_sla1('GET', []) ->
	Sla1 = boss_db:find(operational_sla, [{sla_level, 'equals' , list_to_integer("1")}], [{ order_by, week}]),
	% io:format("SLA1! ~p~n", [Sla1]),
	{ json, [ { sla1, Sla1 } ] }.


operational_sla2('GET', []) ->
	Sla2 = boss_db:find(operational_sla, [{sla_level, 'equals' , list_to_integer("2")}], [{ order_by, week}]),
	% io:format("SLA1! ~p~n", [Sla2]),
	{ json, [ { sla2, Sla2 } ] }.


operational_sla3('GET', []) ->
	Sla3 = boss_db:find(operational_sla, [{sla_level, 'equals' , list_to_integer("3")}], [{ order_by, week}]),
	% io:format("SLA1! ~p~n", [Sla3]),
	{ json, [ { sla3, Sla3 } ] }.


% DEMO FOR EXTRA column Drilldown
store_col_drilldown('GET', []) ->
	{output, []};
store_col_drilldown('POST', []) ->
	Store_col_drilldown = boss_record:new(col_drilldown, [
								{ team, (Req:post_param("team"))},
								{ histroical_incoming, list_to_integer(Req:post_param("histroical_incoming")) },
								{ remained_open, list_to_integer(Req:post_param("remained_open")) },
								{ incoming, list_to_integer(Req:post_param("incoming")) },
								{ outgoing, list_to_integer(Req:post_param("outgoing")) }
		]),
	{ok, Saved_col_drilldown} = Store_col_drilldown:save(),
	{json, [{col_drilldown, Saved_col_drilldown}]}.
get_col_drilldown('GET', []) ->
	Col_drilldown = boss_db:find(col_drilldown, [], [{ order_by, team}]),
	{ json, [ { col_drilldown, Col_drilldown } ] }.

% 52 Tracker Requests By PayPeriod
store_tracker_request('GET', []) ->
	{output, []};
store_tracker_request('POST', []) ->
	Store_tracker_request = boss_record:new(tracker_request_by_period, [
								{ pay_period, (Req:post_param("pay_period"))},
								{ histroical_incoming, list_to_integer(Req:post_param("histroical_incoming")) },
								{ remained_open, list_to_integer(Req:post_param("remained_open")) },
								{ incoming, list_to_integer(Req:post_param("incoming")) },
								{ outgoing, list_to_integer(Req:post_param("outgoing")) }
		]),
	{ok, Saved_tracker_request} = Store_tracker_request:save(),
	{json, [{tracker_request, Saved_tracker_request}]}.

get_tracker_request('GET', []) ->
	Tracker_request = boss_db:find(tracker_request_by_period, [], [{ order_by, pay_period}]),
	{ json, [ { tracker_request, Tracker_request } ] }.

store_aging_example('GET', []) ->
	{output, []};
store_aging_example('POST', []) ->
	Store_aging_example = boss_record:new(aging_example, [
								{ group, (Req:post_param("group"))},
								{ type_of_action, (Req:post_param("type_of_action"))},
								{ values, list_to_integer(Req:post_param("values"))}
		]),
	{ok, Saved_aging_example} = Store_aging_example:save(),
	{json, [{aging_example, Saved_aging_example}]}.

get_aging_example('GET', []) ->
	Aging_example = boss_db:find(aging_example, [], [{ order_by, group}]),
	{ json, [ { aging_example, Aging_example } ] }.

store_crm_case_aging('GET', []) ->
	{output, []};
store_crm_case_aging('POST', []) ->
	Store_crm_case_aging = boss_record:new(crm_case_aging, [
								{ group, (Req:post_param("group"))},
								{ provider_group, (Req:post_param("provider_group"))},
								{ values, list_to_integer(Req:post_param("values"))}
		]),
	{ok, Saved_crm_case_aging} = Store_crm_case_aging:save(),
	{json, [{crm_case_aging, Saved_crm_case_aging}]}.

get_crm_case_aging('GET', []) ->
	Crm_case_aging = boss_db:find(crm_case_aging, [], [{ order_by, group}]),
	{ json, [ { crm_case_aging, Crm_case_aging } ] }.

store_sinq_error_rates('GET', []) ->
	{output, []};
store_sinq_error_rates('POST', []) ->
	Store_sinq_error_rates = boss_record:new(sinq_error_rates, [
								{ group_processor, (Req:post_param("group_processor"))},
								{ number_of_sinq_errors, list_to_integer(Req:post_param("number_of_sinq_errors"))},
								{ min_fail_count, list_to_integer(Req:post_param("min_fail_count"))},
								{ avg_fail_count, list_to_integer(Req:post_param("avg_fail_count"))},
								{ max_fail_count, list_to_integer(Req:post_param("max_fail_count"))}
		]),
	{ok, Saved_sinq_error_rates} = Store_sinq_error_rates:save(),
	{json, [{sinq_error_rates, Saved_sinq_error_rates}]}.

get_sinq_error_rates('GET', []) ->
	Sinq_error_rates = boss_db:find(sinq_error_rates, [], [{ order_by, group_processor}]),
	{ json, [ { sinq_error_rates, Sinq_error_rates } ] }.


% FNCS Maters Recruit List Uploading

store_fncs_recruit_list('POST', []) ->
	Store_fncs_recruit_list = boss_record:new(fncs_master_recruit_list, [
								{current_status_milestone, (Req:post_param("current_status_milestone"))},
								{organization, (Req:post_param("organization"))},
								{point_of_contact, (Req:post_param("point_of_contact"))},
								{position_title, (Req:post_param("position_title"))},
								{sec_priority, (Req:post_param("sec_priority"))},
								{sf52_number, (Req:post_param("sf52_number"))},
								{number_of_records, list_to_integer(Req:post_param("number_of_records"))}
								% { hiring_trackingid, (Req:post_param("hiring_tracking_id"))},
								% { hr_speclst_assigned_to, (Req:post_param("hr_speclst_assigned_to"))},
								% { sec_priority, (Req:post_param("sec_priority"))},
								% { organization, (Req:post_param("organization"))},
								% { organizational_location, (Req:post_param("organizational_location"))},
								% { position_title, (Req:post_param("position_title"))},
								% { pd_mr, (Req:post_param("pd_mr"))},
								% { point_of_contact, (Req:post_param("point_of_contact"))},
								% { grade, (Req:post_param("grade"))},
								% { status, (Req:post_param("status"))},
								% { current_status_milestone, (Req:post_param("current_status_milestone"))},
								% { etc, (Req:post_param("etc"))},
								% { etc_to915, (Req:post_param("etc_to915"))},
								% { date_given_to_selecting_official, (Req:post_param("date_given_to_selecting_official"))},
								% { cert_extended, (Req:post_param("cert_extended"))},
								% { aoc, (Req:post_param("aoc"))},
								% { sf52_number, (Req:post_param("sf52_number"))},
								% { selectee_name, (Req:post_param("selectee_name"))}
		]),
	{ok, Saved_fncs_recruit_list_Data} = Store_fncs_recruit_list:save(),
	{json, [{fncs_master_recruit_list, Saved_fncs_recruit_list_Data}]}.

get_fncs_recruit_list('GET', []) ->
	Fncs_recruit_list = boss_db:find(fncs_master_recruit_list, [], [{ order_by, id}]),
	% io:format("HI, Fncs_recruit_list==== ~p~n",[Fncs_recruit_list]),
	{ json, [ { fncs_recruit_list, Fncs_recruit_list } ] }.


% Hiring Manager Uploading

store_hiring_manager('POST', []) ->
	Store_hiring_manager = boss_record:new(hiring_manager,[
							{current_status_milestone, (Req:post_param("current_status_milestone"))},
							{organization, (Req:post_param("organization"))},
							{point_of_contact, (Req:post_param("point_of_contact"))},
							{position_title, (Req:post_param("position_title"))},
							{sf52_number, (Req:post_param("sf52_number"))},
							{number_of_records, list_to_integer(Req:post_param("number_of_records"))}
		]),
	{ok, Saved_hiring_manager_Data} = Store_hiring_manager:save(),
	{json, [{ hiring_manager, Saved_hiring_manager_Data}]}.

get_hiring_manager('GET',[]) ->
	Hiring_manager = boss_db:find(hiring_manager, [{current_status_milestone, 'in', ["09. Selecting Official Review App-Interviews"]}], [{order_by, organization}]),
	{json, [ { hiring_manager, Hiring_manager } ] }.

get_hirinmanager_count('POST',[])->
	HiringCount = boss_db:count(hiring_manager, [{current_status_milestone, 'in', ["09. Selecting Official Review App-Interviews"]},{organization, 'equals', Req:post_param("organization")}]),
	{json, [{hiringCount, HiringCount}]}.

get_click_hiring_Data('POST',[])->
	io:format("POSTED SELCTED CLICK===========>>>>>>>>> ~p~n", [(Req:post_params())]),
	SelectedHiring = boss_db:find(hiring_manager, [{current_status_milestone, 'in', ["09. Selecting Official Review App-Interviews"]}, {organization, 'equals', Req:post_param("organization")}]),
	{json, [{selectedHiring, SelectedHiring}]}.
% Tentative Offers By Organization Uploading

store_tentative('POST', []) ->
	Store_tentative = boss_record:new(tentative_organization,[
							{current_status_milestone, (Req:post_param("current_status_milestone"))},
							{organization, (Req:post_param("organization"))},
							{point_of_contact, (Req:post_param("point_of_contact"))},
							{position_title, (Req:post_param("position_title"))},
							{sf52_number, (Req:post_param("sf52_number"))},
							{number_of_records, list_to_integer(Req:post_param("number_of_records"))}
		]),
	{ok, Saved_tentative_Data} = Store_tentative:save(),
	{json, [{ hiring_manager, Saved_tentative_Data}]}.

get_tentative('GET',[]) ->
	io:format("COUNT= ~p~n",[(Req:post_params())]),
	Tentative_organization = boss_db:find(tentative_organization, [], [{order_by, organization}]),
	{json, [ { tentative, Tentative_organization } ] }.


get_totalValue('POST', []) ->
	% io:format("COUNT= ~p~n",[(Req:post_params())]),
	Count = boss_db:count(tentative_organization, [{ organization, 'equals', Req:post_param("organization")}]),
	% io:format("COUNT= ~p~n",[Count]),
	{json, [{count, Count}]}.

get_clickData('POST', []) ->
	Data = boss_db:find(tentative_organization, [{ organization, 'equals', Req:post_param("organization")}], [{order_by, point_of_contact}]),
	{json, [{ details, Data}]}.

selected_tentative('POST', []) ->
	io:format("selected Week = ~p~n",[(Req:post_param("week"))]),
	Selected_week = boss_db:find(tentative_organization, [{organization, 'equals', Req:post_param("week") }] ),
	{json, [ { selectedTentative, Selected_week}]}.




% Hiring By Organization Uploading

store_inventory_org('POST', []) ->
	Store_inventory_org = boss_record:new(inventory_organization,[
							{current_status_milestone, (Req:post_param("current_status_milestone"))},
							{organization, (Req:post_param("organization"))},
							{point_of_contact, (Req:post_param("point_of_contact"))},
							{position_title, (Req:post_param("position_title"))},
							{sf52_number, (Req:post_param("sf52_number"))},
							{number_of_records, list_to_integer(Req:post_param("number_of_records"))}
		]),
	{ok, Saved_inventory_org_Data} = Store_inventory_org:save(),
	{json, [{ inventory_org , Saved_inventory_org_Data }]}.

get_inventory_org('GET',[]) ->
	Inventory_org = boss_db:find(inventory_organization, [], [{order_by, organization}]),
	{json, [ { inventory_org, Inventory_org } ] }.

get_inventory_org_count('POST', []) ->
	Inventory_org_count = boss_db:count(inventory_organization, [{ organization, 'equals', Req:post_param("organization")}]),
	{json, [{ inventory_count, Inventory_org_count}]}.



get_click_inventoryorg_Data('POST', []) ->
	Datainventory = boss_db:find(inventory_organization, [{ organization, 'equals', Req:post_param("inventory_organization")}], [{order_by, point_of_contact}]),
	io:format("CLICK = ~p~n", [Datainventory]),
	{json, [{ inventory_org_Details, Datainventory}]}.


% Inventory By OPM 80 Day Hiring Milestone Uploading

store_inventory_opm('POST', []) ->
	Store_inventory_opm = boss_record:new(inventory_opm,[
							{current_status, (Req:post_param("current_status"))},
							{number_of_records, list_to_integer(Req:post_param("records"))}
		]),
	{ok, Saved_inventory_opm_Data} = Store_inventory_opm:save(),
	{json, [{ inventory_opm , Saved_inventory_opm_Data}]}.

get_inventory_opm('GET',[]) ->
	Inventory_opm = boss_db:find(inventory_opm, [], [{order_by, current_status}]),
	{json, [ { inventory_opm, Inventory_opm } ] }.


uploads('GET', []) ->
	{output, []};
uploads('POST', []) ->
io:format("HI, I'm called in uploads action ~p~n",[Req:post_files()]),
	[{UploadedFile, FileName, Location, Length}] = Req:post_files(),
	case Req:post_files() of 
		[{UploadedFile, FileName, Location, Length}] ->
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
			io:format("file name and location ~p~n", [FileNameAndLocation]),
			file:write_file(FileNameAndLocation, Raw),
			NewPath = FileNameAndLocation,
			{json, [{path, NewPath}]},
			io:format("path ~p~n",[NewPath]);
		_undefined ->
			io:format("------------error------------------")
	end,
	{output, "{}"}.



% get_tree('GET', [])	->
% 	Tree = boss_db:find(tree, []),
% 	{ json, [ { tree, Tree } ] }.

% %retreive catalog
% get_catalog('GET', []) ->
% 	Catalogs = boss_db:find(catalog, [], [{order_by, name}]),
% 	{json, [ { catalogs, Catalogs } ] }.

%retreive stages
% get_stages('GET', []) ->
% 	Stages = boss_db:find(stages, [], [{order_by, name}]),
% 	{json, [ { stages, Stages } ] }.

%retrieve metrics
% get_metrics('GET', []) ->
% 	Metrics = boss_db:find(metric, [], [{order_by, name}]),
% 	{json, [ { metrics, Metrics } ] }.

% get current slected role name
% role_name('GET', []) ->
% 	{output, []};
% role_name('POST', []) ->
% 	RoleName = boss_db:find(roles, [{id, 'equals', Req:post_param("id") }]),
% 	{json, [ { rolename, RoleName } ] }.

%get current selected stage name
% stage_name('GET', []) ->
% 	{output, []};
% stage_name('POST', []) ->
% 	% io:format("id for role is: ~p~n",[Req:post_param("id")]),
% 	StageName = boss_db:find(stages, [{id, 'equals', Req:post_param("id") }]),
% 	{json, [ { stagename, StageName} ] }.

% to retrieved roles for corresponding catalog
% catalog_roles('GET', []) ->
% 	{output, []};
% catalog_roles('POST', []) ->
% 	SelectedCatalog = boss_db:find(catalog_roles, [{catalog_id, 'equals', Req:post_param("id") }]),
% 	io:format("iddssssssssssssssssssssssssssssss ~p~n",[ Req:post_param("id")]),
% 	{json, [{ rolesid, SelectedCatalog }]}.

% to retrieve role name for corresponding rolesid
% catalog_names('GET', []) ->
% 	{output, []};
% catalog_names('POST', []) ->
% 	Catalogname = boss_db:find(catalog, [{id, 'equals', Req:post_param("id")}]),
% 	{json, [ { catalogname, Catalogname} ] }.

% roles_names('GET', []) ->
% 	{output, []};
% roles_names('POST', []) ->
% 	RoleNames = boss_db:find(roles, [{id, 'equals', Req:post_param("id") }]),
% 	{json, [ { rolenames, RoleNames } ] }.

% to retrieved stages for corresponding roles
% role_stages('GET', []) ->
% 	{output, []};
% role_stages('POST', []) ->
% 	SelectedRole = boss_db:find(roles_stages, [{roles_id, 'equals', Req:post_param("id") }]),
% 	{json, [ { stagesid, SelectedRole }]}.

% to retrieve stages name for corresponding stagesid
% stages_names('GET', []) ->
% 	{output, []};
% stages_names('POST', []) ->
% 	Stagesnames = boss_db:find(stages, [{id, 'equals', Req:post_param("id")}]),
% 	{json, [ { stagesnames, Stagesnames} ] }.

% to retrieve metrics for corresponding stage
% stage_metrics('GET', []) ->
% 	{output, []};
% stage_metrics('POST', []) ->
% 	SelectedStage = boss_db:find(stages_metric, [{stages_id, 'equals', Req:post_param("id") }]),
% 	{json, [ { metricid, SelectedStage }]}.

%to retrieve metrics name for corresponding metricsid

% metrics_names('GET', []) ->
% 	{output, []};
% metrics_names('POST', []) ->
% 	io:format("id for stages ~p~n",[Req:post_param("id")]),
% 	Metricnames = boss_db:find(metric, [{id, 'equals', Req:post_param("id")}]),
% 	{json, [ { metricnames, Metricnames} ] }.