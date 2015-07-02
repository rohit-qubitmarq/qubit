%% Migration: add_catalog

{add_catalog,
  fun(up) -> undefined;
     (down) -> undefined
  end}.
%% Migration: add_catalog

{add_catalog,
  fun(up) ->
		Catalog = [
			{"roles-5385801da5fd7f12f6000002", "Finance" },
			{"roles-5385801da5fd7f12f6000002", "IT" },
			{"roles-5385801da5fd7f12f6000002", "HR"},
			{"roles-5385801da5fd7f12f6000002", "Operation"},
			{"roles-5385801da5fd7f12f6000001", "Service"},
			{"roles-5385801da5fd7f12f6000001", "Sales"},
			{"roles-5385801da5fd7f12f6000001", "OFG"}
		],
		lists:foreach(
			fun({RolesId, Name}) ->
				AddCatalog = catalog:new(id, RolesId, Name), 
				AddCatalog:save() 
			end,
			Catalog
		);

     (down) -> undefined
end}.