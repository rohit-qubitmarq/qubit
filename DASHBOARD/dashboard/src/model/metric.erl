-module(metric, [Id, StagesId, Name::string()]).
-compile(export_all).

-has({stages_metric, many}).
-has({stages, many}).