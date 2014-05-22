%% Migration: add_tree

{add_tree,
  fun(up) ->
		Trees =[
			% ["1","Sales", "3"],
			% ["2", "OFG", "3"],
			% ["3","Operational", "8"],
			% ["4", "IT", "3"],
			% ["5","HR", "3"],
			% ["6", "Accounts", "7"],
			% ["7", "Executive", "8"],
			% ["8", "Dashboard", ""],
			% ["9","Services", "7"],
			% ["10", "Research", "7"],
			% ["11", "Workforce Planning", "4"],
			% ["12", "Training & Development", "4"],
			% ["13", "Temparature" ,"8"],
			% ["14", "High & Low Temparature","8"]
			["Sales", "Operational"],
			["OFG", "Operational"],
			["Operational", "Dashboard"],
			["IT", "Executive"],
			["HR", "Executive"],
			["Accounts", "Executive"],
			["Executive", "Dashboard"],
			["Dashboard", ""],
			["Services", "Operational"],
			["Research", "Executive"]
			% ["Annual Temperature", "Dashboard"],
			% ["Max vs Min Temperature", "Dashboard"]
		],
		lists:foreach(
			fun([Manualid, Parent]) ->
				NewTree = tree:new(id, Manualid, Parent),
				NewTree:save() 
			end,
			Trees
		);
     (down) -> undefined
  end}.

