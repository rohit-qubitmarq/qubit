%% Migration: add_catalog

{add_catalog,
  fun(up) ->
		Catalog = [
			{"roles-537b44b62d235a0444000002", "Finance" },
			{"roles-537b44b62d235a0444000002", "IT" },
			{"roles-537b44b62d235a0444000002", "HR"},
			{"roles-537b44b62d235a0444000002", "Operation"},
			{"roles-537b44b62d235a0444000001", "Service"},
			{"roles-537b44b62d235a0444000001", "Sales"},
			{"roles-537b44b62d235a0444000001", "OFG"}
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