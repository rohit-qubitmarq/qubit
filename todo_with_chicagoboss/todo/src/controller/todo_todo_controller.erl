-module(todo_todo_controller, [Req]).
-compile(export_all).

%% return json to todo list app
todo_json('GET', []) ->
	Todolist = boss_db:find(todo,[], [{order_by, created}, descending ]),
	{json, Todolist}.

% add task
todo_add('GET',[]) ->
	{ok, []};
todo_add('POST', []) ->
 	Posted_task = boss_record:new(todo, [{ text, Req:post_param("todotxt")},
										{ complete, false},
										{created, list_to_integer(string:strip(os:cmd("date +%s"), both, $\n))} %string:strip(A,both,$\n)
								]),
	{ok, Task} = Posted_task:save(),
	{json, [{task, Task}]}.

% delete task
todo_delete('GET', []) ->
	{ok, []};
todo_delete('POST', [])	->
io:format("deleted task ID ~p~n",[Req:post_param("id")]),
	boss_db:delete(Req:post_param("id")),
	{output, "[]"}.

% edit task status
todo_editcheck('GET', []) ->
	{ok, []};
todo_editcheck('POST', []) ->
	Check = boss_db:find(Req:post_param("id")),
	Edit_check = Check:set([{complete, list_to_atom(Req:post_param("complete"))}]),
	Edit_check:save(),
	{output, "[]"}.

%  edit text for task-list
todo_edittext('GET', []) ->
	{ok, []};
todo_edittext('POST', []) ->
	Text = boss_db:find(Req:post_param("id")),
	Edit_text = Text:set([{text, Req:post_param("todotxt")}]),
	Edit_text:save(),
	{output, "[]"}.