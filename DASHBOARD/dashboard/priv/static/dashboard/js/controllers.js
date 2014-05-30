function DashboardCtrl($scope, $http, $location, $routeParams, $route, LoginService, $resource) {

	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

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
					text: 'Yearly Highest Vs Lowest Temperature',
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


// Chart for SLA-1 HR Opearational Metric
	$http.get('/metricdashboard/operational_sla1').success(function(data) {
		$scope.sla1 = data.sla1;
		$scope.current_year =[];
		$scope.last_year = [];
		$scope.sla_low_range= [];
		$scope.sla_high_range = [];
		// console.log($scope.sla1[1].coords);
		for (var i=0; i< $scope.sla1.length; i++) {
			$scope.current_year.push($scope.sla1[i].current_year);
			$scope.last_year.push($scope.sla1[i].last_year);
			$scope.sla_low_range.push($scope.sla1[i].sla_low_range);
			$scope.sla_high_range.push($scope.sla1[i].sla_high_range);
		};
		var currentYear = $scope.current_year;
		var lastYear = $scope.last_year;
		var lowRange = $scope.sla_low_range;
		var highRange = $scope.sla_high_range;

		$(function () {
        $('#containerSLA1').highcharts({
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Opearational SLAs'
            },
            subtitle: {
                text: 'SLA 1 - Responsiveness'
            },
            xAxis: [{
                categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', 
                '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
                '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
                '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
                '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52']
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}%',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Temperature',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: 'Rainfall',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value} mm',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 100,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: [{
                name: 'Rainfall',
                type: 'column',
                yAxis: 1,
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                tooltip: {
                    valueSuffix: ' mm'
                }
    
            }, {
                name: 'Temperature',
                type: 'spline',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                tooltip: {
                    valueSuffix: '°C'
                }
            }]
        });
    	});
	});


// Chart for SLA-2 HR Opearational Metric
	$http.get('/metricdashboard/operational_sla2').success(function(data) {
		$scope.sla2 = data.sla2;
		$scope.current_year =[];
		$scope.last_year = [];
		$scope.sla_low_range= [];
		$scope.sla_high_range = [];
		// console.log($scope.sla1[1].coords);
		for (var i=0; i< $scope.sla2.length; i++) {
			$scope.current_year.push($scope.sla2[i].current_year);
			$scope.last_year.push($scope.sla2[i].last_year);
			$scope.sla_low_range.push($scope.sla2[i].sla_low_range);
			$scope.sla_high_range.push($scope.sla2[i].sla_high_range);
		};
		var currentYear = $scope.current_year;
		var lastYear = $scope.last_year;
		var lowRange = $scope.sla_low_range;
		var highRange = $scope.sla_high_range;
	});

// Chart for SLA-3 HR Opearational Metric
	$http.get('/metricdashboard/operational_sla3').success(function(data) {
		$scope.sla3 = data.sla3;
		$scope.current_year =[];
		$scope.last_year = [];
		$scope.sla_low_range= [];
		$scope.sla_high_range = [];
		// console.log($scope.sla1[1].coords);
		for (var i=0; i< $scope.sla3.length; i++) {
			$scope.current_year.push($scope.sla3[i].current_year);
			$scope.last_year.push($scope.sla3[i].last_year);
			$scope.sla_low_range.push($scope.sla3[i].sla_low_range);
			$scope.sla_high_range.push($scope.sla3[i].sla_high_range);
		};
		var currentYear = $scope.current_year;
		var lastYear = $scope.last_year;
		var lowRange = $scope.sla_low_range;
		var highRange = $scope.sla_high_range;
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

//______________HR Metric Upload CONTROLLER___________________

function MetricUploadCtrl($scope, $http, $cookieStore, $location, $routeParams, $route, $resource) {
	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	$scope.showContent = function($fileContent){
		$scope.content = $fileContent;
		$scope.jsonData = $.csv.toObjects($fileContent);
		$scope.jsonContent = $scope.jsonData;
		
		console.log($scope.jsonData);
		
		for (var i=0; i< $scope.jsonData.length; i++) {
			$scope.Sla_level = $scope.jsonData[i].Sla_level;
			$scope.Current_year = $scope.jsonData[i].Current_year;
			$scope.Last_year = $scope.jsonData[i].Last_year;
			$scope.Sla_low_range = $scope.jsonData[i].Sla_low_range;
			$scope.Sla_high_range = $scope.jsonData[i].Sla_high_range;

			var store_operational_Data = "sla_level=" + $scope.Sla_level + "&current_year=" + $scope.Current_year
							+ "&last_year=" + $scope.Last_year + "&sla_low_range=" + $scope.Sla_low_range
							+ "&sla_high_range=" + $scope.Sla_high_range;

			$http.post('/metricdashboard/store_operational_sla', store_operational_Data, config).success(function(data) {
			});
		};
	};

	$scope.complete = function(content) {
		$location.path("charts");
	};
};			