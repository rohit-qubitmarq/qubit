-module(stages, [Id, CatalogId, Name::string()]).
-compile(export_all).

-has({roles_stages, many}).
-has({stages_metric, many}).

-has({catalog, many}).