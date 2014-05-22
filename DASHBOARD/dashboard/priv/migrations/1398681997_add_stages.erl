%% Migration: add_stages

{add_stages,
	fun(up) ->
		Stages = [
			{"catalog-537b45f12d235a0444000005", "Workforce Planning" },
			{"catalog-537b45f12d235a0444000005", "Recruiting" },
			{"catalog-537b45f12d235a0444000005", "Training & Development" },
			{"catalog-537b45f12d235a0444000005", "Performance Management" },
			{"catalog-537b45f12d235a0444000005", "Employee Relation" },
			{"catalog-537b45f12d235a0444000005", "Succession Planning" },
			{"catalog-537b45f12d235a0444000005", "Attrition" }
		],
		lists:foreach(
			fun({ CatalogId, Name}) ->
				AddStages = stages:new(id, CatalogId, Name), 
				AddStages:save() 
			end,
			Stages
		);
		
	(down) -> undefined
end}.
