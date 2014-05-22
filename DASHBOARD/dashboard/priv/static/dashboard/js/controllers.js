function DashboardCtrl($scope, $http, $location, $routeParams, $route, LoginService, $resource) {

	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	$http.get('/metricdashboard/get_tree').success(function(data){
		$scope.tree = data.tree;
		$scope.jsonTree = angular.toJson($scope.tree);
		
		// var parent = $scope.tree.parent;
		// console.log($scope.tree);
		
		// $scope.getNestedChildren = function getNestedChildren(jsonTree, parent) {
		// 	var out = [];
		// 	console.log(jsonTree);
		// 	for (var i in jsonTree) {
		// 		if(jsonTree[i].parent == parent){
		// 			var children = getNestedChildren(jsonTree, jsonTree[i].manualid);
		// 			console.log(children);

		// 			if(children.length) {
		// 				jsonTree[i].children = children;
		// 			}
		// 			out.push(jsonTree[i]);
		// 		}
		// 	}
		// 	return out;
		// };
		// console.log($scope.getNestedChildren);


		$scope.myData = {};
		$scope.myData.items =  $scope.tree;

		$scope.rootFilter = function(item){
			if(item.parent == "") return true;
			return false;
		};

		$scope.manualId = function(root){
			console.log(root.manualid);
			$scope.rootchildFilter = function(item) {
				if(root.manualid == item.parent) 
					return true;
			};
			root.show = true;
		};

		$scope.childmanualId = function(rootchild, $index){
			console.log(rootchild.manualid + " and selected idex is === " + $index);
			$scope.rootchildchildFilter = function(item) {
				if(rootchild.manualid == item.parent) return true;
			};
			rootchild.show = true;
		};
		$scope.grandchildmanualId = function(rootchildchild, $index){
			console.log(rootchildchild.manualid + " and selected idex is === " + $index);

			$scope.grandchildFilter = function(item) {
				if(item.parent == rootchildchild.manualid) return true;
				if (item.parent == "") return false;
			};
			rootchildchild.show = true;
		};

		// for (var i=0; i< $scope.tree.length; i++) {
		// 	$scope.treemanualid.push($scope.tree[i].manualid);
		// 	$scope.treename.push($scope.tree[i].name);
		// 	$scope.treeparent.push($scope.tree[i].parent);
		// 	$scope.tree.manualid = $scope.tree[i].manualid;
		// 	$scope.tree.name = $scope.tree[i].name;
		// 	$scope.tree.parent = $scope.tree[i].parent;
		// 	var items = [{"id":$scope.treemanualid, "Name": $scope.treename, "Parent": $scope.treeparent}];
		// 	return items;
		// };

			// console.log($scope.tree);
			// console.log($scope.treemanualid);
			// console.log($scope.treename);
			// console.log($scope.treeparent);
	});
// retrieve Roles list
	$http.get('/metricdashboard/get_roles').success(function(data){
		$scope.roles = data.roles;
	});

	$scope.activeRoleIndex;

	$scope.selectedRoleId = function(role, index) {
		$scope.activeRoleIndex = index;
		$scope.roleid = role.id;
		console.log(role.name + index);
		var selectedroleid = "id=" + $scope.roleid;
		$http.post('/metricdashboard/find_catalogs', selectedroleid,config).success(function(data) {
			$scope.catalogs = data.catalogs;
		});

		$scope.isShowingCatalogs = function(index) {
			return $scope.activeRoleIndex === index;
		};

		$scope.activeCatalogIndex;

		$scope.selectedCatalogId = function(catalog, index) {
			$scope.activeCatalogIndex = index;
			$scope.catalogid = catalog.id;
			var selectedcatalogid = "id=" + $scope.catalogid;
			$http.post('/metricdashboard/find_stages', selectedcatalogid, config).success(function(data) {
				$scope.stages = data.stages;
			});

			$scope.isShowingStages = function(index) {
				return $scope.activeCatalogIndex === index;
			};

			$scope.activeStageIndex;

			$scope.selectedStageId = function(stage, index) {
				$scope.activeStageIndex = index;
				$scope.stageid = stage.id;
				console.log(stage.name);
				var selectedstageid = "id=" + $scope.stageid;
				$http.post('/metricdashboard/find_metrics', selectedstageid, config).success(function(data) {
					$scope.metrics = data.metrics;
					console.log($scope.metrics);
				});

				$scope.isShowingMetrics = function(index) {
				return $scope.activeStageIndex === index;
			};
			};
		};
	};

// retieve Catalog list
// 	$http.get('/metricdashboard/get_catalog').success(function(data){
// 		$scope.catalogs = data.catalogs;
// 		for (var i=0; i< $scope.catalogs.length; i++) {
// 			$scope.catalogs.name = $scope.catalogs[i].name;
// 			// console.log("catalog=" + $scope.catalogs[i].name);
// 		};
// 	});



// // retrieve Stages list
// 	$http.get('/metricdashboard/get_stages').success(function(data){
// 		$scope.stages = data.stages;
// 		for (var i=0; i< $scope.stages.length; i++) {
// 			$scope.stages.name = $scope.stages[i].name;
// 			// console.log("stages==" + $scope.stages[i].name);
// 		};
// 	});

// // retrieve Metrics list
// 	$http.get('/metricdashboard/get_metrics').success(function(data){
// 		$scope.metrics = data.metrics;
// 		for (var i=0; i< $scope.metrics.length; i++) {
// 			$scope.metrics.name = $scope.metrics[i].name;
// 			// console.log("metrics===" + $scope.metrics[i].name);
// 		};
// 	});

	// console.log($scope.catalogs);
// __________________________________________________________________________________________________________________________________________________
// retrieve roles for a particular catalog
// 	$scope.catalogId = $routeParams.catalogId;
// 	// console.log($scope.catalogId);

// 	var catalogroles = "id=" + $scope.catalogId;
// 	$http.post('/metricdashboard/catalog_roles', catalogroles, config).success(function(data) {
// 		$scope.rolesid = data.rolesid;
// 		$scope.rolesnames = [];
// 			for (var i=0; i< $scope.rolesid.length; i++) {
// 				$scope.rolesid.roles_id = $scope.rolesid[i].roles_id;

// 				// console.log(" id for all roles=:--->" + $scope.rolesid.roles_id);

// 				var rolesids = "id=" + $scope.rolesid.roles_id;
// 				console.log(rolesids);
// 				$http.post('/metricdashboard/roles_names', rolesids, config).success(function(data){
// 					$scope.rolesnames.push(data.rolenames[0]);
// 					console.log($scope.rolesnames);
// 				});
// 			};			
// 	});

// 	$scope.selectedCatalog = {};

// 	$scope.get_roles = function(id){
// 		$scope.selectedCatalog.id = id;
// 	};

// 	var selectedCatalogid  = "id=" + $routeParams.catalogId;
//  	$http.post('/metricdashboard/catalog_names', selectedCatalogid, config).success(function(data) {
//  		$scope.catalogname = data.catalogname;
//  		// console.log($scope.catalogname)
//  	});
// //__________________________________________________________________________________________________________________________________________________________
// // retrieve stages for a particular role
// 	$scope.roleId = $routeParams.roleId;

// 	var rolestages = "id=" + $scope.roleId;
// 	$http.post('/metricdashboard/role_stages', rolestages, config).success(function(data) {
// 		$scope.stagesid = data.stagesid;
// 		$scope.names = [];
// 			for (var i=0; i< $scope.stagesid.length; i++) {
// 				$scope.stagesid.stages_id = $scope.stagesid[i].stages_id;
// 				console.log(" id for all stages=:--->" + $scope.stagesid.stages_id);

// 				//retieve name for corresponding retreived all stages id from model/collection "role_stages"

// 				var stagesids = "id=" + $scope.stagesid.stages_id;
// 				$http.post('/metricdashboard/stages_names', stagesids, config).success(function(data){
// 					$scope.names.push(data.stagesnames[0]);
// 					console.log($scope.names);
// 				});
// 			};			
// 	});

// 	$scope.selectedRole = {};

// 	$scope.get_stages = function(id){
// 		$scope.selectedRole.id = id;
// 		console.log($scope.selectedRole.id);
// 	};

// 	// console.log($routeParams.roleId);
// 	// console.log($route);

// 	var slectedroleid  = "id=" + $routeParams.roleId;
//  	$http.post('/metricdashboard/role_name', slectedroleid, config).success(function(data) {
//  		$scope.rolename = data.rolename;
//  		// console.log($scope.rolename)
//  	});

 	
// //_________________________________________________________________________________________________________________________________________________________
// // retrieve metrics and names for corresponding stage
// 	$scope.stageId = $routeParams.stageId;

// 	var stagemetrics = "id=" + $scope.stageId;
// 	$http.post('/metricdashboard/stage_metrics', stagemetrics, config).success(function(data) {
// 		$scope.metricid = data.metricid;
// 		$scope.metricnames = [];
// 			for (var i=0; i< $scope.metricid.length; i++) {
// 				$scope.metricid.metric_id = $scope.metricid[i].metric_id;
				
// 				console.log(" id for all METRCIS=:--->" + $scope.metricid.metric_id);

// 				//retieve name for corresponding retreived all stages id from model/collection "role_stages"

// 				var metricids = "id=" + $scope.metricid.metric_id;
// 				$http.post('/metricdashboard/metrics_names', metricids, config).success(function(data){
// 					$scope.metricnames.push(data.metricnames[0]);
// 					console.log($scope.metricnames);
// 				});
// 			};			
// 	});

// 	$scope.selectedStage = {};

// 	$scope.get_metrics = function(id){
// 		$scope.selectedStage.id = id;
// 		console.log($scope.selectedStage.id);
// 	};

// 	var slectedstageid  = "id=" + $routeParams.stageId;
//  	$http.post('/metricdashboard/stage_name', slectedstageid, config).success(function(data) {
//  		$scope.stagename = data.stagename;
//  		// console.log($scope.stagename)
//  	});

//____________________________________________________________________________________________________________________________________________________________
//function for Registering person 
	$scope.register =function() {
		// if($scope.registerfrm.$valid) {
		// 	if($scope.registerfrm.password.$viewValue !== $scope.registerfrm.confirm_password.$viewValue)
		// 	{
		// 		alert("Oops! Something is wrong, Please provide correct password");
		// 		return;
		// 	}
			var registerPerson = "username=" +  $scope.username 
									+ "&firstname=" +  $scope.firstname 
									+ "&lastname=" +  $scope.lastname  
									+ "&password=" + $scope.password 
									+ "&email=" + $scope.email;
									console.log(registerPerson);
			$http.post('/metricdashboard/register_person', registerPerson, config).success(function(data) {
				console.log(data.username);
				$location.path("#/register/");
				alert("Thank you for registering with us");
			});
	// 	}
	 };
}

