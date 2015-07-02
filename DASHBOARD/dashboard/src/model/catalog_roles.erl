-module(catalog_roles, [Id, CatalogId, RolesId]).
-compile(export_all).

-belongs_to(catalog).
-belongs_to(roles).
