-module(stages_metric, [Id, StagesId, MetricId]).
-compile(export_all).

-belongs_to(stages).
-belongs_to(metric).