//____________________________CHART CONTROLLER___________________

function ChartCtrl($scope, $http, $location, $routeParams) {
	// retreive data for graph plot
	$http.get('/metricdashboard/rdks_data').success(function(data) {
		$scope.rdks = data.rdks;
		$scope.coordinates =[];
		$scope.dates = [];
		$scope.hightemp= [];
		$scope.lowtemp = [];
		// console.log($scope.rdks[1].coords);
		for (var i=0; i< $scope.rdks.length; i++) {
			$scope.coordinates.push($scope.rdks[i].coords);
			$scope.dates.push($scope.rdks[i].date);
			$scope.hightemp.push($scope.rdks[i].hightemp);
			$scope.lowtemp.push($scope.rdks[i].lowtemp);
		};
		var coordPlot = $scope.coordinates;
		var datePlot = $scope.dates;
		var hightempPlot = $scope.hightemp;
		var lowtempPlot = $scope.lowtemp;
		// console.log("The coordinates ====+++++++++++_>>>" + coordPlot);
		// console.log("here are dates" + $scope.dates);
		// console.log("here are low Temperature" + $scope.lowtemp);
		// console.log("here are High Temperature" + $scope.hightemp);
		// console.log(JSON.parse("[" + lowtempPlot + "]"));

		$(function () {
			$('#container').highcharts({
				chart: {
					type: 'areaspline',
					marginTop: 60,
					marginLeft: 60
				},
				title: {
					text: 'Yearly Average Temperature',
					x: -20 //center	
				},
				subtitle: {
					text: 'Source: Mongodb',
					x: -20
				},
				xAxis: {
					title:{
						text: 'Year'
					},
					// labels : { y : 20, rotation: -45, align: 'right' },
					// type: 'datetime'
					categories: JSON.parse("[" + datePlot + "]")
				},
				yAxis: {
					title: {
						text: 'Temperature (°C)'
					},
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}]	
				},
				tooltip: {
					valueSuffix: '°C'
				},
				plotOptions: {
					areaspline: {
						fillOpacity: 0.5
					}
            	},
				legend: {
					layout: 'vertical',
					align: 'left',
					verticalAlign: 'top',
					x:150,
					y:100,
					floating:true,
					borderWidth: 1,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				series: [{
					name: 'Temperature',
					data: JSON.parse("[" + coordPlot + "]")
				}]
			});
		});

		// Second Chart
		$(function () {
			$('#container2').highcharts({
				chart: {
					type: 'line',
					marginTop: 60,
					marginLeft: 60
				},
				title: {
					text: 'Yearly Highest Temperature',
					x: 10 //center	
				},
				subtitle: {
					text: 'Source: mongoDB',
					x: 10
				},
				xAxis: {
					title:{
						text: 'Year'
					},
					// labels : { y : 20, rotation: -45, align: 'right' },
					// type: 'datetime'
					categories: JSON.parse("[" + datePlot + "]")
				},
				yAxis: {
					title: {
						text: 'Temperature (°C)'
					},
					// tickInterval: 4,
					// gridLineColor: '#618661',
					// minorTickInterval: 2,
					// minorGridLineColor: '#618661',
					// minorGridLineDashStyle: 'dashdot',
					// alternateGridColor: {
					// linearGradient: {
					// x1: 0, y1: 1,
					// x2: 1, y2: 1
					// },
					// stops : [
					// [0, "#F8F8EE"],
					// [1, "#A2B9A6"]
					// ],
					// },
					// lineWidth: 1,
					// lineColor: '#CACACA',
					// tickWidth: 2,
					// tickLength: 4,
					// tickColor: '#CACACA',

					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}]	
				},
				tooltip: {
					crosshairs: true,
					shared: true
				},
				legend: {
					layout: 'vertical',
					// align: 'right',
					// verticalAlign: 'bottom'
					
				},
				series: [{
					type:'line',
					name: 'Highest Temperature',
					data: JSON.parse("[" + hightempPlot + "]")
				},
				{
					name: 'Lowest Temperature',
					data: JSON.parse("[" + lowtempPlot + "]")
				}]
			});
		});
	});
}

