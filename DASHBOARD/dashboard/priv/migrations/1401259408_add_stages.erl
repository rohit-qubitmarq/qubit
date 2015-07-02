%% Migration: add_stages

{add_stages,
	fun(up) ->
		Stages = [
			{"catalog-53858551a5fd7f12f600001a", "Workforce Planning" },
			{"catalog-53858551a5fd7f12f600001a", "Recruiting" },
			{"catalog-53858551a5fd7f12f600001a", "Training & Development" },
			{"catalog-53858551a5fd7f12f600001a", "Performance Management" },
			{"catalog-53858551a5fd7f12f600001a", "Employee Relation" },
			{"catalog-53858551a5fd7f12f600001a", "Succession Planning" },
			{"catalog-53858551a5fd7f12f600001a", "Attrition" }
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