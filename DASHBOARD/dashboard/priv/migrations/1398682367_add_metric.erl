%% Migration: add_metric

{add_metric,
	fun(up) ->
		Metrics = [
			{"stages-537b46ec2d235a044400000c", "Percentage of employees by gender" },
			{"stages-537b46ec2d235a044400000c", "Percentage of employees by diversity categories" },
			{"stages-537b46ec2d235a044400000c", "Percentage with reported disabilities" },
			{"stages-537b46ec2d235a044400000c", "Percentage with veteran status" },
			{"stages-537b46ec2d235a044400000c", "Average age" },
			{"stages-537b46ec2d235a044400000c", "Average number of months between eligibility and actual retirement" },
			{"stages-537b46ec2d235a044400000c", "Percent currently eligible for retirement"},
			{"stages-537b46ec2d235a044400000c", "Percent eligible for retirement in 5 years"},
			{"stages-537b46ec2d235a044400000c", "Workforce distribution"},
			{"stages-537b46ec2d235a044400000c", "Average number of organization layers"},
			{"stages-537b46ec2d235a044400000c", "Average GS grade level"},
			{"stages-537b46ec2d235a044400000c", "Employee to clerical ratio"},
			{"stages-537b46ec2d235a044400000c", "Employee to supervisor ratio"},
			{"stages-537b46ec2d235a044400000c", "Employee to executive ratio"},
			{"stages-537b46ec2d235a044400000c", "Budget factor"},
			{"stages-537b46ec2d235a044400000c", "Expense factor"},
			{"stages-537b46ec2d235a044400000c", "Human capital value added"},
			{"stages-537b46ec2d235a044400000c","Human capital return on investment"}
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

