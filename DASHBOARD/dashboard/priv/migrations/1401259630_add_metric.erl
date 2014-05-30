%% Migration: add_metric

{add_metric,
	fun(up) ->
		Metrics = [
			{"stages-538585ffa5fd7f12f6000021", "Percentage of employees by gender" },
			{"stages-538585ffa5fd7f12f6000021", "Percentage of employees by diversity categories" },
			{"stages-538585ffa5fd7f12f6000021", "Percentage with reported disabilities" },
			{"stages-538585ffa5fd7f12f6000021", "Percentage with veteran status" },
			{"stages-538585ffa5fd7f12f6000021", "Average age" },
			{"stages-538585ffa5fd7f12f6000021", "Average number of months between eligibility and actual retirement" },
			{"stages-538585ffa5fd7f12f6000021", "Percent currently eligible for retirement"},
			{"stages-538585ffa5fd7f12f6000021", "Percent eligible for retirement in 5 years"},
			{"stages-538585ffa5fd7f12f6000021", "Workforce distribution"},
			{"stages-538585ffa5fd7f12f6000021", "Average number of organization layers"},
			{"stages-538585ffa5fd7f12f6000021", "Average GS grade level"},
			{"stages-538585ffa5fd7f12f6000021", "Employee to clerical ratio"},
			{"stages-538585ffa5fd7f12f6000021", "Employee to supervisor ratio"},
			{"stages-538585ffa5fd7f12f6000021", "Employee to executive ratio"},
			{"stages-538585ffa5fd7f12f6000021", "Budget factor"},
			{"stages-538585ffa5fd7f12f6000021", "Expense factor"},
			{"stages-538585ffa5fd7f12f6000021", "Human capital value added"},
			{"stages-538585ffa5fd7f12f6000021","Human capital return on investment"}
		],
		lists:foreach(
			fun({ StagesId, Name}) ->
				AddMetric = metric:new(id, StagesId, Name), 
				AddMetric:save() 
			end,
			Metrics
		);
		
	(down) -> undefined
end}.
