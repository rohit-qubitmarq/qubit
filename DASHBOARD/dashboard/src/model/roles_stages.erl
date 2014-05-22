-module(roles_stages, [Id, RolesId, StagesId]).
-compile(export_all).

-belongs_to(roles).
-belongs_to(stages).
