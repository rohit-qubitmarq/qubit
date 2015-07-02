-module(catalog, [Id, RolesId, Name::string()]).
-compile(export_all).

-has({catalog_roles, many}).
-has({roles, many}).
