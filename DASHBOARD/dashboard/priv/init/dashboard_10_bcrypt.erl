-module(booksplaza_10_bcrypt).

-export([init/0, stop/0]).

%% Starts bcrypt -- required for user authentication.
init() ->
    bcrypt:start().

stop() ->
    bcrypt:stop().