//______________File Upload CONTROLLER___________________

function FileUploadCtrl($scope, $http, $cookieStore, $location, $routeParams, $route, $resource) {
	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	$scope.showContent = function($fileContent){
		$scope.content = $fileContent;
		$scope.jsonData = $.csv.toObjects($fileContent);
		$scope.jsonContent = $scope.jsonData;
		
		console.log($scope.jsonData);
		
		for (var i=0; i< $scope.jsonData.length; i++) {
			$scope.Coords = $scope.jsonData[i].Coords;
			$scope.Dates = $scope.jsonData[i].Date;
			$scope.Hightemp = $scope.jsonData[i].Hightemp;
			$scope.Lowtemp = $scope.jsonData[i].Lowtemp;
			var storeData = "date=" + $scope.Dates + "&coords=" + $scope.Coords + "&hightemp=" + $scope.Hightemp + "&lowtemp=" + $scope.Lowtemp;
			console.log(storeData);

			$http.post('/metricdashboard/store_rdks', storeData, config).success(function(data) {
			});
		};
	};


	$scope.complete = function(content) {
		$location.path("charts");
	};
};

// $http({
				// 	url: '/metricdashboard/store_rdks',
				// 	method: 'POST',
				// 	data: storeData,
				// 	headers: config
				// }).success(function(data, status, headers, config){
				// 	console.log('Success: ', data, status, headers, config);

				// });

