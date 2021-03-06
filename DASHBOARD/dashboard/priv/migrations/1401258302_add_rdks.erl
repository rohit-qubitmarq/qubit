%% Migration: add_rdks

{add_rdks,
	fun(up) -> 
		Rdks = [
			["1999","3.9","10","5"],
			["2000","4.9","12","7"],
			["2001","5.7","15","7"],
			["2002","8.5","17","9"],
			["2003","9","18","9"],
			["2004","10.3","19","10"],
			["2005","11.4","20","9"],
			["2006","12.3","21","5"],
			["2007","13.2","22","9"],
			["2008","15","22","11"],
			["2009","17","19","13"],
			["2010","18.2","20","14"],
			["2011","16.4","23","13"],
			["2012","15.3","17","9"],
			["2013","14.3","15","6"],
			["2014","10.3","14","7"],
			["2015","7.4","13","6"],
			["2016","6","16","9"],
			["2017","5","18","10"],
			["2018","2","17","11"]
		],
	lists:foreach(
		fun([Date, Coords, Hightemp, LowTemp]) ->
			NewRdks = rdks:new(id, Date, Coords, Hightemp, LowTemp),
			NewRdks:save()
		end,
		Rdks
	);
(down) -> undefined
  end}.