// var Url = "/static/dashboard/Uploadedfiles/sample2.csv"
		// $http.get(Url).then(function(response){
		// 	var json = $.csv.toObjects(response.data);
		// 	console.log(json);
		// 	return json;
		// });
		// return Items;
		// console.log(Items);
		// $scope.response = JSON.parse(content);
		// console.log($scope.response);

		// $scope.complete = function(content) {
		// $location.path("charts");
		// $http({
		// 	method: 'GET',
		// 	url: "/static/dashboard/Uploadedfiles/sample2.csv",
		// 	transformResponse: function(content) {
		// 		// Transform CSV file into a JSON object
		// 		var json = $.csv.toObjects(content);
		// 		return json;
		// 	},
		// 	cache: true,
		// })
		// .success(function(content, status) {
		// 	$scope.content = content;
		// 	console.log($scope.content);

		// 	for (var i=0; i< $scope.content.length; i++) {
				
		// 		$scope.Coords = $scope.content[i].Coords;
		// 		$scope.Dates = $scope.content[i].Date;
		// 		$scope.Hightemp = $scope.content[i].Hightemp;
		// 		$scope.Lowtemp = $scope.content[i].Lowtemp;

		// 		var storeData = "date=" + $scope.Dates + "&coords=" + $scope.Coords + "&hightemp=" + $scope.Hightemp + "&lowtemp=" + $scope.Lowtemp;
				
		// 		console.log(storeData);
				
		// 		$http.post('/metricdashboard/store_rdks', storeData, config).success(function(data) {
		// 		});
		// 	};
		// 	// $location.path("charts");

		// })
		// .error(function(data, status) {
		// 	$scope.content = content || "Request failed";
		// });
	// };
		