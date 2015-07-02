function DashboardCtrl($scope, $http, $location, $routeParams, $route, $cookieStore, LoginService, $resource) {

	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	// function to login user
	$scope.login =function(){
		console.log("login function called");
		var loginPerson = "username=" + $scope.username + "&password=" + $scope.password;
		console.log(loginPerson);
		$http.post('/metricdashboard/login_person', loginPerson, config).success(function(data) {
			var person = data.person;
			LoginService.isLogged = true;
			$cookieStore.put("isLogged", true);
			LoginService.username = person.user_name;
			$cookieStore.put("username", person.user_name);
			$cookieStore.put("first_name", person.first_name);
			$cookieStore.put("email", person.email);
			$cookieStore.put("id", person.id);
			LoginService.role = person.role;
			$cookieStore.put("role", person.role);
			$scope.alerts.push({type:'success', msg:"success!"});
			$location.path("/");
		})
		.error(function(){
			alert("username and password do not match");
		});
	}

	//function for Registering person 
	$scope.register =function() {
		if($scope.registerfrm.$valid) {
			if($scope.registerfrm.password.$viewValue !== $scope.registerfrm.confirm_password.$viewValue)
			{
				alert("Oops! Something is wrong, Please provide correct password");
				return;
			}
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
		}
	};

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
			console.log(catalog.name + index);
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
}

//____________________________CHART CONTROLLER___________________

function ChartCtrl($scope, $http, $location, $routeParams, $rootScope, $route, $cookieStore) {
	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	$rootScope.tabClick = function ($event) {
		$event.preventDefault();
	}

	// retreive data for graph plot
	$http.get('/metricdashboard/rdks_data').success(function(data) {
		$scope.rdks = data.rdks;
		$scope.coordinates =[];
		$scope.dates = [];
		$scope.hightemp= [];
		$scope.lowtemp = [];
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
		$scope.dataSla1 = [];
		$scope.week = [];
		$scope.current_year =[];
		$scope.last_year = [];
		$scope.sla_low_range= [];
		$scope.sla_high_range = [];
		// console.log($scope.sla1[1].sla_level);
		for (var i=0; i< $scope.sla1.length; i++) {
			$scope.dataSla1.push($scope.sla1[i]);
			$scope.week.push($scope.sla1[i].week);
			$scope.current_year.push($scope.sla1[i].current_year);
			$scope.last_year.push($scope.sla1[i].last_year);
			$scope.sla_low_range.push($scope.sla1[i].sla_low_range);
			$scope.sla_high_range.push($scope.sla1[i].sla_high_range);
		};
		$scope.datasla1 = $scope.dataSla1;
		var week = $scope.week;
		var currentYear = $scope.current_year;
		var lastYear = $scope.last_year;
		var lowRange = $scope.sla_low_range;
		var highRange = $scope.sla_high_range;

		$(function () {
			$('#containerSLA1').highcharts({
				title: {
					text: 'Opearational SLAs',
					x: -20 //center	
				},
				subtitle: {
					text: 'SLA 1 - Responsiveness',
					x: -20
				},
				xAxis: {
					title:{
						text: 'Week'
					},
					// labels : { y : 20, rotation: -45, align: 'right' },
					// type: 'datetime'
					categories: JSON.parse("[" + week + "]")
				},
				yAxis: {
					title: {
						text: 'Percentage (%)'
					},
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
				plotOptions: {
					areaspline: {
						fillOpacity: 0.5
					}
            	},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle',
					borderWidth: 0,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				series: [{
					type: 'column',
					name: 'Current Year',
					data: JSON.parse("[" + currentYear+ "]")
				}, {
					type: 'spline',
					name: 'Last Year',
					data: JSON.parse("[" + lastYear + "]")
				}, {
					type: 'line',
					name: 'SLA Low Range',
					data: JSON.parse("[" + lowRange + "]")
				}, {
					type: 'line',
					name: 'SLA High Range',
					data: JSON.parse("[" + highRange + "]")
				}]
			});
		});
	});


// Chart for SLA-2 HR Opearational Metric
	$http.get('/metricdashboard/operational_sla2').success(function(data) {
		$scope.sla2 = data.sla2;
		$scope.dataSla2 = [];
		$scope.week = [];
		$scope.current_year =[];
		$scope.last_year = [];
		$scope.sla_low_range= [];
		$scope.sla_high_range = [];
		// console.log($scope.sla1[1].coords);
		for (var i=0; i< $scope.sla2.length; i++) {
			$scope.dataSla2.push($scope.sla2[i]);
			$scope.week.push($scope.sla2[i].week);
			$scope.current_year.push($scope.sla2[i].current_year);
			$scope.last_year.push($scope.sla2[i].last_year);
			$scope.sla_low_range.push($scope.sla2[i].sla_low_range);
			$scope.sla_high_range.push($scope.sla2[i].sla_high_range);
		};
		$scope.datasla2 = $scope.dataSla2;
		var week = $scope.week;
		var currentYear = $scope.current_year;
		var lastYear = $scope.last_year;
		var lowRange = $scope.sla_low_range;
		var highRange = $scope.sla_high_range;

		$(function () {
			$('#containerSLA2').highcharts({
				title: {
					text: 'Opearational SLAs',
					x: -20 //center	
				},
				subtitle: {
					text: 'SLA 2 - Responsiveness',
					x: -20
				},
				xAxis: {
					title:{
						text: 'Week'
					},
					// labels : { y : 20, rotation: -45, align: 'right' },
					// type: 'datetime'
					categories: JSON.parse("[" + week+ "]")
				},
				yAxis: {
					title: {
						text: 'Percentage (%)'
					},
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
				plotOptions: {
					areaspline: {
						fillOpacity: 0.5
					}
            	},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle',
					borderWidth: 0,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				series: [{
					type: 'column',
					name: 'Current Year',
					data: JSON.parse("[" + currentYear + "]")
				}, {
					type: 'spline',
					name: 'Last Year',
					data: JSON.parse("[" + lastYear + "]")
				}, {
					type: 'line',
					name: 'SLA Low Range',
					data: JSON.parse("[" + lowRange + "]")
				}, {
					type: 'line',
					name: 'SLA High Range',
					data: JSON.parse("[" + highRange + "]")
				}]
			});
		});
	});

// Chart for SLA-3 HR Opearational Metric
	$http.get('/metricdashboard/operational_sla3').success(function(data) {
		$scope.sla3 = data.sla3;
		$scope.dataSla3 = [];
		$scope.week = [];
		$scope.current_year =[];
		$scope.last_year = [];
		$scope.sla_low_range= [];
		$scope.sla_high_range = [];
		// console.log($scope.sla1[1].coords);
		for (var i=0; i< $scope.sla3.length; i++) {
			$scope.dataSla3.push($scope.sla3[i]);
			$scope.week.push($scope.sla3[i].week);
			$scope.current_year.push($scope.sla3[i].current_year);
			$scope.last_year.push($scope.sla3[i].last_year);
			$scope.sla_low_range.push($scope.sla3[i].sla_low_range);
			$scope.sla_high_range.push($scope.sla3[i].sla_high_range);
		};
		$scope.datasla3 = $scope.dataSla3;
		var week = $scope.week;
		var currentYear = $scope.current_year;
		var lastYear = $scope.last_year;
		var lowRange = $scope.sla_low_range;
		var highRange = $scope.sla_high_range;

		$(function () {
			$('#containerSLA3').highcharts({
				title: {
					text: 'Opearational SLAs',
					x: -20 //center	
				},
				subtitle: {
					text: 'SLA 3 - Responsiveness',
					x: -20
				},
				xAxis: {
					title:{
						text: 'Week'
					},
					// labels : { y : 20, rotation: -45, align: 'right' },
					// type: 'datetime'
					categories: JSON.parse("[" + week + "]")
				},
				yAxis: {
					title: {
						text: 'Percentage (%)'
					},
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
				plotOptions: {
					areaspline: {
						fillOpacity: 0.5
					}
            	},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle',
					borderWidth: 0,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				series: [{
					type: 'column',
					name: 'Current Year',
					data: JSON.parse("[" + currentYear + "]")
				}, {
					type: 'spline',
					name: 'Last Year',
					data: JSON.parse("[" + lastYear + "]")
				}, {
					type: 'spline',
					name: 'SLA Low Range',
					data: JSON.parse("[" + lowRange + "]")
				}, {
					type: 'spline',
					name: 'SLA High Range',
					data: JSON.parse("[" + highRange + "]")
				}]
			});
		});
	});




	// Chart for DrillDown
	$http.get('/metricdashboard/get_col_drilldown').success(function(data) {
		$scope.drilldown = data.col_drilldown;
		$scope.team = [];
		$scope.histroical_incoming = [];
		$scope.remained_open =[];
		$scope.incoming = [];
		$scope.outgoing= [];
		for (var i=0; i< $scope.drilldown.length; i++) {
			$scope.team.push($scope.drilldown[i].team);
			$scope.histroical_incoming.push($scope.drilldown[i].histroical_incoming);
			$scope.remained_open.push($scope.drilldown[i].remained_open);
			$scope.incoming.push($scope.drilldown[i].incoming);
			$scope.outgoing.push($scope.drilldown[i].outgoing);
		};
		var Team = $scope.team;
		var histroicalIncoming = $scope.histroical_incoming;
		var remainedOpen = $scope.remained_open;
		var Incoming = $scope.incoming;
		var Outgoing = $scope.outgoing;

		$(function() {
			$('#tracker_request').highcharts({
				title: {
					text: 'Incoming/Outgoing/Total Volume of 52 Tracker Requests by Pay Period',
					x: -20 //center	
				},
				subtitle: {
					text: 'Source: Mongodb',
					x: -20
				},
				xAxis: {
					title:{
						text: 'Team'
					},
					categories: Team,
					labels: { 
						rotation: -60, 
						align: 'right', 
						style: { 
							fontSize: '11px', 
							fontFamily: 'Verdana, sans-serif' 
						} 
					}
				},
				yAxis: {
					// min:0, max:16000, tickInterval: 2000,
					title: {
						text: '# of Requests'
					},
					stackLabels:{
						enabled: true,
						style:{
							fontWeight: 'bold',
							color:(Highcharts.theme && Highcharts.theme.textColor) || 'grey'
						}
					}	
				},
				tooltip: {
					crosshairs: true,
					shared: true
				},
				plotOptions: {
					area: {
						fillOpacity: 0.5
					}
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle',
					borderWidth: 0,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				plotOptions:{
					column:{
						stacking:'normal',
						// dataLabels:{
						// 	enabled: true,
						// 	color: (Highcharts.theme && Highcharts.theme.dataLabelColor) || 'white',
						// 	style:{
						// 		textShadow: '0 0 3px black, 0 0 3px black'
						// 	}
						// }
					}
				},
				series: [{
					type: 'areaspline',
					name: 'Historical Incoming',
					data: JSON.parse("[" + histroicalIncoming + "]")
				},{
					type: 'column',
					name: 'Remained Open',
					data: JSON.parse("[" + remainedOpen + "]")
				}, {
					type: 'column',
					name: 'Incoming',
					data: JSON.parse("[" + Incoming + "]")
				},  {
					type: 'spline',
					name: 'Outgoing',
					data: JSON.parse("[" + Outgoing + "]"),
					dashStyle: 'shortDash'
				}],
			});
		});
	});



	// Chart for 52 tracker request
	$http.get('/metricdashboard/get_tracker_request').success(function(data) {
		$scope.tracker_request = data.tracker_request;
		$scope.pay_period = [];
		$scope.histroical_incoming = [];
		$scope.remained_open =[];
		$scope.incoming = [];
		$scope.outgoing= [];
		for (var i=0; i< $scope.tracker_request.length; i++) {
			$scope.pay_period.push($scope.tracker_request[i].pay_period);
			$scope.histroical_incoming.push($scope.tracker_request[i].histroical_incoming);
			$scope.remained_open.push($scope.tracker_request[i].remained_open);
			$scope.incoming.push($scope.tracker_request[i].incoming);
			$scope.outgoing.push($scope.tracker_request[i].outgoing);
		};
		var payPeriod = $scope.pay_period;
		var histroicalIncoming = $scope.histroical_incoming;
		var remainedOpen = $scope.remained_open;
		var Incoming = $scope.incoming;
		var Outgoing = $scope.outgoing;

		$(function() {
			$('#drilldown').highcharts({
				title: {
					text: 'Incoming/Outgoing/Total Volume of 52 Tracker Requests by Pay Period',
					x: -20 //center	
				},
				subtitle: {
					text: 'Source: Mongodb',
					x: -20
				},
				xAxis: {
					title:{
						text: 'Pay Period (weeks)'
					},
					categories: payPeriod,
					labels: { 
						rotation: -60, 
						align: 'right', 
						style: { 
							fontSize: '13px', 
							fontFamily: 'Verdana, sans-serif' 
						} 
					}
				},
				yAxis: {
					// min:0, max:16000, tickInterval: 2000,
					title: {
						text: '# of Requests'
					},
					// stackLabels:{
					// 	enabled: true,
					// 	style:{
					// 		fontWeight: 'bold',
					// 		color:(Highcharts.theme && Highcharts.theme.textColor) || 'grey'
					// 	}
					// }	
				},
				tooltip: {
					crosshairs: true,
					shared: true
				},
				plotOptions: {
					area: {
						fillOpacity: 0.1
					}
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle',
					borderWidth: 0,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				plotOptions:{
					column:{
						stacking:'normal',
						// dataLabels:{
						// 	enabled: true,
						// 	color: (Highcharts.theme && Highcharts.theme.dataLabelColor) || 'white',
						// 	style:{
						// 		textShadow: '0 0 3px black, 0 0 3px black'
						// 	}
						// }
					}
				},
				series: [{
					type: 'area',
					name: 'Historical Incoming',
					data: JSON.parse("[" + histroicalIncoming + "]")
				},{
					type: 'column',
					name: 'Remained Open',
					data: JSON.parse("[" + remainedOpen + "]")
				}, {
					type: 'column',
					name: 'Incoming',
					data: JSON.parse("[" + Incoming + "]")
				},  {
					type: 'spline',
					name: 'Outgoing',
					data: JSON.parse("[" + Outgoing + "]"),
					dashStyle: 'shortDash'
				}],
			})
		})
	});

// Chart for Hiring Manager
	$http.get('/metricdashboard/get_hiring_manager').success(function(data) {
		$scope.hiring_manager = data.hiring_manager;
		$scope.hiring_manager_organization = [];
		var i, hiringmanager_Organization;
		for(i=0; i< $scope.hiring_manager.length; i++) {
			hiringmanager_Organization = $scope.hiring_manager[i].organization;
			if($scope.hiring_manager_organization.indexOf(hiringmanager_Organization) === -1) {
				$scope.hiring_manager_organization[$scope.hiring_manager_organization.length] = hiringmanager_Organization;
			}
		};
		hiring_Records = [3,2,3,1,5,4,3,1,17,2,3,3,15];
		var hiring_manager_Records = [];
		for(i=0; i<$scope.hiring_manager_organization.length; i++) {
			var current_stat_milestone_count = "organization=" + $scope.hiring_manager_organization[i];
			$http.post('/metricdashboard/get_hirinmanager_count', current_stat_milestone_count, config).success(function(data) {
				hiring_manager_Records.push(data.hiringCount);
				construct_currentstatusSeries(hiring_manager_Records);
			});
		};
		function construct_currentstatusSeries(hiring_manager_Records) {
			if(hiring_manager_Records.length === $scope.hiring_manager_organization.length) {
				$('#hiring_manager').highcharts({
					chart:{
						type: 'bar'
					},
					title: {
						text: 'Hiring Manager Status by Organization'
					},
					subtitle:{
						text: 'Current Status: 09. Selecting Official Review App-Interviews'
					},
					xAxis:{
						categories: $scope.hiring_manager_organization,
						lables:{
							overflow: 'justify'
							// style:{
							// 	width: '100px',
							// 	'min-width': '100px'
							// },
							// useHTML : true
						},
						title:{
							text:'Organization'
						}
					},
					yAxis:{
						title:{
							text:'Number Of Records'
						},
						labels:{
							overflow: 'justify'
						}
					},
					plotOptions:{
						bar:{
							colorByPoint: false,
							dataLabels:{
								enabled:true
							},
							point:{
								events:{
									click:function(event){
										$scope.orgName = [];
										var click_hiring_Organization = "organization=" + this.category;
										$http.post('/metricdashboard/get_click_hiring_Data',click_hiring_Organization,config).success(function(data){
											$scope.selectedHiringData = [];
											$scope.orgName.push(data.selectedHiring[0]);
											$scope.selectedHiring = data.selectedHiring;
										});
									}
								}
							}
						},
					},
					legend: {
						enabled:true
					},
					// series: seriesHiringManager
					series: [{
						name: ['Number Of Records'],
						data: hiring_Records
					}]
				})
			}
		}
	});


	// 

// Chart for Inventory by OPM
	$(function(){
		$http.get('/metricdashboard/get_inventory_opm').success(function(data) {
			$scope.inventory_opm = data.inventory_opm;
			$scope.currentStatus = [];
			$scope.records = [];
			for (var i=0; i< $scope.inventory_opm.length; i++) {
				$scope.currentStatus.push($scope.inventory_opm[i].current_status);
				$scope.records.push($scope.inventory_opm[i].number_of_records);
			};
			var currentStatus = $scope.currentStatus;
			var records = $scope.records;
			// console.log(currentStatus);
			// console.log(records);

			$('#inventory_opm').highcharts({
				chart:{
					type: 'bar',
				},
				title: {
					text: 'Inventory by OPM 80 Day Hiring Milestone'
				},
				xAxis:{
					categories: currentStatus,
					lables:{
						overflow: 'justify',
						style:{
							width: '100px',
							'min-width': '100px'
						},
						useHTML : true
					},
					title:{
						text:'Current Status / Milestone'
					}
				},
				yAxis:{
					min:0,
					title:{
						text:'Number Of Records'
					},
					labels:{
						overflow: 'justify'
					}
				},
				plotOptions:{
					bar:{
						dataLabels:{
							enabled:true
						}
					}
				},
				legend: {
					enabled:true
				},
				credits:{
					enabled:true
				},
				series: [{
					name : ['Number Of Records'],
					data :[{
						y:records[0],
						color:'red',
					},{
						y:records[1],
						color:'red',
					},{
						y:records[2],
						color:'red',
					},{
						y:records[3],
						color:'red',
					},{
						y:records[4],
						color:'yellow',
					},{
						y:records[5],
						color:'green',
					},{
						y:records[6],
						color:'green',
					},{
						y:records[7],
						color:'blue',
					}]
				}]
			});
		});
	});

// Charts for Number of Tentative offers by Organization
	$http.get('/metricdashboard/get_tentative').success(function(data) {
		$scope.tentative = data.tentative;
		// $scope.put_week = function(week){
		// 	var tentative_week = "week="+ week;
		// 	console.log(tentative_week);
		// 	$http.post('/metricdashboard/selected_tentative', tentative_week, config).success(function(data) {
		// 		$scope.selectedTentative = data.selectedTentative;
		// 		console.log($scope.selectedTentative);
		// 		$scope.selectedOrganization = [];
		// 		$scope.selectedRecords = [];
		// 		for (var i=0; i<$scope.selectedTentative.length; i++ ){
		// 			$scope.selectedOrganization.push($scope.selectedTentative[i].organization);
		// 			$scope.selectedRecords.push($scope.selectedTentative[i].number_of_records);
		// 		}
		// 		console.log($scope.selectedOrganization);
		// 		console.log($scope.selectedRecords);
		// 	})
		// };


		$scope.xOrganization = [];
		var i, organization;

		for(i=0; i< $scope.tentative.length; i++) {
			organization = $scope.tentative[i].organization;
			if($scope.xOrganization.indexOf(organization) === -1){
				$scope.xOrganization[$scope.xOrganization.length] = organization;
			}
		}
		// console.log($scope.xOrganization);
		xRecords = [1,8,3,2,5,6,4,6,7,17,2,2,1,14,16,7,5,9];

		
		var Records = [];
		for(i=0; i<$scope.xOrganization.length; i++) {
			var org_total_Value = "organization=" + $scope.xOrganization[i];
			$http.post('/metricdashboard/get_totalValue',org_total_Value,config).success(function(data){
				Records.push(data.count);
				constructSeries(Records);
			})
		};
		// console.log($scope.xOrganization);
		function constructSeries(Records){
			if(Records.length === $scope.xOrganization.length){
				// console.log(Records);
				$('#tentative').highcharts({
					chart:{
						type:'column'
					},
					title:{
					text: 'Number of Tentative Offers by Organization'
					},
					xAxis:{
						title:{
							text: 'Organizations'
						},
						categories: $scope.xOrganization,
						labels :{
							overflow: 'justify',
							rotation:-75,
							align:'right',
							style:{
								width: '100px',
								'min-width':'100px',
								color: '#6D869F',
								fontSize: '8px',
								fontFamily: 'Verdana, sans-serif'
							},
							useHTML : true
						}
					},
					yAxis:{
						title:{
							text: 'Number of Records'
						}
					},
					colors: [
							'#7cb5ec',
							'#434348',
							'#90ed7d',
							'#f7a35c',
							'#8085e9',
							'#f15c80',
							'#e4d354',
							'#FF00FF',
							'#8d4653',
							'#91e8e1',
							'#8A2BE2',
							'#5F9EA0',
							'#A9A9A9',
							// '#FF1493',
							'#ADFF2F',
							'#F08080',
							'#20B2AA',
							'#B0C4DE',
							'#F5DEB3',
							'#CD853F'
							],
					plotOptions:{
						series:{
							point:{
								events:{
									click:function(event){
										// $('#detailTable').dialog({
										// 	title: this.category,
										// 	modal:true,
										// 	resizable: true,
										// 	width: 650,
										// 	height:450
										// });
										$scope.orgName = [];
										var clickOrganization = "organization=" + this.category;
										$http.post('/metricdashboard/get_clickData',clickOrganization,config).success(function(data){
											$scope.currentS = [];
											$scope.orgName.push(data.details[0]);
											console.log($scope.orgName);
											$scope.offersDetails = data.details;
											for (var i=0; i < $scope.offersDetails.length; i++ ){
												$scope.currentS.push($scope.offersDetails[i]);
											};
										});
									}
								}
							}
						},
						column:{
							colorByPoint: true,
							dataLabels:{
								enabled:true
							},
						}
					},
					legend: {
						enabled:false
					},
					series: [{
						name: ["Number of Records: "],
						data: xRecords
					}]
				});
			}
		}
	});

//Chart for Inventory by Organization
	$http.get('/metricdashboard/get_inventory_org').success(function(data) {
		$scope.inventory_org = data.inventory_org;
		$scope.categoryOrganization = [];
		var i, organization;
		for(i =0; i<$scope.inventory_org.length; i++) {
			organization = $scope.inventory_org[i].organization;
			if($scope.categoryOrganization.indexOf(organization) === -1) {
				$scope.categoryOrganization[$scope.categoryOrganization.length] = organization;
			}
		};
		// console.log($scope.categoryOrganization);
		inventory_org_xRecords = [2,11,6,19,18,25,21,16,27,34,8,8,18,12,64,27,17,26,37];

		var inventory_org_Records = [];
		for (i=0;i<$scope.categoryOrganization.length; i++) {
			var inventory_org_count = "organization=" + $scope.categoryOrganization[i];
			$http.post('/metricdashboard/get_inventory_org_count', inventory_org_count, config).success(function(data) {
				inventory_org_Records.push(data.inventory_count);
				construct_inventorySeries(inventory_org_Records);
			});
		};
		function construct_inventorySeries(inventory_org_Records){
			if(inventory_org_Records.length === $scope.categoryOrganization.length) {
				// console.log(inventory_org_Records);
				$('#inventory_org').highcharts({
					chart:{
						type: 'column'
					},
					title: {
						text: ' Inventory by Organization'
					},
					xAxis:{
						categories: $scope.categoryOrganization,
						title:{
							text:'Organizations'
						},
						labels :{
							overflow: 'justify',
							rotation:-75,
							align:'right',
							style:{
								width: '100px',
								'min-width':'100px',
								color: '#6D869F',
								fontSize: '8px',
								fontFamily: 'Verdana, sans-serif'
							},
							useHTML : true
						}
					},
					yAxis:{
						title:{
							text:'Number Of Records'
						},
					},
					colors: [
						'#7cb5ec',
						'#434348',
						'#90ed7d',
						'#f7a35c',
						'#8085e9',
						'#f15c80',
						'#e4d354',
						'#FF00FF',
						'#8d4653',
						'#91e8e1',
						'#8A2BE2',
						'#5F9EA0',
						'#A9A9A9',
						'#FF1493',
						'#ADFF2F',
						'#F08080',
						'#20B2AA',
						'#B0C4DE',
						'#F5DEB3',
						'#CD853F'
					],
					plotOptions:{
						series:{
							point:{
								events:{
									click:function(event) {
										console.log(this.category);
										// .dialog({
										// 	title: this.category,
										// 	modal: true,
										// 	resizable: true,
										// 	width: 650,
										// 	height: 450
										// });
										$scope.orgName = [];
										var click_inventoryOrg = "inventory_organization=" + this.category;
										$http.post('/metricdashboard/get_click_inventoryorg_Data', click_inventoryOrg, config).success(function(data) {
											$scope.inventory_org_Data = [];
											$scope.orgName.push(data.inventory_org_Details[0]);
											$scope.inventory_org_Details = data.inventory_org_Details;
											for (var i=0; i< $scope.inventory_org_Details.length; i++) {
												$scope.inventory_org_Data.push($scope.inventory_org_Details[i]);
											};
										});
									}
								}
							}
						},
						column:{
							colorByPoint: true,
							dataLabels:{
								enabled:true
							}
						}
					},
					legend: {
						enabled:false
					},
					series: [{
						name: ['Number of Records'],
						data: inventory_org_xRecords
					}]
				})
			}
		}
	});




	// Chart AGING EXAMPLE
	
	$(function(){
		$http.get('/metricdashboard/get_aging_example').success(function(data) {
			var data = data.aging_example;
			var seriesData = [];
			var xCategories = [];
			var i, category;
			for(i=0; i<data.length; i++){
				category = data[i].group;
				if(xCategories.indexOf(category) === -1){
					xCategories[xCategories.length] = category;
				}
			}
			for(i = 0; i< data.length; i++){
				if(seriesData){
					var currSeries = seriesData.filter(function(seriesObject){ return seriesObject.name == data[i].type_of_action;});
					// console.log(currSeries);
					if(currSeries.length === 0){
						seriesData[seriesData.length] = currSeries = {name: data[i].type_of_action, data: []}; 
					} else {
						currSeries = currSeries[0];
					}
					var index = currSeries.data.length;
					// console.log(index);
					currSeries.data[index] = data[i].values;
				} else {
					seriesData[0] = {name:data[i].type_of_action, data:[data[i].values]}
				}
			}
			// console.log(seriesData);
			$('#aging_example').highcharts({
				chart:{
					type: 'column'
					// type: 'pie'
				},
				title:{
					text: 'Aging By Approved Date'
				},
				xAxis: {
					categories: xCategories
					// [ '0 to 30', '31 to 60', '61 to 90', '91 to 120', '121>']
				},
				yAxis:{
					// min:0,
					title:{
						text: 'Values'
					},
					stackLabels: {
						enabled: true,
						style: {
							fontWeight: 'bold',
							color: (Highcharts.theme && Highcharts.theme.textColor || 'gray')
						}
					}
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle',
					borderWidth: 0,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				tooltip: {
					formatter: function() {
						return '<b>'+ this.x +'</b><br/>'+
						this.series.name +': '+ this.y +'<br/>'+
						'Total: '+ this.point.stackTotal;
					}
				},
				plotOptions: {
					column: {
						stacking: 'normal'
					},
					pie:{
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels:{
							enabled:true
						}
					}
				},
				series: seriesData,
				// drilldown : seriesData,
				// drilldown: {
				// 	series: [{
				// 		id: xCategories,
				// 		data: seriesData
				// 	}]
				// }
			});
		});
	});

	// Charts For CRM_CASE_AGING
	$(function(){
		$http.get('/metricdashboard/get_crm_case_aging').success(function(data) {
			var data = data.crm_case_aging;
			// console.log(data);
			var seriesData = [];
			var xCategories = [];
			var xCategoriesDrilldown = [];
			var seriesDataDrillDown = [];
			var i, category, categoryDrilldown;

			for(i=0; i<data.length; i++){
				categoryDrilldown = data[i].provider_group;
				if(xCategoriesDrilldown.indexOf(categoryDrilldown) === -1){
					xCategoriesDrilldown[xCategoriesDrilldown.length] = categoryDrilldown;
				}
			}
			// console.log(xCategoriesDrilldown.count);

			for(i = 0; i< data.length; i++){
				if(seriesDataDrillDown){
					var currSeries = seriesDataDrillDown.filter(function(seriesObject){ return seriesObject.name == data[i].group;});
					if(currSeries.length === 0){
						seriesDataDrillDown[seriesDataDrillDown.length] = currSeries = {id:[], name: data[i].group, data: []}; 
					} else {
						currSeries = currSeries[0];
					}
					var index = currSeries.data.length;
					currSeries.data[index] = [data[i].provider_group, data[i].values];
					currSeries.id[index] = data[i].group;

				} else {
					seriesDataDrillDown[0] = {id:[data[i].group], name:data[i].group, data:[data[i].provider_group, data[i].values]}
				}
			}
			// console.log(seriesDataDrillDown[3].data);

			for(i=0; i<data.length; i++){
				category = data[i].group;
				if(xCategories.indexOf(category) === -1){;
					xCategories[xCategories.length] = category;
				}
			}
			// console.log(xCategories)
			for(i = 0; i< data.length; i++){
				if(seriesData){
					var currSeries = seriesData.filter(function(seriesObject){ return seriesObject.name == data[i].provider_group;});
					if(currSeries.length === 0){
						seriesData[seriesData.length] = currSeries = {name: data[i].provider_group, data: [], y:[], drilldown: []};
					} else {
						currSeries = currSeries[0];
					}
					var index = currSeries.data.length;
					currSeries.data[index] = data[i].values;
					currSeries.y[index] = data[i].values;
					currSeries.drilldown[index] = data[i].group;
				} else {
					seriesData[0] = {name:data[i].provider_group, y:[data[i].values], drilldown:data[i].group}
				}
			} 
			// console.log(seriesData[0].name);
			// console.log(seriesData[0].data);
			// console.log(seriesData);
			// console.log(data);

			// console.log(xCategories);
			Highcharts.setOptions({
				lang:{
					drillUpText: '< Back {series.name}'
				}
			})
			$('#crm_case_aging').highcharts({
				chart:{
					type: 'column'
				},
				title:{
					text: 'CRM Case By Provider Group'
				},
				xAxis: {
					type: 'category',
					labels: {
						overflow: 'justify',
						rotation: -60, 
						align: 'right', 
						style: { 
							fontSize: '9px', 
							fontFamily: 'Verdana, sans-serif' 
						},
						useHTML : true
					}
				},
				legend: {
					enabled: false
				},
				plotOptions: {
					series :{
						borderWidth:0,
						dataLabels:{
							enabled: true,
						},
						stacking:'normal'
					}
				},
				drilldown:{
					colorByPoint: true,
					series: [{
						id:'0-10',
						name:'0-10',
						data:seriesDataDrillDown[0].data 
					},{
						id:'11-30',
						name:'11-30',
						data:seriesDataDrillDown[1].data
					},{
						id:'31-60',
						name:'31-60',
						data:seriesDataDrillDown[2].data
					},{
						id:'61+',
						name:'61+',
						data:seriesDataDrillDown[3].data
					}]
				},
				
				// tooltip: {
				// 	formatter: function() {
				// 		return '<b>'+ this.x +'</b><br/>'+
				// 		this.series.name +': '+ this.y +'<br/>';
				// 		// +
				// 		// 'Total: '+ this.point.stackTotal;
				// 	}
				// },
				
				series: [{
					colorByPoint: true,
					data:[{
						name: '0-10',
						y: 859,
						drilldown : '0-10'
					},{
						name: '11-30',
						y: 334,
						drilldown : '11-30'
					},{
						name: '31-60',
						y: 137,
						drilldown : '31-60'
					},{
						name: '61+',
						y: 124,
						drilldown : '61+'
					}]
					
				}]
			});
			// $('#crm_case_aging_2').highcharts({
			// 	chart:{
			// 		type: 'column'
			// 	},
			// 	title:{
			// 		text: 'CRM Case By Age'
			// 	},
			// 	xAxis: {
			// 		categories: xCategories,
			// 		labels: { 
			// 			rotation: -60, 
			// 			align: 'right', 
			// 			style: { 
			// 				fontSize: '13px', 
			// 				fontFamily: 'Verdana, sans-serif' 
			// 			} 
			// 		}
			// 	},
			// 	drilldown: seriesData,
			// 	yAxis:{
			// 		// min:0, max:1000,tickInterval: 100,
			// 		title:{
			// 			text: 'Values'
			// 		},
			// 		stackLabels: {
			// 			enabled: true,
			// 			style: {
			// 				fontWeight: 'bold',
			// 				color: (Highcharts.theme && Highcharts.theme.textColor || 'gray')
			// 			}
			// 		}
			// 	},
			// 	legend: {
			// 		layout: 'vertical',
			// 		align: 'right',
			// 		verticalAlign: 'middle',
			// 		// x: -100,
			// 		// y: 20,
			// 		// shadow: true,
			// 		backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
			// 	},
			// 	tooltip: {
			// 		formatter: function() {
			// 			return '<b>'+ this.x +'</b><br/>'+
			// 			this.series.name +': '+ this.y +'<br/>'+
			// 			'Total: '+ this.point.stackTotal;
			// 		}
			// 	},
			// 	plotOptions: {
			// 		series :{
			// 			dataLabels:{
			// 				enabled: false,
			// 				style:{
			// 					color: 'white',
			// 					textShadow:'0 0 2px black, 0 0 2px black'
			// 				}
			// 			},
			// 			stacking:'normal'
			// 		}
			// 	},
			// 	series: seriesData,
			// });
		});
	});


	// Charts For SINQ ERROR RATES
	$http.get('/metricdashboard/get_sinq_error_rates').success(function(data) {
		$scope.sinq_error_rates = data.sinq_error_rates;
		$scope.group_processor = [];
		$scope.number_of_sinq_errors = [];
		$scope.min_fail_count =[];
		$scope.avg_fail_count = [];
		$scope.max_fail_count= [];

		for (var i=0; i< $scope.sinq_error_rates.length; i++) {
			$scope.group_processor.push($scope.sinq_error_rates[i].group_processor);
			$scope.number_of_sinq_errors.push($scope.sinq_error_rates[i].number_of_sinq_errors);
			$scope.min_fail_count.push($scope.sinq_error_rates[i].min_fail_count);
			$scope.avg_fail_count.push($scope.sinq_error_rates[i].avg_fail_count);
			$scope.max_fail_count.push($scope.sinq_error_rates[i].max_fail_count);
		};
		var groupProcessor = $scope.group_processor;
		var numberOfSinqErrors = $scope.number_of_sinq_errors;
		var minFailCount = $scope.min_fail_count;
		var avgFailCount = $scope.avg_fail_count;
		var maxFailCount = $scope.max_fail_count;

		$(function() {
			$('#sinq_errors').highcharts({
				title: {
					text: 'SINQ Error Rates',
					x: -20 //center	
				},
				subtitle: {
					text: 'Source: Mongodb',
					x: -20
				},
				xAxis: {
					categories: groupProcessor,
					labels: { 
						rotation: -60, 
						align: 'right', 
						style: { 
							fontSize: '13px', 
							fontFamily: 'Verdana, sans-serif' 
						} 
					}
				},
				yAxis: {
					// min:0, max:400,tickInterval: 50,
					stackLabels:{
						enabled: true,
						style:{
							fontWeight: 'bold',
							color:(Highcharts.theme && Highcharts.theme.textColor) || 'grey'
						}
					}	
				},
				tooltip: {
					crosshairs: true,
					shared: true
				},
				plotOptions: {
					area: {
						fillOpacity: 0.1
					}
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle',
					borderWidth: 0,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				plotOptions:{
					column:{
						stacking:'normal',
						// dataLabels:{
						// 	enabled: true,
						// 	color: (Highcharts.theme && Highcharts.theme.dataLabelColor) || 'white',
						// 	style:{
						// 		textShadow: '0 0 3px black, 0 0 3px black'
						// 	}
						// }
					}
				},
				series: [ {
					type: 'column',
					name: 'Max Fail Count',
					data: JSON.parse("[" + maxFailCount + "]"),
					dashStyle: 'shortDash'
				}, {
					type: 'column',
					name: 'Avg Fail Count',
					data: JSON.parse("[" + avgFailCount + "]")
				},{
					type: 'column',
					name: 'Min Fail Count',
					data: JSON.parse("[" + minFailCount + "]")
				}, {
					type: 'column',
					name: 'Number of SINQ Errors',
					data: JSON.parse("[" + numberOfSinqErrors + "]")
				}]
			})
		})
	});

	$http.get('/metricdashboard/get_fncs_recruit_list').success(function(data){
		$scope.fncs_recruit_list = data.fncs_recruit_list;
		var Organization = [];
		var i, filteredOrganization;

		for (i=0; i< $scope.fncs_recruit_list.length; i++) {
			filteredOrganization = $scope.fncs_recruit_list[i].organization;
			if(Organization.indexOf(filteredOrganization) === -1){
				Organization[Organization.length] = filteredOrganization;
			}
		};
		// console.log(Organization);
		// console.log(Organization.length);
	});
}

//_________________<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< PIVIT TABLE CONTROLLER>>>>>>>>>>>>>>>>>>>>>>>>>____________________

// function PivotTableCtrl($scope, $http, $cookieStore, $location, $routeParams, $route, $resource) {

// };


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

function MetricUploadCtrl($scope, $http, $cookieStore, $location, $routeParams, $route, $rootScope, $resource) {
	$rootScope.tabClick = function ($event) {
		$event.preventDefault();
	}


	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	
	$scope.showContent = function($fileContent){
		$scope.content = $fileContent;
		$scope.jsonData = $.csv.toObjects($fileContent);
		$scope.jsonContent = $scope.jsonData;
		
		// console.log($scope.jsonData);
		
		for (var i=0; i< $scope.jsonData.length; i++) {
			$scope.Sla_level = $scope.jsonData[i].Sla_level;
			$scope.Week = $scope.jsonData[i].Week;
			console.log($scope.Week);
			$scope.Current_year = $scope.jsonData[i].Current_year;
			$scope.Last_year = $scope.jsonData[i].Last_year;
			$scope.Sla_low_range = $scope.jsonData[i].Sla_low_range;
			$scope.Sla_high_range = $scope.jsonData[i].Sla_high_range;

			var store_operational_Data = "sla_level=" + $scope.Sla_level 
										+ "&week=" + $scope.Week
										+ "&current_year=" + $scope.Current_year
										+ "&last_year=" + $scope.Last_year + "&sla_low_range=" + $scope.Sla_low_range
										+ "&sla_high_range=" + $scope.Sla_high_range;

			$http.post('/metricdashboard/store_operational_sla', store_operational_Data, config).success(function(data) {
			});
		};
	};

	$scope.complete = function(content) {
		$location.path("charts_sla");
	};
};

//______________Tracker Requests by Period Upload CONTROLLER___________________

function TrackerRequestUploadCtrl($scope, $http, $cookieStore, $location, $routeParams, $route, $resource) {
	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	$scope.showContent = function($fileContent){
		$scope.content = $fileContent;
		$scope.jsonData = $.csv.toObjects($fileContent);
		$scope.jsonContent = $scope.jsonData;
		
		// console.log($scope.jsonData);
		
		for (var i=0; i< $scope.jsonData.length; i++) {
			$scope.PayPeriod = $scope.jsonData[i].PayPeriod;
			$scope.HistroicalIncoming = $scope.jsonData[i].HistoricalIncoming;
			$scope.RemainedOpen = $scope.jsonData[i].RemainedOpen;
			$scope.Incoming = $scope.jsonData[i].Incoming;
			$scope.Outgoing = $scope.jsonData[i].Outgoing;

			var  store_tracker_request_Data = "pay_period=" + $scope.PayPeriod
										+ "&histroical_incoming=" + $scope.HistroicalIncoming
										+ "&remained_open=" + $scope.RemainedOpen
										+ "&incoming=" + $scope.Incoming + "&outgoing=" + $scope.Outgoing;
			console.log(store_tracker_request_Data);

			$http.post('/metricdashboard/store_tracker_request', store_tracker_request_Data, config).success(function(data) {
			});
		};
	};

	$scope.complete = function(content) {
		$location.path("charts_tracker");
	};
};


//______________Col Drilldown Upload CONTROLLER___________________

function ColDrilldownCtrl($scope, $http, $cookieStore, $location, $routeParams, $route, $resource) {
	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	$scope.showContent = function($fileContent){
		$scope.content = $fileContent;
		$scope.jsonData = $.csv.toObjects($fileContent);
		$scope.jsonContent = $scope.jsonData;
		
		// console.log($scope.jsonData);
		
		for (var i=0; i< $scope.jsonData.length; i++) {
			$scope.Team = $scope.jsonData[i].Team;
			$scope.HistroicalIncoming = $scope.jsonData[i].HistoricalIncoming;
			$scope.RemainedOpen = $scope.jsonData[i].RemainedOpen;
			$scope.Incoming = $scope.jsonData[i].Incoming;
			$scope.Outgoing = $scope.jsonData[i].Outgoing;

			var  store_col_drilldown_Data = "team=" + $scope.Team
										+ "&histroical_incoming=" + $scope.HistroicalIncoming
										+ "&remained_open=" + $scope.RemainedOpen
										+ "&incoming=" + $scope.Incoming + "&outgoing=" + $scope.Outgoing;
			console.log(store_col_drilldown_Data);

			$http.post('/metricdashboard/store_col_drilldown', store_col_drilldown_Data, config).success(function(data) {
			});
		};
	};

	$scope.complete = function(content) {
		$location.path("charts_drilldown");
	};
};

//______________Aging Example Upload CONTROLLER___________________

function AgingExampleUploadCtrl($scope, $http, $cookieStore, $location, $routeParams, $route, $resource) {
	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	$scope.showContent = function($fileContent){
		$scope.content = $fileContent;
		$scope.jsonData = $.csv.toObjects($fileContent);
		$scope.jsonContent = $scope.jsonData;
		
		for (var i=0; i< $scope.jsonData.length; i++) {
			$scope.Group = $scope.jsonData[i].Group;
			$scope.TypeOfAction = $scope.jsonData[i].TypeOfAction;
			$scope.Values = $scope.jsonData[i].Values;

			var  store_aging_example_Data = "type_of_action=" + $scope.TypeOfAction
										+ "&group=" + $scope.Group
										+ "&values=" + $scope.Values;
										
			console.log(store_aging_example_Data);

			$http.post('/metricdashboard/store_aging_example', store_aging_example_Data, config).success(function(data) {
			});
		};
	};

	$scope.complete = function(content) {
		$location.path("charts_aging");
	};
};


//______________CRM Case Aging Upload CONTROLLER___________________

function CrmCaseUploadCtrl($scope, $http, $cookieStore, $location, $routeParams, $route, $resource) {
	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	$scope.showContent = function($fileContent){
		$scope.content = $fileContent;
		$scope.jsonData = $.csv.toObjects($fileContent);
		$scope.jsonContent = $scope.jsonData;
		
		// console.log($scope.jsonData);
		
		for (var i=0; i< $scope.jsonData.length; i++) {
			$scope.Group = $scope.jsonData[i].Group;
			$scope.ProviderGroup = $scope.jsonData[i].ProviderGroup;
			$scope.Values = $scope.jsonData[i].Values;

			var  store_crm_case_aging_Data = "provider_group=" + $scope.ProviderGroup
										+ "&group=" + $scope.Group
										+ "&values=" + $scope.Values;
			console.log(store_crm_case_aging_Data);

			$http.post('/metricdashboard/store_crm_case_aging', store_crm_case_aging_Data, config).success(function(data) {
			});
		};
	};

	$scope.complete = function(content) {
		$location.path("charts_crm_case");
	};
};


//______________SINQ Errors Upload CONTROLLER___________________

function SinqErrorsUploadCtrl($scope, $http, $cookieStore, $location, $routeParams, $route, $resource) {
	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	$scope.showContent = function($fileContent){
		$scope.content = $fileContent;
		$scope.jsonData = $.csv.toObjects($fileContent);
		$scope.jsonContent = $scope.jsonData;
		
		// console.log($scope.jsonData);
		
		for (var i=0; i< $scope.jsonData.length; i++) {
			$scope.GroupProcessor = $scope.jsonData[i].GroupProcessor;
			$scope.NumberOfSinqErrors = $scope.jsonData[i].NumberOfSinqErrors;
			$scope.MinFailCount = $scope.jsonData[i].MinFailCount;
			$scope.AvgFailCount = $scope.jsonData[i].AvgFailCount;
			$scope.MaxFailCount = $scope.jsonData[i].MaxFailCount;

			var  store_sinq_error_rates_Data = "group_processor=" + $scope.GroupProcessor
										+ "&number_of_sinq_errors=" + $scope.NumberOfSinqErrors
										+ "&min_fail_count=" + $scope.MinFailCount
										+ "&avg_fail_count=" + $scope.AvgFailCount + "&max_fail_count=" + $scope.MaxFailCount;
			console.log(store_sinq_error_rates_Data);

			$http.post('/metricdashboard/store_sinq_error_rates', store_sinq_error_rates_Data, config).success(function(data) {
			});
		};
	};

	$scope.complete = function(content) {
		$location.path("charts_sinq_errors");
	};
};

//______________fncs_master_recruit_list Upload CONTROLLER___________________

function FncsRecruitListUploadCtrl($scope, $http, $cookieStore, $location, $routeParams, $route, $resource) {
	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	$scope.showContent = function($fileContent){
		$scope.content = $fileContent;
		$scope.jsonData = $.csv.toObjects($fileContent);
		$scope.jsonContent = $scope.jsonData;
		
		// console.log($scope.jsonData);
		
		for (var i=0; i< $scope.jsonData.length; i++) {
			$scope.CurrentStatusMilestone = $scope.jsonData[i].CurrentStatusMilestone;
			$scope.Organization = $scope.jsonData[i].Organization;
			$scope.PointOfContact = $scope.jsonData[i].PointOfContact;
			$scope.PositionTitle = $scope.jsonData[i].PositionTitle;
			$scope.SecPriority = $scope.jsonData[i].SecPriority;
			$scope.SF52Number = $scope.jsonData[i].SF52Number;
			$scope.NumberOfRecords = $scope.jsonData[i].NumberOfRecords;


			// $scope.HiringTrackingID = $scope.jsonData[i].HiringTrackingID;
			// $scope.HRSpeclstAssignedTo = $scope.jsonData[i].HRSpeclstAssignedTo;
			// $scope.SecPriority = $scope.jsonData[i].SecPriority;
			// $scope.Organization = $scope.jsonData[i].Organization;
			// $scope.OrganizationalLocation = $scope.jsonData[i].OrganizationalLocation;
			// $scope.PositionTitle = $scope.jsonData[i].PositionTitle;
			// $scope.PdMr = $scope.jsonData[i].PdMr;
			// $scope.PointOfContact = $scope.jsonData[i].PointOfContact;
			// $scope.Grade = $scope.jsonData[i].Grade;
			// $scope.Status = $scope.jsonData[i].Status;
			// $scope.CurrentStatusMilestone = $scope.jsonData[i].CurrentStatusMilestone;
			// $scope.ETC = $scope.jsonData[i].ETC;
			// $scope.EtcTo915 = $scope.jsonData[i].EtcTo915;
			// $scope.DateGivenToSelectingOfficial = $scope.jsonData[i].DateGivenToSelectingOfficial;
			// $scope.CertExtended = $scope.jsonData[i].CertExtended;
			// $scope.AOC = $scope.jsonData[i].AOC;
			// $scope.Sf52Number = $scope.jsonData[i].Sf52Number;
			// $scope.SelecteeName = $scope.jsonData[i].SelecteeName;


			var  store_fncs_recruit_list_Data = "current_status_milestone=" + $scope.CurrentStatusMilestone + 
										"&organization=" + $scope.Organization +
										"&point_of_contact=" + $scope.PointOfContact + 
										"&position_title=" + $scope.PositionTitle + 
										"&sec_priority=" + $scope.SecPriority +
										"&sf52_number=" + $scope.SF52Number + 
										"&number_of_records=" + $scope.NumberOfRecords;

										// "hiring_tracking_id=" + $scope.HiringTrackingID
										// + "&hr_speclst_assigned_to=" + $scope.HRSpeclstAssignedTo
										// + "&sec_priority=" + $scope.SecPriority 
										// + "&organization=" + $scope.Organization
										// + "&organizational_location=" + $scope.OrganizationalLocation
										// + "&position_title=" + $scope.PositionTitle
										// + "&pd_mr=" + $scope.PdMr
										// + "&point_of_contact=" + $scope.PointOfContact
										// + "&grade=" + $scope.Grade
										// + "&status=" + $scope.Status
										// + "&current_status_milestone=" + $scope.CurrentStatusMilestone
										// + "&etc=" + $scope.ETC
										// + "&etc_to915=" + $scope.EtcTo915
										// + "&date_given_to_selecting_official=" + $scope.DateGivenToSelectingOfficial
										// + "&cert_extended=" + $scope.CertExtended
										// + "&aoc=" + $scope.AOC
										// + "&sf52_number=" + $scope.Sf52Number
										// + "&selectee_name=" + $scope.SelecteeName;
			console.log(store_fncs_recruit_list_Data);

			$http.post('/metricdashboard/store_fncs_recruit_list', store_fncs_recruit_list_Data, config).success(function(data) {
			});
		};
	};

	$scope.complete = function(content) {
		$location.path("#");
	};
};


// Hiring manager upload

function hiringmanagerUploadCtrl($scope, $http, $cookieStore, $location, $routeParams, $route, $resource) {
	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	$scope.showContent = function($fileContent){
		$scope.content = $fileContent;
		$scope.jsonData = $.csv.toObjects($fileContent);
		$scope.jsonContent = $scope.jsonData;
		
		for (var i=0; i< $scope.jsonData.length; i++) {
			$scope.CurrentStatusMilestone = $scope.jsonData[i].CurrentStatusMilestone;
			$scope.Organization = $scope.jsonData[i].Organization;
			$scope.PointOfContact = $scope.jsonData[i].PointOfContact;
			$scope.PositionTitle = $scope.jsonData[i].PositionTitle;
			$scope.SF52Number = $scope.jsonData[i].SF52Number;
			$scope.NumberOfRecords = $scope.jsonData[i].NumberOfRecords;

			var  store_hiring_manager_Data = "current_status_milestone=" + $scope.CurrentStatusMilestone + 
										"&organization=" + $scope.Organization +
										"&point_of_contact=" + $scope.PointOfContact + 
										"&position_title=" + $scope.PositionTitle + 
										"&sf52_number=" + $scope.SF52Number + 
										"&number_of_records=" + $scope.NumberOfRecords;

			console.log(store_hiring_manager_Data);

			$http.post('/metricdashboard/store_hiring_manager', store_hiring_manager_Data, config).success(function(data) {
			});
		};
	};
	$scope.complete = function(content) {
		$location.path("charts_hiring_manager");
	};
};

// Tentative Offer By Organization upload

function tentativeUploadCtrl($scope, $http, $cookieStore, $location, $routeParams, $route, $resource) {
	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	$scope.showContent = function($fileContent){
		$scope.content = $fileContent;
		$scope.jsonData = $.csv.toObjects($fileContent);
		$scope.jsonContent = $scope.jsonData;
		
		for (var i=0; i< $scope.jsonData.length; i++) {
			$scope.CurrentStatusMilestone = $scope.jsonData[i].CurrentStatusMilestone;
			$scope.Organization = $scope.jsonData[i].Organization;
			$scope.PointOfContact = $scope.jsonData[i].PointOfContact;
			$scope.PositionTitle = $scope.jsonData[i].PositionTitle;
			$scope.SF52Number = $scope.jsonData[i].SF52Number;
			$scope.NumberOfRecords = $scope.jsonData[i].NumberOfRecords;

			var  store_tentative_Data = "current_status_milestone=" + $scope.CurrentStatusMilestone + 
										"&organization=" + $scope.Organization +
										"&point_of_contact=" + $scope.PointOfContact + 
										"&position_title=" + $scope.PositionTitle + 
										"&sf52_number=" + $scope.SF52Number + 
										"&number_of_records=" + $scope.NumberOfRecords;
			
			console.log(store_tentative_Data);

			$http.post('/metricdashboard/store_tentative', store_tentative_Data, config).success(function(data) {
			});
		};
	};
	$scope.complete = function(content) {
		$location.path("charts_tentative");
	};
};

// Inventory By Organization upload

function inventory_orgUploadCtrl($scope, $http, $cookieStore, $location, $routeParams, $route, $resource) {
	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	$scope.showContent = function($fileContent){
		$scope.content = $fileContent;
		$scope.jsonData = $.csv.toObjects($fileContent);
		$scope.jsonContent = $scope.jsonData;
		
		for (var i=0; i< $scope.jsonData.length; i++) {
			$scope.CurrentStatusMilestone = $scope.jsonData[i].CurrentStatusMilestone;
			$scope.Organization = $scope.jsonData[i].Organization;
			$scope.PointOfContact = $scope.jsonData[i].PointOfContact;
			$scope.PositionTitle = $scope.jsonData[i].PositionTitle;
			$scope.SF52Number = $scope.jsonData[i].SF52Number;
			$scope.NumberOfRecords = $scope.jsonData[i].NumberOfRecords;

			var  store_inventory_org_Data = "current_status_milestone=" + $scope.CurrentStatusMilestone + 
										"&organization=" + $scope.Organization +
										"&point_of_contact=" + $scope.PointOfContact + 
										"&position_title=" + $scope.PositionTitle + 
										"&sf52_number=" + $scope.SF52Number + 
										"&number_of_records=" + $scope.NumberOfRecords;
			
			console.log(store_inventory_org_Data);

			$http.post('/metricdashboard/store_inventory_org', store_inventory_org_Data, config).success(function(data) {
			});
		};
	};
	$scope.complete = function(content) {
		$location.path("charts_inventory_org");
	};
};



// Tentative Offer By Organization upload

function inventory_opmUploadCtrl($scope, $http, $cookieStore, $location, $routeParams, $route, $resource) {
	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	$scope.showContent = function($fileContent){
		$scope.content = $fileContent;
		$scope.jsonData = $.csv.toObjects($fileContent);
		$scope.jsonContent = $scope.jsonData;
		
		for (var i=0; i< $scope.jsonData.length; i++) {
			$scope.CurrentStatus = $scope.jsonData[i].CurrentStatus;
			$scope.Records = $scope.jsonData[i].Records;

			var  store_inventory_opm_Data = "current_status=" + $scope.CurrentStatus + "&records=" + $scope.Records;
			
			console.log(store_inventory_opm_Data);

			$http.post('/metricdashboard/store_inventory_opm', store_inventory_opm_Data, config).success(function(data) {
			});
		};
	};
	$scope.complete = function(content) {
		$location.path("charts_inventory_opm");
	};
};




//______________HighMaps CONTROLLER___________________

function MapsCtrl($scope, $http, $location, $routeParams, $rootScope) { 


	$(function () {
		/*
		* Highcharts paths for US states. Parsed from http://commons.wikimedia.org/wiki/File:Blank_US_Map.svg
		*/
		Highcharts.maps.us = [{
			code: "r 10",
			path: "M158,453.6L157.7,539L159.3,540L162.4,540.1L163.8,539L166.4,539L166.6,541.9L173.5,548.7L174,551.3L177.4,549.3L178.1,549.2L178.4,546.1L179.9,544.5L181,544.3L182.9,542.9L186,545L186.6,547.9L188.6,549L189.7,551.4L193.6,553.2L197,559.2L199.7,563.1L202,565.8L203.5,569.5L208.5,571.3L213.6,573.4L214.6,577.8L215.1,580.9L214.1,584.2L212.3,586.5L210.7,585.7L209.3,582.6L206.5,581.2L204.7,580L203.9,580.9L205.4,583.6L205.6,587.3L204.4,587.8L202.5,585.9L200.4,584.6L200.9,586.2L202.2,588L201.4,588.8 C 201.4,588.8 200.5,588.5 200.1,587.8 C 199.6,587.2 198,584.4 198,584.4L197,582.1 C 197,582.1 196.7,583.4 196,583.1 C 195.4,582.8 194.7,581.7 194.7,581.7L196.5,579.7L195,578.3L195,573.3L194.2,573.3L193.4,576.6L192.3,577.1L191.3,573.4L190.7,569.7L189.9,569.2L190.2,574.9L190.2,576L188.7,574.7L185.2,568.7L183.1,568.2L182.4,564.5L180.8,561.6L179.2,560.5L179.2,558.2L181.3,556.9L180.8,556.6L178.2,557.2L174.8,554.8L172.3,551.9L167.4,549.3L163.4,546.7L164.7,543.5L164.7,541.9L162.9,543.5L160,544.6L156.2,543.5L150.6,541.1L145.1,541.1L144.4,541.6L138,537.7L135.9,537.4L133.1,531.5L129.6,531.9L126,533.3L126.5,537.9L127.6,534.9L128.6,535.3L127.1,539.6L130.4,536.9L131,538.5L127.1,542.9L125.9,542.5L125.4,540.6L124.1,539.8L122.8,540.9L120,539.1L117,541.2L115.2,543.3L111.8,545.4L107.1,545.3L106.6,543.2L110.3,542.5L110.3,541.2L108.1,540.6L109,538.2L111.3,534.3L111.3,532.5L111.5,531.7L115.8,529.4L116.8,530.7L119.6,530.7L118.3,528.2L114.5,527.8L109.5,530.6L107.1,534L105.3,536.6L104.2,538.8L100,540.3L96.9,542.9L96.6,544.5L98.9,545.4L99.7,547.6L96.9,550.8L90.5,555L82.7,559.2L80.6,560.3L75.3,561.5L69.9,563.7L71.7,565L70.2,566.5L69.8,567.6L67,566.6L63.8,566.8L63,569.1L62,569.1L62.3,566.6L58.8,567.9L55.9,568.9L52.5,567.6L49.6,569.5L46.3,569.5L44.2,570.8L42.6,571.6L40.5,571.3L37.9,570.2L35.6,570.8L34.7,571.8L33.1,570.7L33.1,568.7L36.1,567.4L42.4,568.1L46.8,566.5L48.9,564.4L51.8,563.7L53.6,562.9L56.3,563.1L58,564.4L58.9,564L61.2,561.3L64.3,560.3L67.7,559.7L69,559.4L69.6,559.8L70.4,559.8L71.7,556.1L75.7,554.7L77.7,550.9L79.9,546.4L81.6,545L81.9,542.4L80.3,543.7L76.9,544.3L76.2,541.9L74.9,541.6L74,542.5L73.8,545.4L72.3,545.3L70.9,539.5L69.6,540.8L68.5,540.3L68.1,538.3L64.1,538.5L62,539.6L59.4,539.3L60.9,537.9L61.4,535.3L60.7,533.3L62.2,532.4L63.5,532.2L62.8,530.4L62.8,526L61.8,525.1L61,526.5L54.9,526.5L53.4,525.2L52.8,521.4L50.7,517.8L50.7,516.8L52.8,516L52.9,513.9L54.1,512.8L53.3,512.3L52,512.8L50.8,510L51.8,505L56.3,501.8L58.9,500.2L60.9,496.5L63.6,495.2L66.2,496.3L66.5,498.7L69,498.4L72.2,496L73.8,496.6L74.8,497.3L76.4,497.3L78.7,496L79.5,491.6 C 79.5,491.6 79.8,488.7 80.4,488.2 C 81.1,487.7 81.4,487.3 81.4,487.3L80.3,485.3L77.7,486.1L74.4,486.9L72.5,486.4L69,484.7L63.9,484.5L60.4,480.8L60.9,476.9L61.5,474.5L59.4,472.7L57.5,469L58,468.2L64.7,467.7L66.8,467.7L67.8,468.7L68.5,468.7L68.3,467L72.2,466.4L74.8,466.7L76.2,467.9L74.8,470L74.3,471.4L77,473L82,474.8L83.8,473.8L81.6,469.5L80.6,466.2L81.6,465.4L78.2,463.5L77.7,462.4L78.2,460.7L77.4,456.9L74.4,452.2L72,448L74.9,446L78.2,446L79.9,446.7L84.1,446.5L87.9,443L89,439.9L92.7,437.5L94.3,438.4L97.1,437.8L100.8,435.7L101.9,435.5L102.9,436.3L107.4,436.2L110.2,433.1L111.3,433.1L114.9,435.5L116.8,437.6L116.3,438.8L117,439.9L118.6,438.3L122.5,438.6L122.8,442.3L124.7,443.8L131.8,444.4L138.1,448.6L139.6,447.6L144.8,450.2L146.9,449.6L148.8,448.8L153.7,450.7L158,453.6zM42.9,482.6L45,487.9L44.9,488.9L42,488.5L40.2,484.5L38.4,483L36,483L35.8,480.5L37.6,478L38.7,480.5L40.2,481.9L42.9,482.6zM40.3,516L44.1,516.8L47.8,517.8L48.6,518.8L47,522.5L43.9,522.3L40.5,518.8L40.3,516zM19.6,502L20.8,504.5L21.9,506.2L20.8,507L18.7,503.9L18.7,502L19.6,502zM5.9,575L9.3,572.8L12.7,571.8L15.3,572.1L15.8,573.7L17.7,574.2L19.6,572.3L19.3,570.7L22.1,570L25,572.6L23.8,574.4L19.5,575.5L16.7,575L13,573.9L8.7,575.4L7,575.7L5.9,575zM54.9,570.5L56.5,572.4L58.6,570.8L57.2,569.5L54.9,570.5zM57.8,573.6L58.9,571.3L61,571.6L60.2,573.6L57.8,573.6zM81.4,571.6L82.9,573.4L83.8,572.3L83,570.3L81.4,571.6zM90.1,559.2L91.3,565L94.2,565.8L99.2,562.9L103.5,560.3L101.9,557.9L102.4,555.5L100.3,556.8L97.4,556L99,554.8L101,555.6L104.8,553.9L105.3,552.4L102.9,551.6L103.7,549.7L101,551.6L96.3,555.1L91.4,558.1L90.1,559.2zM132.5,539.3L134.9,537.9L133.9,536.1L132.2,537L132.5,539.3z",
			middleY: 0.4
			}, {
			code: "r 8",
			path: "M593.8,343L589.8,343.7L584.7,343.1L585.1,341.5L588.1,338.9L589,335.3L587.2,332.3L508.8,334.8L510.4,341.7L510.4,349.9L511.8,360.9L512,398.7L514.3,400.6L517.2,399.3L520,400.4L520.7,407L576.3,405.9L577.4,403.8L577.1,400.2L575.3,397.2L576.9,395.8L575.3,393.2L576,390.7L577.4,385.1L579.9,383.1L579.2,380.8L582.9,375.4L585.6,374L585.5,372.5L585.1,370.7L588,365.1L590.4,363.9L590.8,360.4L592.6,359.2L589.4,358.7L588.1,354.7L590.9,352.3L591.4,350.3L592.7,346.3L593.8,343z,M380.3,320.8L363.6,319.5L362.7,330.5L383.2,331.6L415.2,332.9L412.9,357.3L412.5,375.2L412.7,376.8L417,380.4L419.1,381.6L419.8,381.3L420.5,379.3L421.8,381.1L423.9,381.1L423.9,379.7L426.6,381.1L426.2,385L430.3,385.2L432.8,386.4L436.9,387.1L439.4,388.9L441.7,386.8L445.2,387.5L447.7,390.9L448.6,390.9L448.6,393.2L450.9,393.9L453.2,391.6L455,392.3L457.5,392.3L458.4,394.8L464.7,396.9L466.1,396.2L467.9,392.1L469.1,392.1L470.2,394.2L474.3,394.8L478,396.2L480.9,397.1L482.8,396.2L483.5,393.7L487.8,393.7L489.9,394.6L492.6,392.6L493.7,392.6L494.4,394.2L498.5,394.2L500.1,392.1L502,392.6L504,395.1L507.2,396.9L510.4,397.8L512.4,398.9L512,361.7L510.6,350.7L510.5,341.9L509,335.3L508.2,328.2L508.2,324.3L496,324.7L449.6,324.2L404.6,322.1L380.3,320.8z,M361.4,330.5L384.1,331.6L415.2,332.8L412.9,356.2L412.6,374.4L412.6,376.4L417,380.3L419,381.7L420.1,381.1L420.5,379.3L421.7,381.1L423.8,381.2L423.8,379.7L425.4,380.7L426.6,381.1L426.2,385.1L430.3,385.2L433.2,386.4L437.2,386.9L439.6,389L441.7,386.9L445.4,387.5L447.6,390.7L448.7,391.1L448.6,393L450.8,393.8L453.1,391.8L455.2,392.4L457.5,392.4L458.4,394.8L464.7,397L466.3,396.2L467.8,392L468.1,392L469.1,392.1L470.3,394.2L474.2,394.8L477.5,396L481,397.1L482.8,396.2L483.5,393.7L488,393.7L489.8,394.6L492.6,392.5L493.7,392.6L494.5,394.2L498.6,394.2L500.1,392.1L502,392.6L503.9,395L507.5,397L510.3,397.8L511.8,398.6L514.3,400.6L517.3,399.3L520,400.4L520.6,406.5L520.5,416.2L521.2,425.8L521.9,429.4L524.6,433.8L525.5,438.7L529.7,444.3L529.9,447.4L530.6,448.2L529.9,456.6L527,461.6L528.6,463.7L527.9,466.1L527.3,473.5L525.8,476.8L526.1,480.3L520.4,481.9L510.5,486.4L509.6,488.4L507,490.3L504.9,491.8L503.6,492.6L497.9,497.9L495.2,500L489.9,503.3L484.2,505.7L477.9,509.1L476.1,510.5L470.3,514.1L466.9,514.7L463,520.2L459,520.6L458,522.5L460.3,524.4L458.8,529.9L457.5,534.5L456.4,538.3L455.6,542.9L456.4,545.3L458.2,552.2L459.1,558.4L460.9,561.1L459.9,562.6L456.9,564.5L451.2,560.6L445.7,559.5L444.4,560L441.2,559.4L437,556.3L431.8,555.1L424.2,551.8L422.1,547.9L420.8,541.4L417.6,539.5L416.9,537.2L417.6,536.6L417.9,533.2L416.6,532.5L416,531.5L417.3,527.2L415.6,524.9L412.4,523.6L409,519.3L405.5,512.6L401.3,510L401.4,508.1L396.1,495.8L395.3,491.6L393.5,489.7L393.3,488.2L387.4,482.9L384.8,479.8L384.8,478.7L382.2,476.6L375.4,475.4L368,474.8L364.9,472.5L360.4,474.3L356.8,475.8L354.5,479L353.6,482.7L349.2,488.9L346.8,491.3L344.2,490.3L342.4,489.2L340.5,488.5L336.6,486.3L336.6,485.6L334.8,483.7L329.6,481.6L322.2,473.8L319.9,469.1L319.9,461.1L316.7,454.6L316.2,451.8L314.6,450.9L313.5,448.8L308.5,446.7L307.2,445.1L300.1,437.1L298.8,433.9L294.1,431.6L292.6,427.3L290,424.4L288.1,423.9L287.5,419.2L295.5,419.9L324.5,422.6L353.5,424.2L355.8,404.8L359.6,349.2L361.2,330.5L362.6,330.5M461.6,560.2L461.1,553L458.3,545.9L457.8,538.8L459.3,530.6L462.6,523.7L466.1,518.3L469.2,514.7L469.9,515L465.1,521.6L460.8,528.1L458.7,534.8L458.4,540L459.3,546.1L461.9,553.3L462.4,558.5L462.5,559.9L461.6,560.2z,M607.9,459.1L604.6,455.9L605.6,450.4L605,449.6L595.7,450.6L570.7,451L570,448.6L570.9,440.2L574.2,434.2L579.3,425.5L578.7,423.1L579.9,422.5L580.4,420.5L578.1,418.4L578,416.5L576.2,412.2L576,405.8L520.6,406.7L520.6,416.3L521.3,425.7L522,429.6L524.5,433.7L525.4,438.7L529.7,444.2L530,447.4L530.6,448.1L530,456.6L527,461.6L528.6,463.6L527.9,466.2L527.2,473.5L525.8,476.7L526,480.3L530.7,478.8L542.8,479L553.1,482.5L559.6,483.7L563.3,482.2L566.5,483.3L569.8,484.3L570.6,482.2L567.3,481.1L564.8,481.6L562,479.9 C 562,479.9 562.2,478.7 562.8,478.5 C 563.5,478.3 565.9,477.5 565.9,477.5L567.7,479L569.4,478L572.7,478.7L574.1,481.1L574.5,483.3L579,483.7L580.8,485.4L579.9,487.1L578.7,487.9L580.3,489.5L588.7,493L592.2,491.7L593.2,489.3L595.8,488.7L597.6,487.2L598.9,488.2L599.7,491.1L597.4,491.9L598.1,492.6L601.5,491.3L603.7,487.9L604.5,487.4L602.4,487.1L603.2,485.4L603.1,484L605.2,483.5L606.3,482.2L606.9,483 C 606.9,483 606.8,486.1 607.6,486.1 C 608.4,486.1 611.8,486.7 611.8,486.7L615.8,488.7L616.8,490.1L619.7,490.1L620.8,491.1L623.1,488L623.1,486.6L621.8,486.6L618.4,483.8L612.6,483L609.4,480.8L610.5,478L612.8,478.3L612.9,477.7L611.2,476.7L611.2,476.2L614.4,476.2L616.2,473.2L614.9,471.2L614.5,468.5L613.1,468.6L611.2,470.7L610.5,473.3L607.4,472.7L606.5,470.9L608.2,469L610.1,465.5L609.1,463.1L607.9,459.1z,M631.5,459.3L631.3,460.6L626.1,460.6L624.6,459.7L622.5,459.4L615.7,461.4L614,460.6L611.4,464.8L610.3,465.5L609.1,463L608,459.2L604.6,456L605.7,450.4L605,449.5L603.2,449.7L595.3,450.6L570.7,451L570,448.7L570.8,440.4L574,434.7L579.2,425.6L578.7,423.1L580,422.5L580.4,420.5L578.1,418.5L578,416.3L576.1,412.2L576,406.2L577.4,403.8L577.1,400.3L575.4,397.3L576.9,395.8L575.3,393.3L575.8,391.6L577.4,385.1L579.8,383.1L579.2,380.7L582.9,375.4L585.7,374L585.5,372.4L585.2,370.7L588.1,365.1L590.4,363.9L590.6,363L627.9,359.1L628.1,365.4L628.2,382L627.4,413.1L627.3,427.1L630,445.9L631.5,459.3z,M725.9,295.2L723.7,297.6L720.1,301.6L715.1,307.1L713.9,308.8L713.9,310.9L709.5,313.1L703.8,316.5L696.6,318.3L644.7,323.2L629,324.9L624.4,325.4L620.5,325.4L620.3,329.6L612.1,329.8L605.1,330.4L597.1,330.4L598.3,329L600.8,327.5L601.1,324.3L602,322.5L600.4,319.9L601.2,318L603.4,316.3L605.5,315.6L608.3,316.9L611.9,318.2L613,317.9L613.1,315.6L611.9,313.2L612.2,310.9L614.1,309.5L616.7,308.8L618.3,308.2L617.5,306.4L616.9,304.5L618.4,303.5 C 618.4,303.4 619.6,299.9 619.6,299.8L622.7,298.3L628,297.4L632.5,296.9L633.9,298.5L635.4,299.4L637,296.3L640.2,295L642.4,296.5L642.8,297.5L644,297.2L643.8,294.2L646.9,292.5L649.1,291.4L650.6,293.1L653.9,293L654.5,291.5L654.1,289.2L656.7,285.2L661.5,281.8L662.2,276.9L665.2,276.5L668.9,274.8L671.4,273.1L671.2,271.6L670.1,270.1L670.6,267.1L674.8,267L677.1,266.2L680.4,267.7L682.5,272L687.6,272L689.7,274.3L691.3,274.1L693.9,272.8L699.1,273.4L701.7,273.6L703.4,271.6L706,270.1L707.9,269.4L708.5,272.3L710.6,273.3L713.2,275.4L713.4,281.1L714.2,282.7L716.8,284.2L717.5,286.5L721.7,289.9L723.5,293.6L725.9,295.2z,M696.6,318.2L644.7,323.2L629,325L624.4,325.5L620.5,325.5L620.3,329.6L612.1,329.8L605.1,330.5L597,330.4L595.6,337.4L593.9,342.9L590.6,345.7L589.3,350.1L589,352.6L584.9,354.9L586.4,358.5L585.4,362.8L584.4,363.6L692.6,353.2L693,349.2L694.8,347.8L697.6,347L698.3,343.3L702.4,340.6L706.5,339.1L710.5,335.5L715,333.5L715.5,330.4L719.6,326.4L720.1,326.3 C 720.1,326.3 720.1,327.5 721,327.5 C 721.8,327.5 722.9,327.8 722.9,327.8L725.2,324.2L727.2,323.6L729.5,323.9L731.1,320.3L734.1,317.7L734.5,315.8L734.8,312.1L732.6,311.9L730,313.9L723,313.9L704.7,316.3L696.6,318.2z,M631.3,460.4L629.8,446L627,427.3L627.2,413.2L628,382.2L627.8,365.5L628,359.1L672.5,355.5L672.3,357.7L672.5,359.8L673.1,363.2L676.5,371.1L679,381L680.4,387.1L682,392L683.5,398.9L685.6,405.2L688.2,408.6L688.7,412L690.6,412.8L690.8,414.9L689,419.8L688.5,423L688.3,424.9L689.9,429.3L690.3,434.6L689.5,437.1L690.1,437.9L691.6,438.7L691.9,441.6L686.3,441.2L679.5,441.9L654,444.8L643.6,446.2L643.3,449L645.1,450.8L647.7,452.8L648.3,460.7L642.7,463.3L640,463L642.7,461L642.7,460L639.7,454.1L637.4,453.4L635.9,457.8L634.7,460.5L634,460.4L631.3,460.4z,M759.8,439.1L762,446.4L765.8,456.2L771.1,465.5L774.8,471.8L779.7,477.3L783.7,481L785.3,484L784.2,485.3L783.4,486.5L786.3,494L789.2,496.9L791.8,502.2L795.3,508L799.9,516.3L801.2,523.9L801.7,535.9L802.3,537.6L802,541L799.5,542.3L799.9,544.3L799.2,546.2L799.5,548.6L800,550.6L797.3,553.8L794.2,555.3L790.3,555.4L788.9,557L786.5,558L785.2,557.5L784,556.5L783.7,553.6L782.9,550.2L779.5,545.1L775.9,542.8L772.1,542.5L771.3,543.8L768.2,539.4L767.5,535.9L765,531.8L763.2,530.7L761.6,532.8L759.8,532.5L757.7,527.4L754.8,523.6L751.9,518.2L749.3,515.2L745.7,511.4L747.8,509L751.1,503.5L750.9,501.9L746.4,500.9L744.7,501.6L745.1,502.2L747.7,503.2L746.2,507.7L745.4,508.2L743.6,504.2L742.3,499.3L742,496.6L743.5,491.9L743.5,482.3L740.4,478.6L739.1,475.6L733.9,474.3L732,473.6L730.4,471L727,469.4L725.8,466L723.1,465L720.7,461.3L716.5,459.9L713.5,458.4L711,458.4L706.9,459.2L706.8,461.2L707.6,462.1L707.1,463.3L704,463.1L700.3,466.7L696.7,468.6L692.9,468.6L689.6,469.9L689.3,467.1L687.7,465.2L684.8,464.1L683.2,462.6L675.1,458.7L667.5,457L663.1,457.6L657.1,458.1L651.1,460.2L647.7,460.8L647.4,452.8L644.8,450.8L643.1,449L643.4,446L653.6,444.7L679.1,441.8L685.9,441.1L691.3,441.4L693.9,445.3L695.4,446.7L703.5,447.2L714.3,446.6L735.8,445.3L741.3,444.6L746.4,444.8L746.8,447.7L749,448.6L749.3,443.9L747.7,439.8L749,438.3L754.6,438.8L759.8,439.1zM772.3,571.5L774.7,570.9L776,570.6L777.5,568.3L779.8,566.6L781.1,567.1L782.8,567.5L783.2,568.5L779.7,569.7L775.5,571.2L773.2,572.4L772.3,571.5zM785.8,566.5L787,567.5L789.8,565.4L795.1,561.2L798.8,557.4L801.3,550.7L802.3,549L802.5,545.6L801.7,546.1L800.8,548.9L799.3,553.6L796.1,558.8L791.7,563L788.3,565L785.8,566.5z,M672.2,355.5L672.2,357.7L672.4,359.8L673.1,363.2L676.4,371.1L678.9,381L680.3,387.1L681.9,392L683.4,398.9L685.5,405.2L688.1,408.6L688.6,412L690.5,412.8L690.7,414.9L688.9,419.8L688.4,423L688.2,424.9L689.9,429.3L690.2,434.6L689.4,437.1L690,437.9L691.5,438.7L691.7,441.9L693.9,445.2L696.2,447.4L704.1,447.6L714.9,446.9L736.4,445.6L741.9,445L746.4,445L746.6,447.9L749.2,448.7L749.5,444.3L747.9,439.8L749,438.2L754.9,439L759.8,439.3L759.1,433L761.3,423L762.8,418.8L762.3,416.2L765.6,410L765.1,408.6L763.2,409.3L760.6,408L760,405.9L758.7,402.4L756.4,400.3L753.8,399.6L752.2,394.8L749.3,388.4L745.1,386.5L743,384.6L741.7,382L739.6,380L737.3,378.7L735.1,375.8L732,373.6L727.5,371.8L727,370.3L724.5,367.4L724.1,366L720.7,361L717.1,361.1L713.4,358.7L712,357.4L711.6,355.7L712.5,353.7L714.7,352.6L714.1,350.5L672.2,355.5zM764.9,408.1L763.1,409.1L760.5,407.8L759.9,405.7L758.6,402.1L756.3,400L753.7,399.4L752.1,394.5L749.4,388.6L745.2,386.6L743.1,384.7L741.8,382.1L739.7,380.1L737.4,378.9L735.1,375.9L732.1,373.7L727.6,371.9L727.1,370.4L724.6,367.5L724.2,366.1L720.8,360.9L717.4,361.1L713.3,358.6L712,357.4L711.7,355.6L712.5,353.6L714.8,352.7L714.3,350.4L720,348L729.2,343.5L736.9,342.6L753,342.2L755.7,344.1L757.4,347.5L761.7,346.8L774.3,345.4L777.2,346.2L789.8,353.8L799.9,361.9L794.5,367.4L791.9,373.5L791.4,379.8L789.8,380.6L788.7,383.4L786.2,384L784.1,387.6L781.4,390.3L779.1,393.7L777.5,394.5L773.9,397.9L771,398.1L772,401.3L767,406.8L764.9,408.1z,M834.9,294.3L837,299.2L840.6,305.6L843,308.1L843.6,310.3L841.2,310.5L842,311.1L841.7,315.3L839.1,316.6L838.5,318.7L837.2,321.7L833.5,323.3L831,322.9L829.6,322.8L828,321.5L828.3,322.8L828.3,323.8L830.2,323.8L831,325L829.1,331.4L833.3,331.4L833.9,333L836.2,330.7L837.5,330.2L835.6,333.8L832.5,338.6L831.2,338.6L830.1,338.1L827.3,338.8L822.1,341.2L815.7,346.5L812.3,351.2L810.3,357.7L809.9,360.1L805.2,360.6L799.7,362L789.8,353.7L777.2,346.1L774.3,345.3L761.6,346.8L757.4,347.5L755.7,344.3L752.8,342.2L736.3,342.7L729,343.5L720,348L713.8,350.6L692.6,353.2L693.1,349.1L694.9,347.7L697.7,347L698.3,343.3L702.5,340.6L706.4,339.1L710.6,335.6L715,333.5L715.6,330.4L719.5,326.5L720.1,326.3 C 720.1,326.3 720.1,327.5 720.9,327.5 C 721.8,327.5 722.9,327.8 722.9,327.8L725.1,324.2L727.3,323.6L729.5,323.9L731.1,320.4L734,317.8L734.5,315.7L734.7,312L739,312L746.2,311.1L761.9,308.9L777.1,306.8L798.7,302.1L818.7,297.8L829.9,295.4L834.9,294.3zM839.2,327.5L841.8,325L844.9,322.4L846.5,321.7L846.6,319.7L846,313.6L844.5,311.2L843.9,309.4L844.6,309.1L847.4,314.6L847.8,319.1L847.6,322.5L844.2,324L841.4,326.4L840.3,327.6L839.2,327.5z,M831.6,266L831.4,264.1L837.9,261.5L837.1,264.7L834.2,268.5L833.8,273.1L834.3,276.5L832.4,281.5L830.3,283.4L828.8,278.7L829.2,273.3L830.8,269.1L831.6,266zM834.9,294.3L776.8,306.9L739.3,312.2L732.6,311.8L730.1,313.7L722.7,313.9L714.3,314.9L703.4,316.5L713.9,310.9L713.9,308.9L715.4,306.7L726,295.2L729.9,299.7L733.7,300.6L736.2,299.5L738.5,298.2L741,299.5L744.9,298.1L746.8,293.6L749.4,294.1L752.3,292L754.1,292.5L756.9,288.8L757.2,286.7L756.3,285.4L757.3,283.6L762.5,271.3L763.2,265.5L764.4,265L766.6,267.5L770.5,267.2L772.4,259.6L775.2,259L776.3,256.3L778.9,253.9L781.6,248.2L781.7,243.2L791.5,247 C 792.2,247.3 792.4,241.9 792.4,241.9L796,243.5L796.1,246.5L801.9,247.8L804,249L805.7,251L805,254.7L803.1,257.3L803.2,259.3L803.8,261.2L808.7,262.4L813.2,262.5L816.3,263.4L818.2,263.7L818.9,266.8L822.1,267.2L823,268.4L822.5,273.1L823.9,274.2L823.4,276.2L824.7,276.9L824.4,278.3L821.7,278.2L821.8,279.9L824.1,281.4L824.2,282.8L826,284.6L826.5,287.1L823.9,288.5L825.5,290L831.3,288.3L834.9,294.3z"
			}, {
			code: "r 9",
			path: "M874,178.8L870.3,163.9L876.6,162L878.8,164L882.1,168.3L884.8,172.7L881.8,174.3L880.5,174.2L879.4,175.9L876.9,177.9L874,178.8z,M805.8,250.8L803.9,249L802.7,248.3L804.1,246.3L807,248.2L805.8,250.8z,M829.6,188.4L827.3,191.1L827.3,194.2L825.4,197.3L825.2,198.9L826.5,200.2L826.3,202.6L824.1,203.8L824.9,206.5L825,207.6L827.8,208L828.8,210.5L832.3,213L834.7,214.6L834.7,215.4L831.8,218.1L830.1,220.4L828.7,223.1L826.4,224.4L826,226L825.7,227.2L825.1,229.8L826.2,232.1L829.4,235L834.3,237.2L838.3,237.9L838.5,239.3L837.7,240.3L838,243.1L838.8,243.1L840.9,240.6L841.7,235.8L844.5,231.7L847.5,225.3L848.7,219.8L848,218.6L847.9,209.3L846.2,205.9L845.1,206.7L842.4,207L841.9,206.5L843,205.5L845.1,203.6L845.2,202.5L844.8,199.1L845.4,196.3L845.3,194.4L842.4,192.6L837.4,191.4L833.2,190.1L829.6,188.4z,M475.2,128.8L474.7,120.3L472.9,113L471.1,99.5L470.6,89.7L468.8,86.3L467.2,81.2L467.2,70.9L467.9,67L466.1,61.6L496.2,61.6L496.5,53.4L497.2,53.2L499.4,53.7L501.4,54.5L502.2,60L503.6,66.2L505.2,67.8L510.1,67.8L510.4,69.2L516.7,69.6L516.7,71.7L521.6,71.7L521.9,70.4L523,69.2L525.3,68.6L526.6,69.6L529.5,69.6L533.4,72.1L538.7,74.6L541.1,75L541.6,74.1L543.1,73.6L543.5,76.5L546.1,77.8L546.6,77.3L547.9,77.5L547.9,79.6L550.5,80.5L553.6,80.5L555.2,79.7L558.4,76.5L561,76L561.8,77.8L562.3,79.1L563.3,79.1L564.2,78.3L573.1,78L574.9,81L575.6,81L576.3,79.9L580.7,79.6L580.1,81.9L576.2,83.7L566.9,87.8L562.1,89.8L559.1,92.3L556.6,95.9L554.4,99.8L552.6,100.6L548.1,105.6L546.8,105.8L542.5,108.5L540,111.7L539.8,114.9L539.9,123L538.5,124.6L533.4,128.4L531.2,134.4L534,136.6L534.7,139.9L532.9,143.1L533,146.8L533.4,153.6L536.4,156.6L539.8,156.6L541.7,159.7L545,160.2L548.9,165.9L556,170L558.1,172.9L558.8,179.3L477.6,180.5L477.2,144.8L476.8,141.8L472.7,138.4L471.5,136.5L471.5,134.9L473.6,133.3L475,132L475.2,128.8z,M615,197.3L614.9,194.2L613.8,189.6L613.1,183.5L612,181.1L613,178L613.8,175.1L615.2,172.5L614.6,169.1L613.9,165.5L614.4,163.8L616.4,161.3L616.5,158.6L615.7,157.3L616.4,154.7L615.9,150.5L618.7,144.9L621.6,138.1L621.7,135.8L621.4,134.9L620.6,135.3L616.4,141.7L613.6,145.7L611.7,147.5L610.9,149.7L608.9,150.5L607.8,152.5L606.4,152.2L606.2,150.4L607.5,148L609.6,143.3L611.4,141.7L612.4,139.3L609.8,137.4L607.8,127L604.3,125.7L602.3,123.4L590.2,120.7L587.3,119.6L579.1,117.5L571.2,116.3L567.4,111.2L566.7,111.7L565.5,111.6L564.8,110.4L563.5,110.7L562.4,110.9L560.6,111.9L559.6,111.2L560.3,109.3L562.2,106.2L563.3,105.1L561.4,103.6L559.3,104.4L556.4,106.4L548.9,109.6L546,110.3L543.1,109.8L542.1,108.9L540,111.7L539.8,114.5L539.8,122.9L538.7,124.5L533.4,128.4L531.1,134.4L531.6,134.6L534.1,136.7L534.8,139.9L532.9,143.1L532.9,146.9L533.4,153.6L536.4,156.5L539.8,156.5L541.6,159.7L545.1,160.2L548.9,165.9L556,170L558.1,172.8L559,180.2L559.7,183.5L562,185.1L562.2,186.5L560.1,189.9L560.4,193.1L562.9,197L565.4,198.2L568.4,198.6L569.7,200L615,197.3z,M569.1,199.5L569.4,202.3L571.6,202.9L572.6,204.1L573.1,206L576.9,209.3L577.6,211.7L576.9,215.2L575.3,218.4L574.5,221.1L572.3,222.7L570.6,223.3L565,225.2L563.6,229L564.4,230.4L566.2,232.1L565.9,236.1L564.2,237.6L563.4,239.3L563.5,242.1L561.6,242.5L560,243.6L559.7,245L560,247.1L558.5,248.2L556,245.1L554.7,242.6L489,245.1L488.1,245.3L486,240.8L485.8,234.2L484.2,230L483.5,224.8L481.2,221.1L480.3,216.3L477.6,208.8L476.4,203.4L475.1,201.2L473.5,198.5L475.4,193.6L476.8,187.9L474,185.9L473.6,183.1L474.5,180.6L476.2,180.6L558.9,179.3L559.7,183.5L561.9,185.1L562.2,186.5L560.2,189.9L560.4,193.1L562.9,196.9L565.4,198.2L568.5,198.7L569.1,199.5z,M558.4,248.1L555.9,245L554.7,242.7L490.4,245.1L488.1,245.2L489.3,247.7L489.1,250L491.6,253.9L494.7,258L497.8,260.8L500,261L501.5,261.9L501.5,264.9L499.6,266.5L499.2,268.8L501.2,272.2L503.7,275.2L506.3,277L507.6,288.6L507.9,324.7L508.2,329.4L508.6,334.8L531.1,333.9L554.3,333.2L575.1,332.4L586.7,332.2L588.9,335.6L588.2,338.9L585.1,341.3L584.6,343.2L589.9,343.6L593.8,342.9L595.5,337.5L596.2,331.6L598.3,329L600.9,327.6L600.9,324.5L602,322.6L600.3,320L598.9,321L596.9,318.8L595.7,314L596.5,311.5L594.5,308.1L592.7,303.5L587.9,302.7L580.9,297.1L579.2,293L580,289.8L582.1,283.7L582.5,280.9L580.6,279.8L573.7,279L572.7,277.3L572.6,273.1L567.1,269.7L560.1,261.9L557.8,254.6L557.6,250.4L558.4,248.1z,M619.5,300.3L619.5,297.1L620.1,292.4L622.4,289.5L624.3,285.4L626.5,281.4L626.2,276.2L624.1,272.6L624,269.3L624.7,264L623.9,256.8L622.9,241.1L621.6,226L620.6,214.4L620.4,213.5L619.6,210.9L618.3,207.2L616.6,205.4L615.2,202.8L615,197.3L569.2,199.9L569.4,202.3L571.7,203L572.6,204.1L573,206L576.9,209.4L577.6,211.7L576.9,215.1L575.1,218.8L574.4,221.3L572.1,223.1L570.3,223.8L565,225.2L564.4,227L563.7,229L564.4,230.4L566.2,232L566,236.1L564.1,237.7L563.4,239.3L563.4,242.1L561.6,242.5L560,243.7L559.8,245L560,247.1L558.3,248.4L557.3,251.2L557.7,254.9L560,262.2L567.3,269.7L572.8,273.4L572.6,277.7L573.5,279.1L579.9,279.6L582.6,280.9L582,284.6L579.7,290.5L579,293.7L581.3,297.6L587.7,302.9L592.3,303.6L594.3,308.6L596.4,311.8L595.5,314.8L597.1,318.9L598.9,321L600.3,320.1L601.2,318L603.4,316.2L605.5,315.6L608.2,316.8L611.8,318.2L613,317.9L613.2,315.6L611.9,313.2L612.2,310.8L614,309.5L617,308.7L618.3,308.2L617.7,306.8L616.9,304.5L618.3,303.5L619.5,300.3z,M619.5,299.9L619.6,297.1L620.1,292.5L622.3,289.6L624.1,285.7L626.7,281.5L626.2,275.7L624.4,273L624.1,269.7L624.9,264.2L624.4,257.3L623.1,241.3L621.8,225.9L620.9,214.2L623.9,215.1L625.4,216.1L626.5,215.7L628.6,213.8L631.5,212.2L636.6,212L658.5,209.8L664.1,209.2L665.6,225.2L669.9,262L670.5,267.8L670.1,270.1L671.3,271.9L671.4,273.2L668.9,274.8L665.4,276.4L662.2,276.9L661.6,281.8L657,285.1L654.2,289.1L654.5,291.5L653.9,293L650.6,293L649,291.4L646.5,292.7L643.8,294.2L644,297.2L642.8,297.5L642.3,296.5L640.2,295L636.9,296.3L635.4,299.3L633.9,298.5L632.5,296.9L628,297.4L622.4,298.4L619.5,299.9z,M735.3,193.3L729.2,197.3L725.3,199.6L721.9,203.3L717.9,207.2L714.6,208L711.7,208.5L706.2,211.1L704.1,211.2L700.7,208.2L695.6,208.8L693,207.4L690.6,206L685.7,206.7L675.5,208.3L664.3,210.5L665.6,225.1L667.4,238.9L670,262.3L670.5,267.2L674.7,267L677.1,266.2L680.4,267.7L682.5,272.1L687.6,272.1L689.5,274.2L691.3,274.1L693.8,272.8L696.3,273.1L701.8,273.6L703.5,271.5L705.8,270.2L707.9,269.5L708.6,272.3L710.3,273.2L713.8,275.6L716,275.5L717.3,275L717.5,272.3L719.1,270.8L719.2,266 C 719.2,266 720.2,261.9 720.2,261.9L721.5,261.3L722.8,262.4L723.4,264.1L725.1,263.1L725.5,261.6L724.4,259.7L724.5,257.4L725.2,256.4L727.4,253L728.4,251.5L730.5,252L732.8,250.4L735.9,247L738.6,242.9L739,237.8L739.4,232.8L739.3,227.5L738.3,224.6L738.7,223.4L740.5,221.7L738.2,212.6L735.3,193.3z,M825.1,224.6L826.4,224.4L828.7,223.1L829.9,220.6L831.5,218.4L834.8,215.3L834.8,214.5L832.3,212.9L828.8,210.5L827.8,207.9L825.1,207.5L824.9,206.4L824.1,203.7L826.4,202.5L826.5,200.1L825.2,198.8L825.4,197.2L827.3,194.1L827.3,191.1L830,188.4L829.1,187.7L826.6,187.5L824.3,185.6L822.7,179.5L819.2,179.6L816.8,176.9L798.7,181.1L755.7,189.8L746.8,191.3L746.2,184.7L740.8,189.8L739.5,190.3L735.3,193.3L738.2,212.4L740.7,222.2L744.3,241.4L747.6,240.8L759.5,239.3L797.4,231.6L812.3,228.8L820.6,227.2L820.9,226.9L823,225.3L825.1,224.6z,M761.1,238.9L762.2,243.9L763.3,249.9L765.5,247.3L767.7,244.2L770.3,243.6L771.7,242.2L773.5,239.6L774.9,240.2L777.9,239.9L780.4,237.8L782.4,236.4L784.3,235.9L785.6,236.9L789.2,238.7L791.2,240.5L792.6,241.8L791.8,247.3L786,244.8L781.7,243.2L781.6,248.3L778.9,253.9L776.3,256.3L775.1,259.1L772.5,259.6L771.6,263.2L770.6,267.1L766.6,267.5L764.3,265L763.2,265.6L762.6,271L761.2,274.6L756.2,285.5L757.1,286.7L756.9,288.6L754.1,292.5L752.3,291.9L749.4,294.1L746.8,293.5L744.8,298.1 C 744.8,298.1 741.6,299.5 740.9,299.5 C 740.7,299.4 738.4,298.2 738.4,298.2L736.1,299.6L733.7,300.6L729.9,299.7L728.8,298.6L726.6,295.5L723.5,293.6L721.8,289.9L717.5,286.5L716.8,284.2L714.2,282.7L713.4,281.1L713.2,275.9L715.4,275.8L717.3,275L717.5,272.2L719.1,270.8L719.3,265.8L720.2,261.9L721.5,261.2L722.8,262.4L723.3,264.2L725.1,263.2L725.6,261.6L724.4,259.8L724.4,257.4L725.4,256.1L727.7,252.7L729,251.2L731.1,251.7L733.3,250.1L736.4,246.7L738.7,242.8L739,237.2L739.5,232.1L739.5,227.5L738.3,224.4L739.3,222.9L740.6,221.6L744.1,241.5L748.7,240.7L761.1,238.9z,M839.7,252.4L833.7,253.6L828.6,253.7L826.7,246.8L824.8,237.6L822.2,231.4L821,227L813.5,228.6L798.6,231.5L761.1,239L762.3,244L763.2,249.7L763.6,249.4L765.7,246.9L767.9,244.3L770.3,243.7L771.8,242.2L773.6,239.7L774.9,240.3L777.8,240L780.4,237.9L782.4,236.4L784.2,235.9L785.9,237.1L788.8,238.5L790.7,240.3L791.9,241.8L796,243.5L796,246.4L801.5,247.7L802.7,248.3L804.1,246.2L807,248.2L805.7,250.7L804.9,254.7L803.2,257.3L803.2,259.4L803.8,261.2L808.9,262.5L813.2,262.4L816.3,263.4L818.4,263.7L819.3,261.6L817.9,259.5L817.9,257.8L815.4,255.7L813.3,250.2L814.6,244.8L814.5,242.7L813.2,241.4 C 813.2,241.4 814.6,239.8 814.6,239.2 C 814.6,238.5 815.1,237.1 815.1,237.1L817.1,235.8L819,234.2L819.5,235.1L818,236.7L816.7,240.5L817.1,241.6L818.8,241.9L819.3,247.4L817.2,248.4L817.5,251.9L818,251.8L819.2,249.8L820.8,251.6L819.2,252.9L818.8,256.3L821.4,259.7L825.3,260.2L826.9,259.4L830.2,263.6L831.5,264.1L838.2,261.3L840.2,257.3L839.7,252.4zM823.8,261.4L824.9,263.9L825.1,265.7L826.2,267.5 C 826.2,267.5 827.1,266.6 827.1,266.3 C 827.1,266 826.4,263.3 826.4,263.3L825.6,260.9L823.8,261.4z,M830.3,188.7L829.2,187.7L826.6,187.6L824.3,185.6L822.7,179.5L819.3,179.6L816.8,176.9L797.4,181.3L754.4,190L746.9,191.2L746.2,184.7L747.6,183.6L748.9,182.5L749.9,180.9L751.6,179.7L753.6,178L754.1,176.3L756.2,173.6L757.3,172.6L757.1,171.7L755.8,168.6L754.1,168.4L752.1,162.3L755,160.5L759.4,159.1L763.4,157.8L766.7,157.3L773,157.1L774.9,158.4L776.5,158.6L778.6,157.3L781.2,156.1L786.4,155.7L788.5,153.9L790.3,150.6L791.9,148.7L794,148.7L795.9,147.6L796.1,145.3L794.6,143.2L794.3,141.8L795.4,139.7L795.4,138.2L793.7,138.2L791.9,137.4L791.1,136.3L790.9,133.7L796.7,128.2L797.4,127.4L798.8,124.5L801.7,119.9L804.5,116.2L806.6,113.8L809,112L812.1,110.7L817.6,109.4L820.8,109.6L825.3,108.1L832.9,106.1L833.4,111L835.9,117.5L836.7,122.7L835.7,126.6L838.3,131.1L839.1,133.2L838.3,136.1L841.2,137.4L841.8,137.7L844.9,148.7L844.4,153.8L843.9,164.6L844.7,170.1L845.5,173.6L847,180.9L847,189L845.8,191.3L847.7,193.3L848.5,194.9L846.5,196.7L846.8,198L848.1,197.7L849.6,196.4L851.9,193.8L853,193.2L854.6,193.8L856.9,194L864.8,190.1L867.7,187.3L869,185.9L873.2,187.5L869.8,191.1L865.9,194L858.8,199.3L856.2,200.3L850.4,202.2L846.4,203.3L845.2,202.8L844.9,199.1L845.4,196.4L845.3,194.3L842.5,192.6L837.9,191.6L834,190.5L830.3,188.7z,M581.61931,82.059006 L 583.4483,80.001402 L 585.62022,79.201221 L 590.99286,75.314624 L 593.27908,74.743065 L 593.73634,75.200319 L 588.59232,80.344339 L 585.27728,82.287628 L 583.21967,83.202124 L 581.61931,82.059006 z M 667.79369,114.18719 L 668.44033,116.69293 L 671.67355,116.85459 L 672.96684,115.64213 C 672.96684,115.64213 672.88601,114.18719 672.56269,114.02552 C 672.23936,113.86386 670.94608,112.16642 670.94608,112.16642 L 668.76366,112.40891 L 667.14704,112.57057 L 666.82372,113.7022 L 667.79369,114.18719 z M 567.49209,111.21318 L 568.20837,110.63278 L 570.9566,109.82447 L 574.51313,107.56123 L 574.51313,106.59126 L 575.15978,105.94462 L 581.14121,104.97466 L 583.56612,103.03473 L 587.93095,100.93315 L 588.09261,99.639864 L 590.03254,96.729975 L 591.8108,95.921673 L 593.10409,94.143408 L 595.36733,91.880161 L 599.73217,89.455254 L 604.42032,88.970273 L 605.55194,90.101896 L 605.22862,91.071859 L 601.51043,92.041822 L 600.05549,95.113371 L 597.79224,95.921673 L 597.30726,98.34658 L 594.88235,101.57979 L 594.55903,104.16636 L 595.36733,104.65134 L 596.3373,103.51972 L 599.89383,100.60983 L 601.18711,101.90311 L 603.45036,101.90311 L 606.68357,102.87307 L 608.13851,104.0047 L 609.59345,107.07625 L 612.34168,109.82447 L 616.22153,109.66281 L 617.67648,108.69285 L 619.29308,109.98613 L 620.90969,110.47112 L 622.20297,109.66281 L 623.33459,109.66281 L 624.9512,108.69285 L 628.99271,105.13632 L 632.38758,104.0047 L 639.01566,103.68138 L 643.54215,101.74145 L 646.12872,100.44817 L 647.58367,100.60983 L 647.58367,106.26794 L 648.06865,106.59126 L 650.97853,107.39957 L 652.91846,106.91458 L 659.06156,105.29798 L 660.19318,104.16636 L 661.64813,104.65134 L 661.64813,111.60274 L 664.88134,114.67429 L 666.17462,115.32093 L 667.4679,116.29089 L 666.17462,116.61421 L 665.36632,116.29089 L 661.64813,115.80591 L 659.54654,116.45255 L 657.28329,116.29089 L 654.05008,117.74584 L 652.27182,117.74584 L 646.45204,116.45255 L 641.27891,116.61421 L 639.33898,119.20078 L 632.38758,119.84742 L 629.96267,120.65572 L 628.83105,123.72727 L 627.53777,124.8589 L 627.05279,124.69724 L 625.59784,123.08063 L 621.07135,125.50554 L 620.42471,125.50554 L 619.29308,123.88893 L 618.48478,124.05059 L 616.54486,128.41543 L 615.57489,132.45694 L 612.39377,139.45774 L 611.21701,138.42347 L 609.84527,137.39215 L 607.90449,127.10413 L 604.36001,125.73408 L 602.30743,123.44785 L 590.18707,120.70437 L 587.3318,119.67473 L 579.10138,117.50199 L 571.21139,116.35887 L 567.49209,111.21318 z,M697.8,177.2L694.6,168.9L692.3,159.9L689.9,156.7L687.3,154.9L685.7,156L681.8,157.8L679.9,162.8L677.1,166.5L676,167.2L674.5,166.5 C 674.5,166.5 671.9,165.1 672.1,164.4 C 672.3,163.8 672.6,159.4 672.6,159.4L676,158.1L676.8,154.7L677.4,152.1L679.9,150.5L679.5,140.5L677.9,138.2L676.6,137.4L675.8,135.3L676.6,134.5L678.2,134.8L678.4,133.2L676,131L674.7,128.4L672.1,128.4L667.6,126.9L662.1,123.5L659.3,123.5L658.7,124.2L657.7,123.7L654.6,121.4L651.7,123.2L648.8,125.5L649.2,129L650.1,129.3L652.2,129.8L652.7,130.6L650.1,131.4L647.5,131.8L646.1,133.5L645.8,135.6L646.1,137.3L646.4,142.8L642.8,144.9L642.2,144.7L642.2,140.5L643.5,138.1L644.1,135.6L643.3,134.8L641.4,135.6L640.4,139.8L637.7,141L635.9,142.9L635.7,143.9L636.4,144.7L635.7,147.3L633.5,147.8L633.5,148.9L634.3,151.3L633.1,157.5L631.5,161.5L632.2,166.2L632.7,167.3L631.9,169.8L631.5,170.6L631.2,173.3L634.8,179.3L637.7,185.8L639.1,190.6L638.3,195.3L637.3,201.3L634.9,206.4L634.6,209.2L631.3,212.3L635.8,212.1L657.2,209.9L664.4,208.9L664.5,210.5L671.4,209.3L681.7,207.8L685.5,207.4L685.7,206.8L685.8,205.3L687.9,201.6L689.9,199.9L689.7,194.8L691.3,193.2L692.4,192.9L692.6,189.3L694.2,186.3L695.2,186.9L695.4,187.5L696.2,187.7L698.1,186.7L697.8,177.2z,M825.6,228.2L825.9,226.1L826.3,224.4L824.7,224.8L823.1,225.3L820.9,227L822.6,232.1L824.9,237.7L827,247.4L828.6,253.7L833.6,253.6L839.7,252.4L837.5,245L836.5,245.5L832.9,243.1L831.2,238.4L829.2,234.8L826.1,231.9L825.2,229.8L825.6,228.2z,M844.4,154L844.8,148.7L841.9,137.9L841.2,137.6L838.3,136.3L839.1,133.4L838.3,131.3L835.6,126.6L836.6,122.7L835.8,117.6L833.3,111.1L832.5,106.2L859,99.4L859.3,105L861.2,107.7L861.2,111.7L857.5,116.8L854.9,117.9L854.9,119.1L856.2,120.6L855.9,128.7L855.3,137.9L855,143.5L856,144.8L855.8,149.4L855.4,151.1L856.4,151.8L848.9,153.3L844.4,154z,M880.7,142.4L881.6,141.3L882.7,138L880.2,137.1L879.7,134L875.8,132.9L875.5,130.1L868.2,106.7L863.6,92.2L862.7,92.2L862.1,93.8L861.4,93.3L860.4,92.3L859,94.3L858.9,99.3L859.2,105L861.2,107.7L861.2,111.7L857.5,116.8L854.9,117.9L854.9,119.1L856,120.8L856,129.4L855.2,138.6L855,143.5L856,144.8L855.9,149.3L855.4,151.1L856.3,151.8L873.1,147.4L875.3,146.8L877.1,144L880.7,142.4z,M922.8,78.8L924.7,80.9L927,84.6L927,86.5L924.9,91.2L923,91.9L919.6,94.9L914.7,100.4 C 914.7,100.4 914.1,100.4 913.4,100.4 C 912.8,100.4 912.4,98.3 912.4,98.3L910.7,98.5L909.7,100L907.3,101.4L906.3,102.9L907.9,104.3L907.4,105L906.9,107.7L905,107.6L905,105.9L904.7,104.6L903.2,105L901.5,101.7L899.3,103L900.6,104.5L901,105.6L900.2,106.9L900.5,110L900.6,111.6L899,114.2L896.1,114.7L895.8,117.6L890.5,120.7L889.2,121.1L887.5,119.7L884.5,123.2L885.4,126.5L884,127.8L883.8,132.1L882.7,138.4L880.2,137.2L879.8,134.2L875.9,133L875.6,130.3L868.3,106.8L863.6,92.2L865,92.1L866.5,92.5L866.5,89.9L867.8,85.4L870.4,80.7L871.9,76.7L869.9,74.3L869.9,68.3L870.7,67.3L871.5,64.6L871.4,63.1L871.2,58.2L873,53.4L875.9,44.5L878,40.3L879.3,40.3L880.6,40.5L880.6,41.6L881.9,43.9L884.6,44.5L885.4,43.7L885.4,42.7L889.5,39.8L891.3,38L892.7,38.2L898.7,40.6L900.6,41.6L909.7,71.5L915.7,71.5L916.5,73.4L916.6,78.3L919.6,80.6L920.4,80.6L920.5,80.1L920,78.9L922.8,78.8zM901.9,108.9L903.4,107.4L904.8,108.4L905.3,110.9L903.6,111.8L901.9,108.9zM908.6,103L910.3,104.9 C 910.3,104.9 911.6,105 911.6,104.6 C 911.6,104.3 911.9,102.6 911.9,102.6L912.8,101.8L912,100L909.9,100.8L908.6,103z,M899.6,173.2L901.7,172.5L902.2,170.8L903.2,170.9L904.3,173.2L903,173.7L899.1,173.8L899.6,173.2zM890.2,174L892.5,171.4L894.1,171.4L895.9,172.9L893.5,173.9L891.3,174.9L890.2,174zM855.4,152L873,147.4L875.3,146.7L877.2,143.9L881,142.3L883.9,146.7L881.4,151.9L881.1,153.3L883,155.9L884.2,155.1L886,155.1L888.2,157.7L892.1,163.7L895.7,164.1L897.9,163.2L899.7,161.4L898.9,158.6L896.8,157L895.3,157.8L894.4,156.5L894.8,156.1L896.9,155.9L898.7,156.7L900.7,159.1L901.6,162L902,164.5L897.8,165.9L893.9,167.9L890,172.4L888.1,173.8L888.1,172.9L890.5,171.4L891,169.6L890.2,166.6L887.2,168L886.4,169.5L886.9,171.7L884.9,172.7L882.1,168.2L878.7,163.8L876.6,162L870.1,163.9L865,165L844.3,169.6L843.7,164.8L844.3,154.2L848.6,153.3L855.4,152z,M874,178.8L870.3,163.9L865.6,164.9L844.4,169.6L845.4,172.8L846.8,180.1L847,189.1L845.8,191.2L847.7,193.2L852,189.3L855.6,186L857.5,183.9L858.3,184.6L861.1,183.1L866.2,182L874,178.8z"
			}, {
			code: "r 2",
			path: "M507.8,324.3L495.2,324.5L449.1,324.1L404.6,322L379.9,320.8L383.8,256.2L405.9,256.8L446.2,257.7L490.5,258.7L495.6,258.7L497.8,260.8L499.8,260.8L501.4,261.8L501.4,264.8L499.6,266.6L499.2,268.8L501.1,272.2L504,275.4L506.3,277L507.6,288.2L507.8,324.3z,M486,240.7L489.3,247.7L489.1,250L492.6,255.5L495.3,258.6L490.3,258.6L446.8,257.7L406,256.8L383.8,256L384.8,234.7L352.5,231.8L356.9,187.7L372.4,188.8L392.5,189.9L410.4,191.1L434.1,192.2L444.9,191.7L446.9,194L451.7,197L452.9,197.9L457.2,196.6L461.1,196.1L463.9,195.9L465.7,197.2L469.7,198.8L472.7,200.4L473.2,202L474.1,204.1L475.9,204.1L476.7,204.1L477.6,208.8L480.5,217.3L481.1,221L483.6,224.8L484.2,229.9L485.8,234.2L486,240.7z,M476.4,204L476.3,203.4L473.5,198.5L475.3,193.8L476.8,187.9L474,185.9L473.6,183.1L474.4,180.6L477.6,180.6L477.5,175.6L477.2,145.4L476.5,141.6L472.5,138.3L471.5,136.6L471.4,135L473.5,133.5L475,131.8L475.2,129.2L417,127.6L362.2,124.1L356.8,187.8L371.4,188.7L391.4,189.9L409.1,190.9L432.9,192.2L444.9,191.7L446.9,194L452.1,197.2L452.8,198L457.4,196.5L463.9,195.9L465.6,197.2L469.8,198.8L472.7,200.5L473.1,201.9L474.2,204.2L476.4,204z,M360.3,143.2L253.6,129.8L239.5,218.2L352.8,231.8L360.3,143.2z,M380,320.9L384.9,234.6L271.5,221.9L259.3,309.9L380,320.9z"
			}, {
			code: "r 1",
			path: "M475.3,128.9L474.6,120.4L473,113.6L471.1,100.6L470.6,89.6L468.9,86.5L467.1,81.3L467.1,70.9L467.8,67.1L465.9,61.6L437.3,61L418.7,60.4L392.2,59.1L369.2,57L362.3,124.1L417.2,127.5L475.3,128.9z,M369.2,56.9L338.5,54.1L309.2,50.6L280,46.5L247.6,41.2L229.2,37.8L196.5,30.9L192,52.2L195.4,59.7L194.1,64.3L195.9,68.9L199.1,70.3L203.7,81L206.4,84.2L206.9,85.3L210.3,86.5L210.7,88.5L203.7,106.2L203.7,108.7L206.2,111.9L207.1,111.9L211.9,108.9L212.6,107.8L214.2,108.4L213.9,113.7L216.7,126.3L219.7,128.8L220.6,129.5L222.4,131.8L221.9,135.2L222.6,138.6L223.8,139.5L226.1,137.2L228.8,137.2L232,138.8L234.5,137.9L238.6,137.9L242.3,139.5L245,139.1L245.5,136.1L248.5,135.4L249.8,136.8L250.3,140L251.7,140.8L253.6,129.8L360.4,143.2L369.2,56.9z"
			}, {
			code: "r 4",
			path: "M148.4,176.4L157.2,141.2L158.6,137L161.1,131L159.8,128.8L157.3,128.9L156.5,127.8L157,126.7L157.3,123.6L161.8,118.1L163.6,117.7L164.7,116.5L165.3,113.3L166.2,112.6L170.1,106.8L174,102.5L174.2,98.7L170.8,96.1L169.3,91.7L182.9,28.3L196.4,30.8L192,52.2L195.6,59.7L194,64.4L196,69L199.1,70.3L202.9,79.8L206.4,84.3L206.9,85.4L210.3,86.6L210.7,88.6L203.7,106L203.5,108.6L206.1,111.9L207.1,111.9L212,108.8L212.6,107.7L214.2,108.4L213.9,113.8L216.7,126.3L220.6,129.5L222.3,131.7L221.5,135.8L222.6,138.6L223.7,139.7L226.2,137.3L229,137.4L231.9,138.7L234.7,138L238.5,137.9L242.5,139.5L245.2,139.2L245.7,136.1L248.6,135.4L249.9,136.9L250.3,139.8L251.8,141L243.4,194.6 C 243.4,194.6 155.4,177.9 148.4,176.4z,M259.4,310.1L175.7,298.2L196.3,185.6L243.1,194.4L241.6,205L239.3,218.2L247.1,219.1L263.5,220.9L271.7,221.8L259.4,310.1z,M196.3,185.5L172.7,314.3L170.9,314.7L169.3,317.1L166.9,317.1L165.5,314.4L162.8,314L162.1,312.9L161,312.8L158.2,314.5L157.9,321.3L157.6,327L157.2,335.6L155.8,337.7L153.3,336.6L84.3,232.4L103.3,164.9L196.3,185.5z",
			middleY: 0.75
			}, {
			code: "r 3",
			path: "M288.1,424L287.3,419.2L296,419.7L326.1,422.7L353.4,424.4L355.6,405.7L359.5,349.8L361.2,330.4L362.8,330.5L363.6,319.4L259.6,308.7L242.1,429.2L257.6,431.2L258.9,421.1L288.1,424z,M144.9,382.6L142.2,384.7L141.9,386.2L142.4,387.2L161.3,397.8L173.4,405.4L188.1,414L205,424L217.2,426.4L242.2,429.2L259.5,310L175.7,298.1L172.6,314.5L171,314.5L169.3,317.2L166.8,317L165.5,314.3L162.8,314L161.9,312.8L161,312.8L160,313.4L158.1,314.4L158,321.4L157.8,323.1L157.2,335.7L155.7,337.9L155.1,341.2L157.9,346.1L159.1,351.9L159.9,352.9L161,353.5L160.8,355.8L159.2,357.2L155.8,358.9L153.9,360.8L152.4,364.5L151.8,369.4L149,372.1L146.9,372.8L147,373.7L146.6,375.4L147,376.2L150.7,376.7L150.1,379.5L148.6,381.7L144.9,382.6z"
			}, {
			code: "r 6",
			path: "M148.7,175.5L157.5,140.7L158.6,136.5L160.9,130.8L160.3,129.7L157.8,129.6L156.5,127.9L157,126.5L157.5,123.2L161.9,117.7L163.8,116.7L164.9,115.5L166.4,111.9L170.4,106.3L174,102.4L174.2,99L171,96.5L169.2,91.8L156.5,88.2L141.4,84.7L126,84.8L125.5,83.4L120.1,85.5L115.6,84.9L113.2,83.3L111.9,84L107.2,83.8L105.5,82.4L100.3,80.3L99.5,80.5L95.1,79L93.2,80.8L87,80.5L81.1,76.3L81.8,75.5L82,67.8L79.7,63.9L75.6,63.3L74.9,60.8L72.5,60.3L66.7,62.4L64.5,68.9L61.2,78.9L58,85.3L53,99.4L46.5,113L38.5,125.6L36.5,128.5L35.7,137.1L36.1,149.2L148.7,175.5z,M102,7.6L106.4,9L116.1,11.8L124.7,13.7L144.7,19.4L167.7,25L182.9,28.2L169.2,91.8L156.8,88.3L141.3,84.7L126.1,84.8L125.6,83.4L120,85.6L115.4,84.8L113.3,83.3L112,83.9L107.2,83.8L105.5,82.4L100.3,80.3L99.5,80.5L95.1,78.9L93.2,80.8L87,80.5L81,76.3L81.8,75.4L81.9,67.7L79.7,63.9L75.6,63.3L74.9,60.8L72.6,60.3L69,61.5L66.8,58.3L67.1,55.4L69.9,55.1L71.5,51L68.9,49.9L69,46.2L73.4,45.6L70.7,42.8L69.2,35.7L69.9,32.8L69.9,24.9L68.1,21.6L70.3,12.2L72.4,12.7L74.9,15.6L77.6,18.2L80.8,20.2L85.4,22.3L88.4,22.9L91.4,24.4L94.7,25.3L97,25.2L97,22.8L98.3,21.6L100.4,20.3L100.7,21.5L101.1,23.2L98.8,23.7L98.5,25.8L100.2,27.3L101.4,29.7L102,31.6L103.5,31.5L103.6,30.2L102.7,28.9L102.2,25.7L103,23.9L102.3,22.4L102.3,20.2L104.1,16.6L103,14L100.6,9.2L100.9,8.4L102,7.6zM92.6,13.5L94.6,13.4L95.1,14.8L96.6,13.1L99,13.1L99.8,14.7L98.2,16.4L98.9,17.2L98.1,19.2L96.8,19.6 C 96.8,19.6 95.9,19.7 95.9,19.4 C 95.9,19 97.3,16.8 97.3,16.8L95.6,16.2L95.3,17.7L94.6,18.3L93.1,16L92.6,13.5z"
			}, {
			code: "r 5",
			path: "M144.6,382.1L148.6,381.7L150.1,379.6L150.6,376.7L147.1,376.1L146.5,375.4L147,373.4L146.9,372.8L148.8,372.2L151.8,369.4L152.4,364.4L153.8,361L155.7,358.8L159.3,357.2L160.9,355.6L161,353.5L160,352.9L159,351.9L157.8,346L155.1,341.2L155.7,337.7L153.3,336.6L84.2,232.5L103.1,164.9L36,149.2L34.5,153.9L34.4,161.3L29.2,173.1L26.1,175.7L25.8,176.9L24,177.7L22.6,181.9L21.8,185.1L24.5,189.3L26.1,193.5L27.2,197.1L26.9,203.5L25.1,206.6L24.5,212.4L23.5,216.1L25.3,220L28.1,224.5L30.3,229.4L31.6,233.4L31.3,236.7L31,237.2L31,239.3L36.6,245.6L36.1,248L35.5,250.2L34.8,252.2L35,260.4L37.1,264.1L39,266.7L41.8,267.2L42.8,270L41.6,273.5L39.5,275.1L38.4,275.1L37.6,279L38.1,281.9L41.3,286.3L42.9,291.6L44.4,296.3L45.7,299.4L49.1,305.2L50.5,307.8L51,310.7L52.6,311.7L52.6,314.1L51.8,316L50,323.2L49.6,325.1L52,327.8L56.2,328.3L60.7,330.1L64.6,332.2L67.5,332.2L70.4,335.3L73,340.1L74.1,342.4L78,344.5L82.9,345.3L84.3,347.4L85,350.6L83.5,351.3L83.8,352.3L87.1,353.1L89.8,353.2L93,351.5L96.9,355.7L97.7,358L100.2,362.2L100.6,365.4L100.6,374.8L101.1,376.6L111.1,378.1L130.8,380.8L144.6,382.1zM56.5,338.4L57.8,340L57.6,341.3L54.4,341.2L53.8,340L53.2,338.5L56.5,338.4zM58.4,338.4L59.7,337.8L63.2,339.9L66.3,341.1L65.4,341.7L60.9,341.5L59.3,339.9L58.4,338.4zM79.1,358.2L80.9,360.6L81.7,361.5L83.3,362.1L83.8,360.7L82.9,358.9L80.2,356.9L79.1,357L79.1,358.2zM77.7,366.9L79.5,370L80.7,372L79.2,372.2L77.9,371 C 77.9,371 77.2,369.6 77.2,369.1 C 77.2,368.7 77.2,367 77.2,367L77.7,366.9z,M233,519.3L235,515.7L237.2,515.4L237.6,516.2L235.5,519.3L233,519.3zM243.2,515.5L249.4," +
			"518.1L251.5,517.8L253.1,513.9L252.4,510.5L248.2,510L244.2,511.8L243.2,515.5zM273.9,525.6L" +
			"277.7,531.1L280.1,530.7L281.2,530.3L282.7,531.5L286.4,531.4L287.4,529.9L284.4,528.2L282.5,524.4" +
			"L280.4,520.9L274.6,523.8L273.9,525.6zM294.1,534.5L295.4,532.5L300.1,533.5L300.8,533L306.9,533.6" +
			"L306.6,534.9L304,536.4L299.6,536.1L294.1,534.5zM299.5,539.6L301.4,543.5L304.5,542.4L304.8,540.8" +
			"L303.2,538.7L299.5,538.3L299.5,539.6zM306.4,538.5L308.7,535.6L313.4,538L317.7,539.1L322.1,541.9" +
			"L322.1,543.8L318.6,545.6L313.7,546.6L311.3,545.1L306.4,538.5zM323.1,554L324.7,552.7L328.1,554.3" +
			"L335.7,557.9L339.1,560L340.7,562.4L342.6,566.8L346.7,569.4L346.4,570.7L342.5,573.9L338.3,575.4" +
			"L336.8,574.7L333.8,576.5L331.3,579.7L329.1,582.6L327.3,582.5L323.7,579.9L323.4,575.4L324.1,572.9" +
			"L322.4,567.3L320.3,565.5L320.2,562.9L322.4,561.9L324.5,558.9L325,557.9L323.4,556.1L323.1,554z",
			middleX: 0.35
		}];
		// Load the data from a Google Spreadsheet 
		// https://docs.google.com/a/highsoft.com/spreadsheet/pub?hl=en_GB&hl=en_GB&key=0AoIaUO7wH1HwdFJHaFI4eUJDYlVna3k5TlpuXzZubHc&output=html
		Highcharts.data({

		googleSpreadsheetKey: '1avhH_w4NFTXKgNpS4kYVri9dzgc111RFmSOeCbmhUWc',

		// custom handler for columns
		parsed: function(columns) {

		/**
		* Event handler for clicking points. Use jQuery UI to pop up 
		* a pie chart showing the details for each state.
		*/

		function pointClick() {
			var row = this.options.row,
			$div = $('<div></div>')
			.dialog({
				title: this.name + "'s Yearly Burned Area",
				width: 500,
				height: 450
			});
			var chart = new Highcharts.Chart({
				chart: {
					renderTo: $div[0],
					type: 'pie',
					allowPointerSelect: true,
					curson: 'pointer',
					width: 470,
					height: 340
				},
				title: {
					text: null
				},
				series :[{
					name: 'Average Burned Area',
					data:[{
						name: '2010:',
						color :'#0200D0',
						y:parseInt(columns[3][row])
					},{
						name: '2009:',
						color: '#C40401',
						y:parseInt(columns[4][row])
					},{
						name: '2008:',
						color: '#2E8B57',
						y:parseInt(columns[5][row])
					}],
					dataLabels:{
						enable: true,
						format:'<b>{point.name}</b>: {point.y} hectare',
						connectorColor:'silver'

					}
				}]
			});
		}
		// Make the columns easier to read
		var keys = columns[0],
		region = columns[1],
		name = columns[2];
		data = columns[3];

		// Build the chart options
		var options = {
			chart : {
				renderTo : 'containermap3',
				type : 'map',
				borderWidth : 1
			},

			title : {
				text : 'Annual prescribed burning area (hectare per year)'
			},
			subtitle: {
				text:'US Forest Service Regions'
			},

			legend: {
				align: 'right',
				verticalAlign: 'top',
				x: 0,
				y: 0,
				// floating: true,
				layout: 'vertical',
				valueDecimals: 0,
				// backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)',
			},

			mapNavigation: {
				enabled: true,
				enableButtons: true
			},

			colorAxis: {

				dataClasses: [{
					from: 77186,
					to: 77186,
					color: '#F0E68C',
					name: 'Northern'
					}, {
					from: 11867,
					to: 11867,
					color: '#F5DEB3',
					name: 'Rocky Mountain'
					}, {
					from: 184248,
					to: 184248,
					color: '#CCFFED',
					name: 'South Western'
					}, {
					from: 15412,
					to: 15412,
					color: '#C0C0C0',
					name: 'Inter Mountain'
					}, {
					from: 54401,
					to: 54401,
					color: '#4682B4',
					name: 'Pacific Southwest'
					}, {
					from: 114674,
					to: 114674,
					color: '#4169E1',
					name: 'Pacific Northwest'
					}, {
					from: 434119,
					to: 434119,
					color: '#2E8B57',
					name: 'Southern'
					}, {
					from: 16213,
					to: 16213,
					color: '#FF0000',
					name: 'Eastern and Northeastern Area'
					}, {
					from: 0,
					to: 0,
					color: '#F4A460',
					name: 'Alaska'
				}]
			},

			series : [{
				data : [],
				dataLabels: {
					enabled: true,
					color: 'black',
					format: '{point.code}',
					style: {
						textTransform: 'uppercase'
					}
				},
				name: 'US Forest Service Regions',
					point: {
						events: {
							click: pointClick
						}
					},
				cursor: 'pointer'
			}]
		};

		Highcharts.each(Highcharts.maps.us, function (mapPoint) {
			var key = mapPoint.code,
			i = $.inArray(key, keys);
			options.series[0].data.push(Highcharts.extend({
				value : parseFloat(data[i]),
				name : name[i],
				key: key,
				row: i
				}, mapPoint));
			});

			// Initiate the chart
			chart = new Highcharts.Map(options);
			},

			error: function () {
				$('#container').html('<div class="loading">' + 
				'<i class="icon-frown icon-large"></i> ' + 
				'Error loading data from Google Spreadsheets' + 
				'</div>');
			}
		});
	});
}


function MapsCtrl1($scope, $http, $location, $routeParams, $rootScope) { 

$(function () {

    /*
     * Highcharts paths for US states. Parsed from http://commons.wikimedia.org/wiki/File:Blank_US_Map.svg
     */
    Highcharts.maps.us = [{
        code: "hi",
        path: "M233,519.3L235,515.7L237.2,515.4L237.6,516.2L235.5,519.3L233,519.3zM243.2,515.5L249.4," +
            "518.1L251.5,517.8L253.1,513.9L252.4,510.5L248.2,510L244.2,511.8L243.2,515.5zM273.9,525.6L" +
            "277.7,531.1L280.1,530.7L281.2,530.3L282.7,531.5L286.4,531.4L287.4,529.9L284.4,528.2L282.5,524.4" +
            "L280.4,520.9L274.6,523.8L273.9,525.6zM294.1,534.5L295.4,532.5L300.1,533.5L300.8,533L306.9,533.6" +
            "L306.6,534.9L304,536.4L299.6,536.1L294.1,534.5zM299.5,539.6L301.4,543.5L304.5,542.4L304.8,540.8" +
            "L303.2,538.7L299.5,538.3L299.5,539.6zM306.4,538.5L308.7,535.6L313.4,538L317.7,539.1L322.1,541.9" +
            "L322.1,543.8L318.6,545.6L313.7,546.6L311.3,545.1L306.4,538.5zM323.1,554L324.7,552.7L328.1,554.3" +
            "L335.7,557.9L339.1,560L340.7,562.4L342.6,566.8L346.7,569.4L346.4,570.7L342.5,573.9L338.3,575.4" +
            "L336.8,574.7L333.8,576.5L331.3,579.7L329.1,582.6L327.3,582.5L323.7,579.9L323.4,575.4L324.1,572.9" +
            "L322.4,567.3L320.3,565.5L320.2,562.9L322.4,561.9L324.5,558.9L325,557.9L323.4,556.1L323.1,554z"
    }, {
        code: "ak",
        path: "M158,453.6L157.7,539L159.3,540L162.4,540.1L163.8,539L166.4,539L166.6,541.9L173.5,548.7L174,551.3L177.4,549.3L178.1,549.2L178.4,546.1L179.9,544.5L181,544.3L182.9,542.9L186,545L186.6,547.9L188.6,549L189.7,551.4L193.6,553.2L197,559.2L199.7,563.1L202,565.8L203.5,569.5L208.5,571.3L213.6,573.4L214.6,577.8L215.1,580.9L214.1,584.2L212.3,586.5L210.7,585.7L209.3,582.6L206.5,581.2L204.7,580L203.9,580.9L205.4,583.6L205.6,587.3L204.4,587.8L202.5,585.9L200.4,584.6L200.9,586.2L202.2,588L201.4,588.8 C 201.4,588.8 200.5,588.5 200.1,587.8 C 199.6,587.2 198,584.4 198,584.4L197,582.1 C 197,582.1 196.7,583.4 196,583.1 C 195.4,582.8 194.7,581.7 194.7,581.7L196.5,579.7L195,578.3L195,573.3L194.2,573.3L193.4,576.6L192.3,577.1L191.3,573.4L190.7,569.7L189.9,569.2L190.2,574.9L190.2,576L188.7,574.7L185.2,568.7L183.1,568.2L182.4,564.5L180.8,561.6L179.2,560.5L179.2,558.2L181.3,556.9L180.8,556.6L178.2,557.2L174.8,554.8L172.3,551.9L167.4,549.3L163.4,546.7L164.7,543.5L164.7,541.9L162.9,543.5L160,544.6L156.2,543.5L150.6,541.1L145.1,541.1L144.4,541.6L138,537.7L135.9,537.4L133.1,531.5L129.6,531.9L126,533.3L126.5,537.9L127.6,534.9L128.6,535.3L127.1,539.6L130.4,536.9L131,538.5L127.1,542.9L125.9,542.5L125.4,540.6L124.1,539.8L122.8,540.9L120,539.1L117,541.2L115.2,543.3L111.8,545.4L107.1,545.3L106.6,543.2L110.3,542.5L110.3,541.2L108.1,540.6L109,538.2L111.3,534.3L111.3,532.5L111.5,531.7L115.8,529.4L116.8,530.7L119.6,530.7L118.3,528.2L114.5,527.8L109.5,530.6L107.1,534L105.3,536.6L104.2,538.8L100,540.3L96.9,542.9L96.6,544.5L98.9,545.4L99.7,547.6L96.9,550.8L90.5,555L82.7,559.2L80.6,560.3L75.3,561.5L69.9,563.7L71.7,565L70.2,566.5L69.8,567.6L67,566.6L63.8,566.8L63,569.1L62,569.1L62.3,566.6L58.8,567.9L55.9,568.9L52.5,567.6L49.6,569.5L46.3,569.5L44.2,570.8L42.6,571.6L40.5,571.3L37.9,570.2L35.6,570.8L34.7,571.8L33.1,570.7L33.1,568.7L36.1,567.4L42.4,568.1L46.8,566.5L48.9,564.4L51.8,563.7L53.6,562.9L56.3,563.1L58,564.4L58.9,564L61.2,561.3L64.3,560.3L67.7,559.7L69,559.4L69.6,559.8L70.4,559.8L71.7,556.1L75.7,554.7L77.7,550.9L79.9,546.4L81.6,545L81.9,542.4L80.3,543.7L76.9,544.3L76.2,541.9L74.9,541.6L74,542.5L73.8,545.4L72.3,545.3L70.9,539.5L69.6,540.8L68.5,540.3L68.1,538.3L64.1,538.5L62,539.6L59.4,539.3L60.9,537.9L61.4,535.3L60.7,533.3L62.2,532.4L63.5,532.2L62.8,530.4L62.8,526L61.8,525.1L61,526.5L54.9,526.5L53.4,525.2L52.8,521.4L50.7,517.8L50.7,516.8L52.8,516L52.9,513.9L54.1,512.8L53.3,512.3L52,512.8L50.8,510L51.8,505L56.3,501.8L58.9,500.2L60.9,496.5L63.6,495.2L66.2,496.3L66.5,498.7L69,498.4L72.2,496L73.8,496.6L74.8,497.3L76.4,497.3L78.7,496L79.5,491.6 C 79.5,491.6 79.8,488.7 80.4,488.2 C 81.1,487.7 81.4,487.3 81.4,487.3L80.3,485.3L77.7,486.1L74.4,486.9L72.5,486.4L69,484.7L63.9,484.5L60.4,480.8L60.9,476.9L61.5,474.5L59.4,472.7L57.5,469L58,468.2L64.7,467.7L66.8,467.7L67.8,468.7L68.5,468.7L68.3,467L72.2,466.4L74.8,466.7L76.2,467.9L74.8,470L74.3,471.4L77,473L82,474.8L83.8,473.8L81.6,469.5L80.6,466.2L81.6,465.4L78.2,463.5L77.7,462.4L78.2,460.7L77.4,456.9L74.4,452.2L72,448L74.9,446L78.2,446L79.9,446.7L84.1,446.5L87.9,443L89,439.9L92.7,437.5L94.3,438.4L97.1,437.8L100.8,435.7L101.9,435.5L102.9,436.3L107.4,436.2L110.2,433.1L111.3,433.1L114.9,435.5L116.8,437.6L116.3,438.8L117,439.9L118.6,438.3L122.5,438.6L122.8,442.3L124.7,443.8L131.8,444.4L138.1,448.6L139.6,447.6L144.8,450.2L146.9,449.6L148.8,448.8L153.7,450.7L158,453.6zM42.9,482.6L45,487.9L44.9,488.9L42,488.5L40.2,484.5L38.4,483L36,483L35.8,480.5L37.6,478L38.7,480.5L40.2,481.9L42.9,482.6zM40.3,516L44.1,516.8L47.8,517.8L48.6,518.8L47,522.5L43.9,522.3L40.5,518.8L40.3,516zM19.6,502L20.8,504.5L21.9,506.2L20.8,507L18.7,503.9L18.7,502L19.6,502zM5.9,575L9.3,572.8L12.7,571.8L15.3,572.1L15.8,573.7L17.7,574.2L19.6,572.3L19.3,570.7L22.1,570L25,572.6L23.8,574.4L19.5,575.5L16.7,575L13,573.9L8.7,575.4L7,575.7L5.9,575zM54.9,570.5L56.5,572.4L58.6,570.8L57.2,569.5L54.9,570.5zM57.8,573.6L58.9,571.3L61,571.6L60.2,573.6L57.8,573.6zM81.4,571.6L82.9,573.4L83.8,572.3L83,570.3L81.4,571.6zM90.1,559.2L91.3,565L94.2,565.8L99.2,562.9L103.5,560.3L101.9,557.9L102.4,555.5L100.3,556.8L97.4,556L99,554.8L101,555.6L104.8,553.9L105.3,552.4L102.9,551.6L103.7,549.7L101,551.6L96.3,555.1L91.4,558.1L90.1,559.2zM132.5,539.3L134.9,537.9L133.9,536.1L132.2,537L132.5,539.3z",
        middleY: 0.4
    }, {
        code: "fl",
        path: "M759.8,439.1L762,446.4L765.8,456.2L771.1,465.5L774.8,471.8L779.7,477.3L783.7,481L785.3,484L784.2,485.3L783.4,486.5L786.3,494L789.2,496.9L791.8,502.2L795.3,508L799.9,516.3L801.2,523.9L801.7,535.9L802.3,537.6L802,541L799.5,542.3L799.9,544.3L799.2,546.2L799.5,548.6L800,550.6L797.3,553.8L794.2,555.3L790.3,555.4L788.9,557L786.5,558L785.2,557.5L784,556.5L783.7,553.6L782.9,550.2L779.5,545.1L775.9,542.8L772.1,542.5L771.3,543.8L768.2,539.4L767.5,535.9L765,531.8L763.2,530.7L761.6,532.8L759.8,532.5L757.7,527.4L754.8,523.6L751.9,518.2L749.3,515.2L745.7,511.4L747.8,509L751.1,503.5L750.9,501.9L746.4,500.9L744.7,501.6L745.1,502.2L747.7,503.2L746.2,507.7L745.4,508.2L743.6,504.2L742.3,499.3L742,496.6L743.5,491.9L743.5,482.3L740.4,478.6L739.1,475.6L733.9,474.3L732,473.6L730.4,471L727,469.4L725.8,466L723.1,465L720.7,461.3L716.5,459.9L713.5,458.4L711,458.4L706.9,459.2L706.8,461.2L707.6,462.1L707.1,463.3L704,463.1L700.3,466.7L696.7,468.6L692.9,468.6L689.6,469.9L689.3,467.1L687.7,465.2L684.8,464.1L683.2,462.6L675.1,458.7L667.5,457L663.1,457.6L657.1,458.1L651.1,460.2L647.7,460.8L647.4,452.8L644.8,450.8L643.1,449L643.4,446L653.6,444.7L679.1,441.8L685.9,441.1L691.3,441.4L693.9,445.3L695.4,446.7L703.5,447.2L714.3,446.6L735.8,445.3L741.3,444.6L746.4,444.8L746.8,447.7L749,448.6L749.3,443.9L747.7,439.8L749,438.3L754.6,438.8L759.8,439.1zM772.3,571.5L774.7,570.9L776,570.6L777.5,568.3L779.8,566.6L781.1,567.1L782.8,567.5L783.2,568.5L779.7,569.7L775.5,571.2L773.2,572.4L772.3,571.5zM785.8,566.5L787,567.5L789.8,565.4L795.1,561.2L798.8,557.4L801.3,550.7L802.3,549L802.5,545.6L801.7,546.1L800.8,548.9L799.3,553.6L796.1,558.8L791.7,563L788.3,565L785.8,566.5z",
        middleX: 0.75
    }, {
        code: "nh",
        path: "M880.7,142.4L881.6,141.3L882.7,138L880.2,137.1L879.7,134L875.8,132.9L875.5,130.1L868.2,106.7L863.6,92.2L862.7,92.2L862.1,93.8L861.4,93.3L860.4,92.3L859,94.3L858.9,99.3L859.2,105L861.2,107.7L861.2,111.7L857.5,116.8L854.9,117.9L854.9,119.1L856,120.8L856,129.4L855.2,138.6L855,143.5L856,144.8L855.9,149.3L855.4,151.1L856.3,151.8L873.1,147.4L875.3,146.8L877.1,144L880.7,142.4z"
    }, {
        code: "mi",
        path :"M581.61931,82.059006 L 583.4483,80.001402 L 585.62022,79.201221 L 590.99286,75.314624 L 593.27908,74.743065 L 593.73634,75.200319 L 588.59232,80.344339 L 585.27728,82.287628 L 583.21967,83.202124 L 581.61931,82.059006 z M 667.79369,114.18719 L 668.44033,116.69293 L 671.67355,116.85459 L 672.96684,115.64213 C 672.96684,115.64213 672.88601,114.18719 672.56269,114.02552 C 672.23936,113.86386 670.94608,112.16642 670.94608,112.16642 L 668.76366,112.40891 L 667.14704,112.57057 L 666.82372,113.7022 L 667.79369,114.18719 z M 567.49209,111.21318 L 568.20837,110.63278 L 570.9566,109.82447 L 574.51313,107.56123 L 574.51313,106.59126 L 575.15978,105.94462 L 581.14121,104.97466 L 583.56612,103.03473 L 587.93095,100.93315 L 588.09261,99.639864 L 590.03254,96.729975 L 591.8108,95.921673 L 593.10409,94.143408 L 595.36733,91.880161 L 599.73217,89.455254 L 604.42032,88.970273 L 605.55194,90.101896 L 605.22862,91.071859 L 601.51043,92.041822 L 600.05549,95.113371 L 597.79224,95.921673 L 597.30726,98.34658 L 594.88235,101.57979 L 594.55903,104.16636 L 595.36733,104.65134 L 596.3373,103.51972 L 599.89383,100.60983 L 601.18711,101.90311 L 603.45036,101.90311 L 606.68357,102.87307 L 608.13851,104.0047 L 609.59345,107.07625 L 612.34168,109.82447 L 616.22153,109.66281 L 617.67648,108.69285 L 619.29308,109.98613 L 620.90969,110.47112 L 622.20297,109.66281 L 623.33459,109.66281 L 624.9512,108.69285 L 628.99271,105.13632 L 632.38758,104.0047 L 639.01566,103.68138 L 643.54215,101.74145 L 646.12872,100.44817 L 647.58367,100.60983 L 647.58367,106.26794 L 648.06865,106.59126 L 650.97853,107.39957 L 652.91846,106.91458 L 659.06156,105.29798 L 660.19318,104.16636 L 661.64813,104.65134 L 661.64813,111.60274 L 664.88134,114.67429 L 666.17462,115.32093 L 667.4679,116.29089 L 666.17462,116.61421 L 665.36632,116.29089 L 661.64813,115.80591 L 659.54654,116.45255 L 657.28329,116.29089 L 654.05008,117.74584 L 652.27182,117.74584 L 646.45204,116.45255 L 641.27891,116.61421 L 639.33898,119.20078 L 632.38758,119.84742 L 629.96267,120.65572 L 628.83105,123.72727 L 627.53777,124.8589 L 627.05279,124.69724 L 625.59784,123.08063 L 621.07135,125.50554 L 620.42471,125.50554 L 619.29308,123.88893 L 618.48478,124.05059 L 616.54486,128.41543 L 615.57489,132.45694 L 612.39377,139.45774 L 611.21701,138.42347 L 609.84527,137.39215 L 607.90449,127.10413 L 604.36001,125.73408 L 602.30743,123.44785 L 590.18707,120.70437 L 587.3318,119.67473 L 579.10138,117.50199 L 571.21139,116.35887 L 567.49209,111.21318 z,M697.8,177.2L694.6,168.9L692.3,159.9L689.9,156.7L687.3,154.9L685.7,156L681.8,157.8L679.9,162.8L677.1,166.5L676,167.2L674.5,166.5 C 674.5,166.5 671.9,165.1 672.1,164.4 C 672.3,163.8 672.6,159.4 672.6,159.4L676,158.1L676.8,154.7L677.4,152.1L679.9,150.5L679.5,140.5L677.9,138.2L676.6,137.4L675.8,135.3L676.6,134.5L678.2,134.8L678.4,133.2L676,131L674.7,128.4L672.1,128.4L667.6,126.9L662.1,123.5L659.3,123.5L658.7,124.2L657.7,123.7L654.6,121.4L651.7,123.2L648.8,125.5L649.2,129L650.1,129.3L652.2,129.8L652.7,130.6L650.1,131.4L647.5,131.8L646.1,133.5L645.8,135.6L646.1,137.3L646.4,142.8L642.8,144.9L642.2,144.7L642.2,140.5L643.5,138.1L644.1,135.6L643.3,134.8L641.4,135.6L640.4,139.8L637.7,141L635.9,142.9L635.7,143.9L636.4,144.7L635.7,147.3L633.5,147.8L633.5,148.9L634.3,151.3L633.1,157.5L631.5,161.5L632.2,166.2L632.7,167.3L631.9,169.8L631.5,170.6L631.2,173.3L634.8,179.3L637.7,185.8L639.1,190.6L638.3,195.3L637.3,201.3L634.9,206.4L634.6,209.2L631.3,212.3L635.8,212.1L657.2,209.9L664.4,208.9L664.5,210.5L671.4,209.3L681.7,207.8L685.5,207.4L685.7,206.8L685.8,205.3L687.9,201.6L689.9,199.9L689.7,194.8L691.3,193.2L692.4,192.9L692.6,189.3L694.2,186.3L695.2,186.9L695.4,187.5L696.2,187.7L698.1,186.7L697.8,177.2z"
    }, {
        code: "vt",
        path: "M844.4,154L844.8,148.7L841.9,137.9L841.2,137.6L838.3,136.3L839.1,133.4L838.3,131.3L835.6,126.6L836.6,122.7L835.8,117.6L833.3,111.1L832.5,106.2L859,99.4L859.3,105L861.2,107.7L861.2,111.7L857.5,116.8L854.9,117.9L854.9,119.1L856.2,120.6L855.9,128.7L855.3,137.9L855,143.5L856,144.8L855.8,149.4L855.4,151.1L856.4,151.8L848.9,153.3L844.4,154z"
    }, {
        code: "me",
        path: "M922.8,78.8L924.7,80.9L927,84.6L927,86.5L924.9,91.2L923,91.9L919.6,94.9L914.7,100.4 C 914.7,100.4 914.1,100.4 913.4,100.4 C 912.8,100.4 912.4,98.3 912.4,98.3L910.7,98.5L909.7,100L907.3,101.4L906.3,102.9L907.9,104.3L907.4,105L906.9,107.7L905,107.6L905,105.9L904.7,104.6L903.2,105L901.5,101.7L899.3,103L900.6,104.5L901,105.6L900.2,106.9L900.5,110L900.6,111.6L899,114.2L896.1,114.7L895.8,117.6L890.5,120.7L889.2,121.1L887.5,119.7L884.5,123.2L885.4,126.5L884,127.8L883.8,132.1L882.7,138.4L880.2,137.2L879.8,134.2L875.9,133L875.6,130.3L868.3,106.8L863.6,92.2L865,92.1L866.5,92.5L866.5,89.9L867.8,85.4L870.4,80.7L871.9,76.7L869.9,74.3L869.9,68.3L870.7,67.3L871.5,64.6L871.4,63.1L871.2,58.2L873,53.4L875.9,44.5L878,40.3L879.3,40.3L880.6,40.5L880.6,41.6L881.9,43.9L884.6,44.5L885.4,43.7L885.4,42.7L889.5,39.8L891.3,38L892.7,38.2L898.7,40.6L900.6,41.6L909.7,71.5L915.7,71.5L916.5,73.4L916.6,78.3L919.6,80.6L920.4,80.6L920.5,80.1L920,78.9L922.8,78.8zM901.9,108.9L903.4,107.4L904.8,108.4L905.3,110.9L903.6,111.8L901.9,108.9zM908.6,103L910.3,104.9 C 910.3,104.9 911.6,105 911.6,104.6 C 911.6,104.3 911.9,102.6 911.9,102.6L912.8,101.8L912,100L909.9,100.8L908.6,103z"
    }, {
        code: "ri",
        path: "M874,178.8L870.3,163.9L876.6,162L878.8,164L882.1,168.3L884.8,172.7L881.8,174.3L880.5,174.2L879.4,175.9L876.9,177.9L874,178.8z"
    }, {
        code: "ny",
        path: "M830.3,188.7L829.2,187.7L826.6,187.6L824.3,185.6L822.7,179.5L819.3,179.6L816.8,176.9L797.4,181.3L754.4,190L746.9,191.2L746.2,184.7L747.6,183.6L748.9,182.5L749.9,180.9L751.6,179.7L753.6,178L754.1,176.3L756.2,173.6L757.3,172.6L757.1,171.7L755.8,168.6L754.1,168.4L752.1,162.3L755,160.5L759.4,159.1L763.4,157.8L766.7,157.3L773,157.1L774.9,158.4L776.5,158.6L778.6,157.3L781.2,156.1L786.4,155.7L788.5,153.9L790.3,150.6L791.9,148.7L794,148.7L795.9,147.6L796.1,145.3L794.6,143.2L794.3,141.8L795.4,139.7L795.4,138.2L793.7,138.2L791.9,137.4L791.1,136.3L790.9,133.7L796.7,128.2L797.4,127.4L798.8,124.5L801.7,119.9L804.5,116.2L806.6,113.8L809,112L812.1,110.7L817.6,109.4L820.8,109.6L825.3,108.1L832.9,106.1L833.4,111L835.9,117.5L836.7,122.7L835.7,126.6L838.3,131.1L839.1,133.2L838.3,136.1L841.2,137.4L841.8,137.7L844.9,148.7L844.4,153.8L843.9,164.6L844.7,170.1L845.5,173.6L847,180.9L847,189L845.8,191.3L847.7,193.3L848.5,194.9L846.5,196.7L846.8,198L848.1,197.7L849.6,196.4L851.9,193.8L853,193.2L854.6,193.8L856.9,194L864.8,190.1L867.7,187.3L869,185.9L873.2,187.5L869.8,191.1L865.9,194L858.8,199.3L856.2,200.3L850.4,202.2L846.4,203.3L845.2,202.8L844.9,199.1L845.4,196.4L845.3,194.3L842.5,192.6L837.9,191.6L834,190.5L830.3,188.7z"
    }, {
        code: "pa",
        path: "M825.1,224.6L826.4,224.4L828.7,223.1L829.9,220.6L831.5,218.4L834.8,215.3L834.8,214.5L832.3,212.9L828.8,210.5L827.8,207.9L825.1,207.5L824.9,206.4L824.1,203.7L826.4,202.5L826.5,200.1L825.2,198.8L825.4,197.2L827.3,194.1L827.3,191.1L830,188.4L829.1,187.7L826.6,187.5L824.3,185.6L822.7,179.5L819.2,179.6L816.8,176.9L798.7,181.1L755.7,189.8L746.8,191.3L746.2,184.7L740.8,189.8L739.5,190.3L735.3,193.3L738.2,212.4L740.7,222.2L744.3,241.4L747.6,240.8L759.5,239.3L797.4,231.6L812.3,228.8L820.6,227.2L820.9,226.9L823,225.3L825.1,224.6z"
    }, {
        code: "nj",
        path: "M829.6,188.4L827.3,191.1L827.3,194.2L825.4,197.3L825.2,198.9L826.5,200.2L826.3,202.6L824.1,203.8L824.9,206.5L825,207.6L827.8,208L828.8,210.5L832.3,213L834.7,214.6L834.7,215.4L831.8,218.1L830.1,220.4L828.7,223.1L826.4,224.4L826,226L825.7,227.2L825.1,229.8L826.2,232.1L829.4,235L834.3,237.2L838.3,237.9L838.5,239.3L837.7,240.3L838,243.1L838.8,243.1L840.9,240.6L841.7,235.8L844.5,231.7L847.5,225.3L848.7,219.8L848,218.6L847.9,209.3L846.2,205.9L845.1,206.7L842.4,207L841.9,206.5L843,205.5L845.1,203.6L845.2,202.5L844.8,199.1L845.4,196.3L845.3,194.4L842.4,192.6L837.4,191.4L833.2,190.1L829.6,188.4z"
    }, {
        code: "de",
        path: "M825.6,228.2L825.9,226.1L826.3,224.4L824.7,224.8L823.1,225.3L820.9,227L822.6,232.1L824.9,237.7L827,247.4L828.6,253.7L833.6,253.6L839.7,252.4L837.5,245L836.5,245.5L832.9,243.1L831.2,238.4L829.2,234.8L826.1,231.9L825.2,229.8L825.6,228.2z"
    }, {
        code: "md",
        path: "M839.7,252.4L833.7,253.6L828.6,253.7L826.7,246.8L824.8,237.6L822.2,231.4L821,227L813.5,228.6L798.6,231.5L761.1,239L762.3,244L763.2,249.7L763.6,249.4L765.7,246.9L767.9,244.3L770.3,243.7L771.8,242.2L773.6,239.7L774.9,240.3L777.8,240L780.4,237.9L782.4,236.4L784.2,235.9L785.9,237.1L788.8,238.5L790.7,240.3L791.9,241.8L796,243.5L796,246.4L801.5,247.7L802.7,248.3L804.1,246.2L807,248.2L805.7,250.7L804.9,254.7L803.2,257.3L803.2,259.4L803.8,261.2L808.9,262.5L813.2,262.4L816.3,263.4L818.4,263.7L819.3,261.6L817.9,259.5L817.9,257.8L815.4,255.7L813.3,250.2L814.6,244.8L814.5,242.7L813.2,241.4 C 813.2,241.4 814.6,239.8 814.6,239.2 C 814.6,238.5 815.1,237.1 815.1,237.1L817.1,235.8L819,234.2L819.5,235.1L818,236.7L816.7,240.5L817.1,241.6L818.8,241.9L819.3,247.4L817.2,248.4L817.5,251.9L818,251.8L819.2,249.8L820.8,251.6L819.2,252.9L818.8,256.3L821.4,259.7L825.3,260.2L826.9,259.4L830.2,263.6L831.5,264.1L838.2,261.3L840.2,257.3L839.7,252.4zM823.8,261.4L824.9,263.9L825.1,265.7L826.2,267.5 C 826.2,267.5 827.1,266.6 827.1,266.3 C 827.1,266 826.4,263.3 826.4,263.3L825.6,260.9L823.8,261.4z"
    }, {
        code: "va",
        path: "M831.6,266L831.4,264.1L837.9,261.5L837.1,264.7L834.2,268.5L833.8,273.1L834.3,276.5L832.4,281.5L830.3,283.4L828.8,278.7L829.2,273.3L830.8,269.1L831.6,266zM834.9,294.3L776.8,306.9L739.3,312.2L732.6,311.8L730.1,313.7L722.7,313.9L714.3,314.9L703.4,316.5L713.9,310.9L713.9,308.9L715.4,306.7L726,295.2L729.9,299.7L733.7,300.6L736.2,299.5L738.5,298.2L741,299.5L744.9,298.1L746.8,293.6L749.4,294.1L752.3,292L754.1,292.5L756.9,288.8L757.2,286.7L756.3,285.4L757.3,283.6L762.5,271.3L763.2,265.5L764.4,265L766.6,267.5L770.5,267.2L772.4,259.6L775.2,259L776.3,256.3L778.9,253.9L781.6,248.2L781.7,243.2L791.5,247 C 792.2,247.3 792.4,241.9 792.4,241.9L796,243.5L796.1,246.5L801.9,247.8L804,249L805.7,251L805,254.7L803.1,257.3L803.2,259.3L803.8,261.2L808.7,262.4L813.2,262.5L816.3,263.4L818.2,263.7L818.9,266.8L822.1,267.2L823,268.4L822.5,273.1L823.9,274.2L823.4,276.2L824.7,276.9L824.4,278.3L821.7,278.2L821.8,279.9L824.1,281.4L824.2,282.8L826,284.6L826.5,287.1L823.9,288.5L825.5,290L831.3,288.3L834.9,294.3z"
    }, {
        code: "wv",
        path: "M761.1,238.9L762.2,243.9L763.3,249.9L765.5,247.3L767.7,244.2L770.3,243.6L771.7,242.2L773.5,239.6L774.9,240.2L777.9,239.9L780.4,237.8L782.4,236.4L784.3,235.9L785.6,236.9L789.2,238.7L791.2,240.5L792.6,241.8L791.8,247.3L786,244.8L781.7,243.2L781.6,248.3L778.9,253.9L776.3,256.3L775.1,259.1L772.5,259.6L771.6,263.2L770.6,267.1L766.6,267.5L764.3,265L763.2,265.6L762.6,271L761.2,274.6L756.2,285.5L757.1,286.7L756.9,288.6L754.1,292.5L752.3,291.9L749.4,294.1L746.8,293.5L744.8,298.1 C 744.8,298.1 741.6,299.5 740.9,299.5 C 740.7,299.4 738.4,298.2 738.4,298.2L736.1,299.6L733.7,300.6L729.9,299.7L728.8,298.6L726.6,295.5L723.5,293.6L721.8,289.9L717.5,286.5L716.8,284.2L714.2,282.7L713.4,281.1L713.2,275.9L715.4,275.8L717.3,275L717.5,272.2L719.1,270.8L719.3,265.8L720.2,261.9L721.5,261.2L722.8,262.4L723.3,264.2L725.1,263.2L725.6,261.6L724.4,259.8L724.4,257.4L725.4,256.1L727.7,252.7L729,251.2L731.1,251.7L733.3,250.1L736.4,246.7L738.7,242.8L739,237.2L739.5,232.1L739.5,227.5L738.3,224.4L739.3,222.9L740.6,221.6L744.1,241.5L748.7,240.7L761.1,238.9z"
    }, {
        code: "oh",
        path: "M735.3,193.3L729.2,197.3L725.3,199.6L721.9,203.3L717.9,207.2L714.6,208L711.7,208.5L706.2,211.1L704.1,211.2L700.7,208.2L695.6,208.8L693,207.4L690.6,206L685.7,206.7L675.5,208.3L664.3,210.5L665.6,225.1L667.4,238.9L670,262.3L670.5,267.2L674.7,267L677.1,266.2L680.4,267.7L682.5,272.1L687.6,272.1L689.5,274.2L691.3,274.1L693.8,272.8L696.3,273.1L701.8,273.6L703.5,271.5L705.8,270.2L707.9,269.5L708.6,272.3L710.3,273.2L713.8,275.6L716,275.5L717.3,275L717.5,272.3L719.1,270.8L719.2,266 C 719.2,266 720.2,261.9 720.2,261.9L721.5,261.3L722.8,262.4L723.4,264.1L725.1,263.1L725.5,261.6L724.4,259.7L724.5,257.4L725.2,256.4L727.4,253L728.4,251.5L730.5,252L732.8,250.4L735.9,247L738.6,242.9L739,237.8L739.4,232.8L739.3,227.5L738.3,224.6L738.7,223.4L740.5,221.7L738.2,212.6L735.3,193.3z"
    }, {
        code: "in",
        path: "M619.5,299.9L619.6,297.1L620.1,292.5L622.3,289.6L624.1,285.7L626.7,281.5L626.2,275.7L624.4,273L624.1,269.7L624.9,264.2L624.4,257.3L623.1,241.3L621.8,225.9L620.9,214.2L623.9,215.1L625.4,216.1L626.5,215.7L628.6,213.8L631.5,212.2L636.6,212L658.5,209.8L664.1,209.2L665.6,225.2L669.9,262L670.5,267.8L670.1,270.1L671.3,271.9L671.4,273.2L668.9,274.8L665.4,276.4L662.2,276.9L661.6,281.8L657,285.1L654.2,289.1L654.5,291.5L653.9,293L650.6,293L649,291.4L646.5,292.7L643.8,294.2L644,297.2L642.8,297.5L642.3,296.5L640.2,295L636.9,296.3L635.4,299.3L633.9,298.5L632.5,296.9L628,297.4L622.4,298.4L619.5,299.9z"
    }, {
        code: "il",
        path: "M619.5,300.3L619.5,297.1L620.1,292.4L622.4,289.5L624.3,285.4L626.5,281.4L626.2,276.2L624.1,272.6L624,269.3L624.7,264L623.9,256.8L622.9,241.1L621.6,226L620.6,214.4L620.4,213.5L619.6,210.9L618.3,207.2L616.6,205.4L615.2,202.8L615,197.3L569.2,199.9L569.4,202.3L571.7,203L572.6,204.1L573,206L576.9,209.4L577.6,211.7L576.9,215.1L575.1,218.8L574.4,221.3L572.1,223.1L570.3,223.8L565,225.2L564.4,227L563.7,229L564.4,230.4L566.2,232L566,236.1L564.1,237.7L563.4,239.3L563.4,242.1L561.6,242.5L560,243.7L559.8,245L560,247.1L558.3,248.4L557.3,251.2L557.7,254.9L560,262.2L567.3,269.7L572.8,273.4L572.6,277.7L573.5,279.1L579.9,279.6L582.6,280.9L582,284.6L579.7,290.5L579,293.7L581.3,297.6L587.7,302.9L592.3,303.6L594.3,308.6L596.4,311.8L595.5,314.8L597.1,318.9L598.9,321L600.3,320.1L601.2,318L603.4,316.2L605.5,315.6L608.2,316.8L611.8,318.2L613,317.9L613.2,315.6L611.9,313.2L612.2,310.8L614,309.5L617,308.7L618.3,308.2L617.7,306.8L616.9,304.5L618.3,303.5L619.5,300.3z"
    }, {
        code: "ct",
        path: "M874,178.8L870.3,163.9L865.6,164.9L844.4,169.6L845.4,172.8L846.8,180.1L847,189.1L845.8,191.2L847.7,193.2L852,189.3L855.6,186L857.5,183.9L858.3,184.6L861.1,183.1L866.2,182L874,178.8z"
    }, {
        code: "wi",
        path: "M615,197.3L614.9,194.2L613.8,189.6L613.1,183.5L612,181.1L613,178L613.8,175.1L615.2,172.5L614.6,169.1L613.9,165.5L614.4,163.8L616.4,161.3L616.5,158.6L615.7,157.3L616.4,154.7L615.9,150.5L618.7,144.9L621.6,138.1L621.7,135.8L621.4,134.9L620.6,135.3L616.4,141.7L613.6,145.7L611.7,147.5L610.9,149.7L608.9,150.5L607.8,152.5L606.4,152.2L606.2,150.4L607.5,148L609.6,143.3L611.4,141.7L612.4,139.3L609.8,137.4L607.8,127L604.3,125.7L602.3,123.4L590.2,120.7L587.3,119.6L579.1,117.5L571.2,116.3L567.4,111.2L566.7,111.7L565.5,111.6L564.8,110.4L563.5,110.7L562.4,110.9L560.6,111.9L559.6,111.2L560.3,109.3L562.2,106.2L563.3,105.1L561.4,103.6L559.3,104.4L556.4,106.4L548.9,109.6L546,110.3L543.1,109.8L542.1,108.9L540,111.7L539.8,114.5L539.8,122.9L538.7,124.5L533.4,128.4L531.1,134.4L531.6,134.6L534.1,136.7L534.8,139.9L532.9,143.1L532.9,146.9L533.4,153.6L536.4,156.5L539.8,156.5L541.6,159.7L545.1,160.2L548.9,165.9L556,170L558.1,172.8L559,180.2L559.7,183.5L562,185.1L562.2,186.5L560.1,189.9L560.4,193.1L562.9,197L565.4,198.2L568.4,198.6L569.7,200L615,197.3z"
    }, {
        code: "nc",
        path: "M834.9,294.3L837,299.2L840.6,305.6L843,308.1L843.6,310.3L841.2,310.5L842,311.1L841.7,315.3L839.1,316.6L838.5,318.7L837.2,321.7L833.5,323.3L831,322.9L829.6,322.8L828,321.5L828.3,322.8L828.3,323.8L830.2,323.8L831,325L829.1,331.4L833.3,331.4L833.9,333L836.2,330.7L837.5,330.2L835.6,333.8L832.5,338.6L831.2,338.6L830.1,338.1L827.3,338.8L822.1,341.2L815.7,346.5L812.3,351.2L810.3,357.7L809.9,360.1L805.2,360.6L799.7,362L789.8,353.7L777.2,346.1L774.3,345.3L761.6,346.8L757.4,347.5L755.7,344.3L752.8,342.2L736.3,342.7L729,343.5L720,348L713.8,350.6L692.6,353.2L693.1,349.1L694.9,347.7L697.7,347L698.3,343.3L702.5,340.6L706.4,339.1L710.6,335.6L715,333.5L715.6,330.4L719.5,326.5L720.1,326.3 C 720.1,326.3 720.1,327.5 720.9,327.5 C 721.8,327.5 722.9,327.8 722.9,327.8L725.1,324.2L727.3,323.6L729.5,323.9L731.1,320.4L734,317.8L734.5,315.7L734.7,312L739,312L746.2,311.1L761.9,308.9L777.1,306.8L798.7,302.1L818.7,297.8L829.9,295.4L834.9,294.3zM839.2,327.5L841.8,325L844.9,322.4L846.5,321.7L846.6,319.7L846,313.6L844.5,311.2L843.9,309.4L844.6,309.1L847.4,314.6L847.8,319.1L847.6,322.5L844.2,324L841.4,326.4L840.3,327.6L839.2,327.5z"
    }, {
        code: "dc",
        path: "M805.8,250.8L803.9,249L802.7,248.3L804.1,246.3L807,248.2L805.8,250.8z"
    }, {
        code: "ma",
        path: "M899.6,173.2L901.7,172.5L902.2,170.8L903.2,170.9L904.3,173.2L903,173.7L899.1,173.8L899.6,173.2zM890.2,174L892.5,171.4L894.1,171.4L895.9,172.9L893.5,173.9L891.3,174.9L890.2,174zM855.4,152L873,147.4L875.3,146.7L877.2,143.9L881,142.3L883.9,146.7L881.4,151.9L881.1,153.3L883,155.9L884.2,155.1L886,155.1L888.2,157.7L892.1,163.7L895.7,164.1L897.9,163.2L899.7,161.4L898.9,158.6L896.8,157L895.3,157.8L894.4,156.5L894.8,156.1L896.9,155.9L898.7,156.7L900.7,159.1L901.6,162L902,164.5L897.8,165.9L893.9,167.9L890,172.4L888.1,173.8L888.1,172.9L890.5,171.4L891,169.6L890.2,166.6L887.2,168L886.4,169.5L886.9,171.7L884.9,172.7L882.1,168.2L878.7,163.8L876.6,162L870.1,163.9L865,165L844.3,169.6L843.7,164.8L844.3,154.2L848.6,153.3L855.4,152z"
    }, {
        code: "tn",
        path: "M696.6,318.2L644.7,323.2L629,325L624.4,325.5L620.5,325.5L620.3,329.6L612.1,329.8L605.1,330.5L597,330.4L595.6,337.4L593.9,342.9L590.6,345.7L589.3,350.1L589,352.6L584.9,354.9L586.4,358.5L585.4,362.8L584.4,363.6L692.6,353.2L693,349.2L694.8,347.8L697.6,347L698.3,343.3L702.4,340.6L706.5,339.1L710.5,335.5L715,333.5L715.5,330.4L719.6,326.4L720.1,326.3 C 720.1,326.3 720.1,327.5 721,327.5 C 721.8,327.5 722.9,327.8 722.9,327.8L725.2,324.2L727.2,323.6L729.5,323.9L731.1,320.3L734.1,317.7L734.5,315.8L734.8,312.1L732.6,311.9L730,313.9L723,313.9L704.7,316.3L696.6,318.2z"
    }, {
        code: "ar",
        path: "M593.8,343L589.8,343.7L584.7,343.1L585.1,341.5L588.1,338.9L589,335.3L587.2,332.3L508.8,334.8L510.4,341.7L510.4,349.9L511.8,360.9L512,398.7L514.3,400.6L517.2,399.3L520,400.4L520.7,407L576.3,405.9L577.4,403.8L577.1,400.2L575.3,397.2L576.9,395.8L575.3,393.2L576,390.7L577.4,385.1L579.9,383.1L579.2,380.8L582.9,375.4L585.6,374L585.5,372.5L585.1,370.7L588,365.1L590.4,363.9L590.8,360.4L592.6,359.2L589.4,358.7L588.1,354.7L590.9,352.3L591.4,350.3L592.7,346.3L593.8,343z"
    }, {
        code: "mo",
        path: "M558.4,248.1L555.9,245L554.7,242.7L490.4,245.1L488.1,245.2L489.3,247.7L489.1,250L491.6,253.9L494.7,258L497.8,260.8L500,261L501.5,261.9L501.5,264.9L499.6,266.5L499.2,268.8L501.2,272.2L503.7,275.2L506.3,277L507.6,288.6L507.9,324.7L508.2,329.4L508.6,334.8L531.1,333.9L554.3,333.2L575.1,332.4L586.7,332.2L588.9,335.6L588.2,338.9L585.1,341.3L584.6,343.2L589.9,343.6L593.8,342.9L595.5,337.5L596.2,331.6L598.3,329L600.9,327.6L600.9,324.5L602,322.6L600.3,320L598.9,321L596.9,318.8L595.7,314L596.5,311.5L594.5,308.1L592.7,303.5L587.9,302.7L580.9,297.1L579.2,293L580,289.8L582.1,283.7L582.5,280.9L580.6,279.8L573.7,279L572.7,277.3L572.6,273.1L567.1,269.7L560.1,261.9L557.8,254.6L557.6,250.4L558.4,248.1z"
    }, {
        code: "ga",
        path: "M672.2,355.5L672.2,357.7L672.4,359.8L673.1,363.2L676.4,371.1L678.9,381L680.3,387.1L681.9,392L683.4,398.9L685.5,405.2L688.1,408.6L688.6,412L690.5,412.8L690.7,414.9L688.9,419.8L688.4,423L688.2,424.9L689.9,429.3L690.2,434.6L689.4,437.1L690,437.9L691.5,438.7L691.7,441.9L693.9,445.2L696.2,447.4L704.1,447.6L714.9,446.9L736.4,445.6L741.9,445L746.4,445L746.6,447.9L749.2,448.7L749.5,444.3L747.9,439.8L749,438.2L754.9,439L759.8,439.3L759.1,433L761.3,423L762.8,418.8L762.3,416.2L765.6,410L765.1,408.6L763.2,409.3L760.6,408L760,405.9L758.7,402.4L756.4,400.3L753.8,399.6L752.2,394.8L749.3,388.4L745.1,386.5L743,384.6L741.7,382L739.6,380L737.3,378.7L735.1,375.8L732,373.6L727.5,371.8L727,370.3L724.5,367.4L724.1,366L720.7,361L717.1,361.1L713.4,358.7L712,357.4L711.6,355.7L712.5,353.7L714.7,352.6L714.1,350.5L672.2,355.5z"
    }, {
        code: "sc",
        path: "M764.9,408.1L763.1,409.1L760.5,407.8L759.9,405.7L758.6,402.1L756.3,400L753.7,399.4L752.1,394.5L749.4,388.6L745.2,386.6L743.1,384.7L741.8,382.1L739.7,380.1L737.4,378.9L735.1,375.9L732.1,373.7L727.6,371.9L727.1,370.4L724.6,367.5L724.2,366.1L720.8,360.9L717.4,361.1L713.3,358.6L712,357.4L711.7,355.6L712.5,353.6L714.8,352.7L714.3,350.4L720,348L729.2,343.5L736.9,342.6L753,342.2L755.7,344.1L757.4,347.5L761.7,346.8L774.3,345.4L777.2,346.2L789.8,353.8L799.9,361.9L794.5,367.4L791.9,373.5L791.4,379.8L789.8,380.6L788.7,383.4L786.2,384L784.1,387.6L781.4,390.3L779.1,393.7L777.5,394.5L773.9,397.9L771,398.1L772,401.3L767,406.8L764.9,408.1z"
    }, {
        code: "ky",
        path: "M725.9,295.2L723.7,297.6L720.1,301.6L715.1,307.1L713.9,308.8L713.9,310.9L709.5,313.1L703.8,316.5L696.6,318.3L644.7,323.2L629,324.9L624.4,325.4L620.5,325.4L620.3,329.6L612.1,329.8L605.1,330.4L597.1,330.4L598.3,329L600.8,327.5L601.1,324.3L602,322.5L600.4,319.9L601.2,318L603.4,316.3L605.5,315.6L608.3,316.9L611.9,318.2L613,317.9L613.1,315.6L611.9,313.2L612.2,310.9L614.1,309.5L616.7,308.8L618.3,308.2L617.5,306.4L616.9,304.5L618.4,303.5 C 618.4,303.4 619.6,299.9 619.6,299.8L622.7,298.3L628,297.4L632.5,296.9L633.9,298.5L635.4,299.4L637,296.3L640.2,295L642.4,296.5L642.8,297.5L644,297.2L643.8,294.2L646.9,292.5L649.1,291.4L650.6,293.1L653.9,293L654.5,291.5L654.1,289.2L656.7,285.2L661.5,281.8L662.2,276.9L665.2,276.5L668.9,274.8L671.4,273.1L671.2,271.6L670.1,270.1L670.6,267.1L674.8,267L677.1,266.2L680.4,267.7L682.5,272L687.6,272L689.7,274.3L691.3,274.1L693.9,272.8L699.1,273.4L701.7,273.6L703.4,271.6L706,270.1L707.9,269.4L708.5,272.3L710.6,273.3L713.2,275.4L713.4,281.1L714.2,282.7L716.8,284.2L717.5,286.5L721.7,289.9L723.5,293.6L725.9,295.2z"
    }, {
        code: "al",
        path: "M631.3,460.4L629.8,446L627,427.3L627.2,413.2L628,382.2L627.8,365.5L628,359.1L672.5,355.5L672.3,357.7L672.5,359.8L673.1,363.2L676.5,371.1L679,381L680.4,387.1L682,392L683.5,398.9L685.6,405.2L688.2,408.6L688.7,412L690.6,412.8L690.8,414.9L689,419.8L688.5,423L688.3,424.9L689.9,429.3L690.3,434.6L689.5,437.1L690.1,437.9L691.6,438.7L691.9,441.6L686.3,441.2L679.5,441.9L654,444.8L643.6,446.2L643.3,449L645.1,450.8L647.7,452.8L648.3,460.7L642.7,463.3L640,463L642.7,461L642.7,460L639.7,454.1L637.4,453.4L635.9,457.8L634.7,460.5L634,460.4L631.3,460.4z"
    }, {
        code: "la",
        path: "M607.9,459.1L604.6,455.9L605.6,450.4L605,449.6L595.7,450.6L570.7,451L570,448.6L570.9,440.2L574.2,434.2L579.3,425.5L578.7,423.1L579.9,422.5L580.4,420.5L578.1,418.4L578,416.5L576.2,412.2L576,405.8L520.6,406.7L520.6,416.3L521.3,425.7L522,429.6L524.5,433.7L525.4,438.7L529.7,444.2L530,447.4L530.6,448.1L530,456.6L527,461.6L528.6,463.6L527.9,466.2L527.2,473.5L525.8,476.7L526,480.3L530.7,478.8L542.8,479L553.1,482.5L559.6,483.7L563.3,482.2L566.5,483.3L569.8,484.3L570.6,482.2L567.3,481.1L564.8,481.6L562,479.9 C 562,479.9 562.2,478.7 562.8,478.5 C 563.5,478.3 565.9,477.5 565.9,477.5L567.7,479L569.4,478L572.7,478.7L574.1,481.1L574.5,483.3L579,483.7L580.8,485.4L579.9,487.1L578.7,487.9L580.3,489.5L588.7,493L592.2,491.7L593.2,489.3L595.8,488.7L597.6,487.2L598.9,488.2L599.7,491.1L597.4,491.9L598.1,492.6L601.5,491.3L603.7,487.9L604.5,487.4L602.4,487.1L603.2,485.4L603.1,484L605.2,483.5L606.3,482.2L606.9,483 C 606.9,483 606.8,486.1 607.6,486.1 C 608.4,486.1 611.8,486.7 611.8,486.7L615.8,488.7L616.8,490.1L619.7,490.1L620.8,491.1L623.1,488L623.1,486.6L621.8,486.6L618.4,483.8L612.6,483L609.4,480.8L610.5,478L612.8,478.3L612.9,477.7L611.2,476.7L611.2,476.2L614.4,476.2L616.2,473.2L614.9,471.2L614.5,468.5L613.1,468.6L611.2,470.7L610.5,473.3L607.4,472.7L606.5,470.9L608.2,469L610.1,465.5L609.1,463.1L607.9,459.1z",
        middleY: 0.65
    }, {
        code: "ms",
        path: "M631.5,459.3L631.3,460.6L626.1,460.6L624.6,459.7L622.5,459.4L615.7,461.4L614,460.6L611.4,464.8L610.3,465.5L609.1,463L608,459.2L604.6,456L605.7,450.4L605,449.5L603.2,449.7L595.3,450.6L570.7,451L570,448.7L570.8,440.4L574,434.7L579.2,425.6L578.7,423.1L580,422.5L580.4,420.5L578.1,418.5L578,416.3L576.1,412.2L576,406.2L577.4,403.8L577.1,400.3L575.4,397.3L576.9,395.8L575.3,393.3L575.8,391.6L577.4,385.1L579.8,383.1L579.2,380.7L582.9,375.4L585.7,374L585.5,372.4L585.2,370.7L588.1,365.1L590.4,363.9L590.6,363L627.9,359.1L628.1,365.4L628.2,382L627.4,413.1L627.3,427.1L630,445.9L631.5,459.3z"
    }, {
        code: "ia",
        path: "M569.1,199.5L569.4,202.3L571.6,202.9L572.6,204.1L573.1,206L576.9,209.3L577.6,211.7L576.9,215.2L575.3,218.4L574.5,221.1L572.3,222.7L570.6,223.3L565,225.2L563.6,229L564.4,230.4L566.2,232.1L565.9,236.1L564.2,237.6L563.4,239.3L563.5,242.1L561.6,242.5L560,243.6L559.7,245L560,247.1L558.5,248.2L556,245.1L554.7,242.6L489,245.1L488.1,245.3L486,240.8L485.8,234.2L484.2,230L483.5,224.8L481.2,221.1L480.3,216.3L477.6,208.8L476.4,203.4L475.1,201.2L473.5,198.5L475.4,193.6L476.8,187.9L474,185.9L473.6,183.1L474.5,180.6L476.2,180.6L558.9,179.3L559.7,183.5L561.9,185.1L562.2,186.5L560.2,189.9L560.4,193.1L562.9,196.9L565.4,198.2L568.5,198.7L569.1,199.5z"
    }, {
        code: "mn",
        path: "M475.2,128.8L474.7,120.3L472.9,113L471.1,99.5L470.6,89.7L468.8,86.3L467.2,81.2L467.2,70.9L467.9,67L466.1,61.6L496.2,61.6L496.5,53.4L497.2,53.2L499.4,53.7L501.4,54.5L502.2,60L503.6,66.2L505.2,67.8L510.1,67.8L510.4,69.2L516.7,69.6L516.7,71.7L521.6,71.7L521.9,70.4L523,69.2L525.3,68.6L526.6,69.6L529.5,69.6L533.4,72.1L538.7,74.6L541.1,75L541.6,74.1L543.1,73.6L543.5,76.5L546.1,77.8L546.6,77.3L547.9,77.5L547.9,79.6L550.5,80.5L553.6,80.5L555.2,79.7L558.4,76.5L561,76L561.8,77.8L562.3,79.1L563.3,79.1L564.2,78.3L573.1,78L574.9,81L575.6,81L576.3,79.9L580.7,79.6L580.1,81.9L576.2,83.7L566.9,87.8L562.1,89.8L559.1,92.3L556.6,95.9L554.4,99.8L552.6,100.6L548.1,105.6L546.8,105.8L542.5,108.5L540,111.7L539.8,114.9L539.9,123L538.5,124.6L533.4,128.4L531.2,134.4L534,136.6L534.7,139.9L532.9,143.1L533,146.8L533.4,153.6L536.4,156.6L539.8,156.6L541.7,159.7L545,160.2L548.9,165.9L556,170L558.1,172.9L558.8,179.3L477.6,180.5L477.2,144.8L476.8,141.8L472.7,138.4L471.5,136.5L471.5,134.9L473.6,133.3L475,132L475.2,128.8z",
        middleX: 0.35
    }, {
        code: "ok",
        path: "M380.3,320.8L363.6,319.5L362.7,330.5L383.2,331.6L415.2,332.9L412.9,357.3L412.5,375.2L412.7,376.8L417,380.4L419.1,381.6L419.8,381.3L420.5,379.3L421.8,381.1L423.9,381.1L423.9,379.7L426.6,381.1L426.2,385L430.3,385.2L432.8,386.4L436.9,387.1L439.4,388.9L441.7,386.8L445.2,387.5L447.7,390.9L448.6,390.9L448.6,393.2L450.9,393.9L453.2,391.6L455,392.3L457.5,392.3L458.4,394.8L464.7,396.9L466.1,396.2L467.9,392.1L469.1,392.1L470.2,394.2L474.3,394.8L478,396.2L480.9,397.1L482.8,396.2L483.5,393.7L487.8,393.7L489.9,394.6L492.6,392.6L493.7,392.6L494.4,394.2L498.5,394.2L500.1,392.1L502,392.6L504,395.1L507.2,396.9L510.4,397.8L512.4,398.9L512,361.7L510.6,350.7L510.5,341.9L509,335.3L508.2,328.2L508.2,324.3L496,324.7L449.6,324.2L404.6,322.1L380.3,320.8z"
    }, {
        code: "tx",
        path: "M361.4,330.5L384.1,331.6L415.2,332.8L412.9,356.2L412.6,374.4L412.6,376.4L417,380.3L419,381.7L420.1,381.1L420.5,379.3L421.7,381.1L423.8,381.2L423.8,379.7L425.4,380.7L426.6,381.1L426.2,385.1L430.3,385.2L433.2,386.4L437.2,386.9L439.6,389L441.7,386.9L445.4,387.5L447.6,390.7L448.7,391.1L448.6,393L450.8,393.8L453.1,391.8L455.2,392.4L457.5,392.4L458.4,394.8L464.7,397L466.3,396.2L467.8,392L468.1,392L469.1,392.1L470.3,394.2L474.2,394.8L477.5,396L481,397.1L482.8,396.2L483.5,393.7L488,393.7L489.8,394.6L492.6,392.5L493.7,392.6L494.5,394.2L498.6,394.2L500.1,392.1L502,392.6L503.9,395L507.5,397L510.3,397.8L511.8,398.6L514.3,400.6L517.3,399.3L520,400.4L520.6,406.5L520.5,416.2L521.2,425.8L521.9,429.4L524.6,433.8L525.5,438.7L529.7,444.3L529.9,447.4L530.6,448.2L529.9,456.6L527,461.6L528.6,463.7L527.9,466.1L527.3,473.5L525.8,476.8L526.1,480.3L520.4,481.9L510.5,486.4L509.6,488.4L507,490.3L504.9,491.8L503.6,492.6L497.9,497.9L495.2,500L489.9,503.3L484.2,505.7L477.9,509.1L476.1,510.5L470.3,514.1L466.9,514.7L463,520.2L459,520.6L458,522.5L460.3,524.4L458.8,529.9L457.5,534.5L456.4,538.3L455.6,542.9L456.4,545.3L458.2,552.2L459.1,558.4L460.9,561.1L459.9,562.6L456.9,564.5L451.2,560.6L445.7,559.5L444.4,560L441.2,559.4L437,556.3L431.8,555.1L424.2,551.8L422.1,547.9L420.8,541.4L417.6,539.5L416.9,537.2L417.6,536.6L417.9,533.2L416.6,532.5L416,531.5L417.3,527.2L415.6,524.9L412.4,523.6L409,519.3L405.5,512.6L401.3,510L401.4,508.1L396.1,495.8L395.3,491.6L393.5,489.7L393.3,488.2L387.4,482.9L384.8,479.8L384.8,478.7L382.2,476.6L375.4,475.4L368,474.8L364.9,472.5L360.4,474.3L356.8,475.8L354.5,479L353.6,482.7L349.2,488.9L346.8,491.3L344.2,490.3L342.4,489.2L340.5,488.5L336.6,486.3L336.6,485.6L334.8,483.7L329.6,481.6L322.2,473.8L319.9,469.1L319.9,461.1L316.7,454.6L316.2,451.8L314.6,450.9L313.5,448.8L308.5,446.7L307.2,445.1L300.1,437.1L298.8,433.9L294.1,431.6L292.6,427.3L290,424.4L288.1,423.9L287.5,419.2L295.5,419.9L324.5,422.6L353.5,424.2L355.8,404.8L359.6,349.2L361.2,330.5L362.6,330.5M461.6,560.2L461.1,553L458.3,545.9L457.8,538.8L459.3,530.6L462.6,523.7L466.1,518.3L469.2,514.7L469.9,515L465.1,521.6L460.8,528.1L458.7,534.8L458.4,540L459.3,546.1L461.9,553.3L462.4,558.5L462.5,559.9L461.6,560.2z"
    }, {
        code: "nm",
        path: "M288.1,424L287.3,419.2L296,419.7L326.1,422.7L353.4,424.4L355.6,405.7L359.5,349.8L361.2,330.4L362.8,330.5L363.6,319.4L259.6,308.7L242.1,429.2L257.6,431.2L258.9,421.1L288.1,424z"
    }, {
        code: "ks",
        path: "M507.8,324.3L495.2,324.5L449.1,324.1L404.6,322L379.9,320.8L383.8,256.2L405.9,256.8L446.2,257.7L490.5,258.7L495.6,258.7L497.8,260.8L499.8,260.8L501.4,261.8L501.4,264.8L499.6,266.6L499.2,268.8L501.1,272.2L504,275.4L506.3,277L507.6,288.2L507.8,324.3z"
    }, {
        code: "ne",
        path: "M486,240.7L489.3,247.7L489.1,250L492.6,255.5L495.3,258.6L490.3,258.6L446.8,257.7L406,256.8L383.8,256L384.8,234.7L352.5,231.8L356.9,187.7L372.4,188.8L392.5,189.9L410.4,191.1L434.1,192.2L444.9,191.7L446.9,194L451.7,197L452.9,197.9L457.2,196.6L461.1,196.1L463.9,195.9L465.7,197.2L469.7,198.8L472.7,200.4L473.2,202L474.1,204.1L475.9,204.1L476.7,204.1L477.6,208.8L480.5,217.3L481.1,221L483.6,224.8L484.2,229.9L485.8,234.2L486,240.7z"
    }, {
        code: "sd",
        path: "M476.4,204L476.3,203.4L473.5,198.5L475.3,193.8L476.8,187.9L474,185.9L473.6,183.1L474.4,180.6L477.6,180.6L477.5,175.6L477.2,145.4L476.5,141.6L472.5,138.3L471.5,136.6L471.4,135L473.5,133.5L475,131.8L475.2,129.2L417,127.6L362.2,124.1L356.8,187.8L371.4,188.7L391.4,189.9L409.1,190.9L432.9,192.2L444.9,191.7L446.9,194L452.1,197.2L452.8,198L457.4,196.5L463.9,195.9L465.6,197.2L469.8,198.8L472.7,200.5L473.1,201.9L474.2,204.2L476.4,204z"
    }, {
        code: "nd",
        path: "M475.3,128.9L474.6,120.4L473,113.6L471.1,100.6L470.6,89.6L468.9,86.5L467.1,81.3L467.1,70.9L467.8,67.1L465.9,61.6L437.3,61L418.7,60.4L392.2,59.1L369.2,57L362.3,124.1L417.2,127.5L475.3,128.9z"
    }, {
        code: "wy",
        path: "M360.3,143.2L253.6,129.8L239.5,218.2L352.8,231.8L360.3,143.2z"
    }, {
        code: "mt",
        path: "M369.2,56.9L338.5,54.1L309.2,50.6L280,46.5L247.6,41.2L229.2,37.8L196.5,30.9L192,52.2L195.4,59.7L194.1,64.3L195.9,68.9L199.1,70.3L203.7,81L206.4,84.2L206.9,85.3L210.3,86.5L210.7,88.5L203.7,106.2L203.7,108.7L206.2,111.9L207.1,111.9L211.9,108.9L212.6,107.8L214.2,108.4L213.9,113.7L216.7,126.3L219.7,128.8L220.6,129.5L222.4,131.8L221.9,135.2L222.6,138.6L223.8,139.5L226.1,137.2L228.8,137.2L232,138.8L234.5,137.9L238.6,137.9L242.3,139.5L245,139.1L245.5,136.1L248.5,135.4L249.8,136.8L250.3,140L251.7,140.8L253.6,129.8L360.4,143.2L369.2,56.9z"
    }, {
        code: "co",
        path: "M380,320.9L384.9,234.6L271.5,221.9L259.3,309.9L380,320.9z"
    }, {
        code: "id",
        path: "M148.4,176.4L157.2,141.2L158.6,137L161.1,131L159.8,128.8L157.3,128.9L156.5,127.8L157,126.7L157.3,123.6L161.8,118.1L163.6,117.7L164.7,116.5L165.3,113.3L166.2,112.6L170.1,106.8L174,102.5L174.2,98.7L170.8,96.1L169.3,91.7L182.9,28.3L196.4,30.8L192,52.2L195.6,59.7L194,64.4L196,69L199.1,70.3L202.9,79.8L206.4,84.3L206.9,85.4L210.3,86.6L210.7,88.6L203.7,106L203.5,108.6L206.1,111.9L207.1,111.9L212,108.8L212.6,107.7L214.2,108.4L213.9,113.8L216.7,126.3L220.6,129.5L222.3,131.7L221.5,135.8L222.6,138.6L223.7,139.7L226.2,137.3L229,137.4L231.9,138.7L234.7,138L238.5,137.9L242.5,139.5L245.2,139.2L245.7,136.1L248.6,135.4L249.9,136.9L250.3,139.8L251.8,141L243.4,194.6 C 243.4,194.6 155.4,177.9 148.4,176.4z",
        middleY: 0.75
    }, {
        code: "ut",
        path: "M259.4,310.1L175.7,298.2L196.3,185.6L243.1,194.4L241.6,205L239.3,218.2L247.1,219.1L263.5,220.9L271.7,221.8L259.4,310.1z"
    }, {
        code: "az",
        path: "M144.9,382.6L142.2,384.7L141.9,386.2L142.4,387.2L161.3,397.8L173.4,405.4L188.1,414L205,424L217.2,426.4L242.2,429.2L259.5,310L175.7,298.1L172.6,314.5L171,314.5L169.3,317.2L166.8,317L165.5,314.3L162.8,314L161.9,312.8L161,312.8L160,313.4L158.1,314.4L158,321.4L157.8,323.1L157.2,335.7L155.7,337.9L155.1,341.2L157.9,346.1L159.1,351.9L159.9,352.9L161,353.5L160.8,355.8L159.2,357.2L155.8,358.9L153.9,360.8L152.4,364.5L151.8,369.4L149,372.1L146.9,372.8L147,373.7L146.6,375.4L147,376.2L150.7,376.7L150.1,379.5L148.6,381.7L144.9,382.6z"
    }, {
        code: "nv",
        path: "M196.3,185.5L172.7,314.3L170.9,314.7L169.3,317.1L166.9,317.1L165.5,314.4L162.8,314L162.1,312.9L161,312.8L158.2,314.5L157.9,321.3L157.6,327L157.2,335.6L155.8,337.7L153.3,336.6L84.3,232.4L103.3,164.9L196.3,185.5z"
    }, {
        code: "or",
        path: "M148.7,175.5L157.5,140.7L158.6,136.5L160.9,130.8L160.3,129.7L157.8,129.6L156.5,127.9L157,126.5L157.5,123.2L161.9,117.7L163.8,116.7L164.9,115.5L166.4,111.9L170.4,106.3L174,102.4L174.2,99L171,96.5L169.2,91.8L156.5,88.2L141.4,84.7L126,84.8L125.5,83.4L120.1,85.5L115.6,84.9L113.2,83.3L111.9,84L107.2,83.8L105.5,82.4L100.3,80.3L99.5,80.5L95.1,79L93.2,80.8L87,80.5L81.1,76.3L81.8,75.5L82,67.8L79.7,63.9L75.6,63.3L74.9,60.8L72.5,60.3L66.7,62.4L64.5,68.9L61.2,78.9L58,85.3L53,99.4L46.5,113L38.5,125.6L36.5,128.5L35.7,137.1L36.1,149.2L148.7,175.5z"
    }, {
        code: "wa",
        path: "M102,7.6L106.4,9L116.1,11.8L124.7,13.7L144.7,19.4L167.7,25L182.9,28.2L169.2,91.8L156.8,88.3L141.3,84.7L126.1,84.8L125.6,83.4L120,85.6L115.4,84.8L113.3,83.3L112,83.9L107.2,83.8L105.5,82.4L100.3,80.3L99.5,80.5L95.1,78.9L93.2,80.8L87,80.5L81,76.3L81.8,75.4L81.9,67.7L79.7,63.9L75.6,63.3L74.9,60.8L72.6,60.3L69,61.5L66.8,58.3L67.1,55.4L69.9,55.1L71.5,51L68.9,49.9L69,46.2L73.4,45.6L70.7,42.8L69.2,35.7L69.9,32.8L69.9,24.9L68.1,21.6L70.3,12.2L72.4,12.7L74.9,15.6L77.6,18.2L80.8,20.2L85.4,22.3L88.4,22.9L91.4,24.4L94.7,25.3L97,25.2L97,22.8L98.3,21.6L100.4,20.3L100.7,21.5L101.1,23.2L98.8,23.7L98.5,25.8L100.2,27.3L101.4,29.7L102,31.6L103.5,31.5L103.6,30.2L102.7,28.9L102.2,25.7L103,23.9L102.3,22.4L102.3,20.2L104.1,16.6L103,14L100.6,9.2L100.9,8.4L102,7.6zM92.6,13.5L94.6,13.4L95.1,14.8L96.6,13.1L99,13.1L99.8,14.7L98.2,16.4L98.9,17.2L98.1,19.2L96.8,19.6 C 96.8,19.6 95.9,19.7 95.9,19.4 C 95.9,19 97.3,16.8 97.3,16.8L95.6,16.2L95.3,17.7L94.6,18.3L93.1,16L92.6,13.5z"
    }, {
        code: "ca",
        path: "M144.6,382.1L148.6,381.7L150.1,379.6L150.6,376.7L147.1,376.1L146.5,375.4L147,373.4L146.9,372.8L148.8,372.2L151.8,369.4L152.4,364.4L153.8,361L155.7,358.8L159.3,357.2L160.9,355.6L161,353.5L160,352.9L159,351.9L157.8,346L155.1,341.2L155.7,337.7L153.3,336.6L84.2,232.5L103.1,164.9L36,149.2L34.5,153.9L34.4,161.3L29.2,173.1L26.1,175.7L25.8,176.9L24,177.7L22.6,181.9L21.8,185.1L24.5,189.3L26.1,193.5L27.2,197.1L26.9,203.5L25.1,206.6L24.5,212.4L23.5,216.1L25.3,220L28.1,224.5L30.3,229.4L31.6,233.4L31.3,236.7L31,237.2L31,239.3L36.6,245.6L36.1,248L35.5,250.2L34.8,252.2L35,260.4L37.1,264.1L39,266.7L41.8,267.2L42.8,270L41.6,273.5L39.5,275.1L38.4,275.1L37.6,279L38.1,281.9L41.3,286.3L42.9,291.6L44.4,296.3L45.7,299.4L49.1,305.2L50.5,307.8L51,310.7L52.6,311.7L52.6,314.1L51.8,316L50,323.2L49.6,325.1L52,327.8L56.2,328.3L60.7,330.1L64.6,332.2L67.5,332.2L70.4,335.3L73,340.1L74.1,342.4L78,344.5L82.9,345.3L84.3,347.4L85,350.6L83.5,351.3L83.8,352.3L87.1,353.1L89.8,353.2L93,351.5L96.9,355.7L97.7,358L100.2,362.2L100.6,365.4L100.6,374.8L101.1,376.6L111.1,378.1L130.8,380.8L144.6,382.1zM56.5,338.4L57.8,340L57.6,341.3L54.4,341.2L53.8,340L53.2,338.5L56.5,338.4zM58.4,338.4L59.7,337.8L63.2,339.9L66.3,341.1L65.4,341.7L60.9,341.5L59.3,339.9L58.4,338.4zM79.1,358.2L80.9,360.6L81.7,361.5L83.3,362.1L83.8,360.7L82.9,358.9L80.2,356.9L79.1,357L79.1,358.2zM77.7,366.9L79.5,370L80.7,372L79.2,372.2L77.9,371 C 77.9,371 77.2,369.6 77.2,369.1 C 77.2,368.7 77.2,367 77.2,367L77.7,366.9z",
        middleX: 0.35
    }];


    // Load the data from a Google Spreadsheet 
    // https://docs.google.com/a/highsoft.com/spreadsheet/pub?hl=en_GB&hl=en_GB&key=0AoIaUO7wH1HwdFJHaFI4eUJDYlVna3k5TlpuXzZubHc&output=html
    Highcharts.data({
        
        googleSpreadsheetKey: '1TBeu3tTcAyLHYi1ehoXe3QI47lE044pjvLGOw8Dgo-o',
        
        // custom handler for columns
        parsed: function(columns) {
            
            /**
             * Event handler for clicking points. Use jQuery UI to pop up 
             * a pie chart showing the details for each state.
             */

            function pointClick() {
                var row = this.options.row,
                    $div = $('<div></div>')
                        .dialog({
                            title: this.name,
                            width: 400,
                            height: 300
                        });
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: $div[0],
                        type: 'pie',
                        width: 370,
                        height: 240
                    },
                    title: {
                        text: null
                    },
                    series: [{
                        name: 'Region',
                        data: [{
                            name: 'Alaska',
                            color: '#F4A460',
                            y: parseInt(columns[2][row])
                        }, {
                            name: 'Eastern and Northeastern',
                            color: '#52A68A',
                            y: parseInt(columns[2][row])
                        }, {
                            name: 'Southern',
                            color: '#2E8B57',
                            y: parseInt(columns[2][row])
                        }, {
                            name: 'Pacific Northwest',
                            color: '#4169E1',
                            y: parseInt(columns[2][row])
                        }, {
                            name: 'Pacific Southwest',
                            color: '#4682B4',
                            y: parseInt(columns[2][row])
                        }, {
                            name: 'Inter Mountain',
                            color: '#C0C0C0',
                            y: parseInt(columns[2][row])
                        }, {
                            name: 'South Western',
                            color: '#CCFFED',
                            y: parseInt(columns[2][row])
                        }, {
                            name: 'Rocky Mountain',
                            color: '#F5DEB3',
                            y: parseInt(columns[2][row])
                        }, {
                            name: 'Northern',
                            color: '#F0E68C',
                            y: parseInt(columns[2][row])
                        }],
                        dataLabels: {
                            format: '<b>{point.name}</b> {point.percentage:.1f}%'
                        }
                    }]
                });
            }

         // Make the columns easier to read
            var keys = columns[0],
                region = columns[1],
                name = columns[2];
    
            // Build the chart options
            var options = {
                chart : {
                    renderTo : 'containermap2',
                    type : 'map',
                    borderWidth : 1
                },
                
                title : {
                    text : 'US Forest Service Regions'
                },
                // subtitle : {
                //     text : 'Source: <a href="http://en.wikipedia.org/wiki/United_States_presidential_election,'+
                //         '_2008#Election_results">Wikipedia</a>'
                // },
                
                legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    x: 0,
                    y: 0,
                    floating: true,
                    layout: 'vertical',
                    valueDecimals: 0,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)',
                },

                mapNavigation: {
                    enabled: true,
                    enableButtons: true
                },

                colorAxis: {

                    dataClasses: [{
                        from: 1,
                        to: 1,
                        color: '#F0E68C',
                        name: 'Northern'
                    }, {
                        from: 2,
                        to: 2,
                        color: '#F5DEB3',
                        name: 'Rocky Mountain'
                    }, {
                        from: 3,
                        to: 3,
                        color: '#CCFFED',
                        name: 'South Western'
                    }, {
                        from: 4,
                        to: 4,
                        color: '#C0C0C0',
                        name: 'Inter Mountain'
                    }, {
                        from: 5,
                        to: 5,
                        color: '#4682B4',
                        name: 'Pacific Southwest'
                    }, {
                        from: 6,
                        to: 6,
                        color: '#4169E1',
                        name: 'Pacific Northwest'
                    }, {
                        from: 8,
                        to: 8,
                        color: '#2E8B57',
                        name: 'Southern'
                    }, {
                        from: 9,
                        to: 9,
                        color: '#FF0000',
                        name: 'Eastern and Northeastern Area'
                    }, {
                        from: 10,
                        to: 10,
                        color: '#F4A460',
                        name: 'Alaska'
                    }]
                },

                series : [{
                    data : [],
                    dataLabels: {
                        enabled: true,
                        color: 'black',
                        format: '{point.code}',
                        style: {
                            textTransform: 'uppercase'
                        }
                    },
                    name: 'US Forest Service Regions',
                    point: {
                        events: {
                            click: pointClick
                        }
                    },
                    tooltip: {
                        ySuffix: ' %'
                    },
                    cursor: 'pointer'
                }]
            };
            
            Highcharts.each(Highcharts.maps.us, function (mapPoint) {
                var key = mapPoint.code,
                    i = $.inArray(key, keys);
                options.series[0].data.push(Highcharts.extend({
                    value : parseFloat(region[i]),
                    name : name[i],
                    key: key,
                    row: i
                }, mapPoint));
            });
            
            // Initiate the chart
            chart = new Highcharts.Map(options);
        },

        error: function () {
            $('#container').html('<div class="loading">' + 
                '<i class="icon-frown icon-large"></i> ' + 
                'Error loading data from Google Spreadsheets' + 
                '</div>');
        }
        
        
    });
});


	$(function () {

    // Initiate the chart
    $('#containermap').highcharts('Map', {
        chart : {
                borderWidth : 1
            },
            
        title : {
                text : 'Operational slas'
            },
		
        legend: {
            enable: true
        },
            

        mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            
        series:
        [
			{
				"type": "map",
				"data": [
					{
						"name": "path3049",
						"path": "M85,-1007,88,-983,51,-1003,51,-969,15,-877,0,-815,16,-712,32,-659,86,-595,199,-546,258,-534,312,-958z"
					}],
				"type": "map",
				"name": "Operational SLA",
				"data": [
					{
						"name": "Wetern-USA",
						"path": "M227,-541,200,-547,143,-571,87,-596,60,-627C46,-644,33,-659,33,-660,32,-661,28,-673,24,-687,18,-710,17,-715,9,-763L1,-815,8,-845C15,-874,16,-876,34,-922L52,-969,52,-985C52,-993,52,-1000,53,-1000,53,-1000,61,-996,71,-991,80,-986,88,-982,89,-982,89,-982,88,-988,88,-994,87,-1000,86,-1005,86,-1005,87,-1006,309,-958,310,-957,310,-956,299,-861,284,-746,262,-567,257,-535,256,-535,255,-535,242,-538,227,-541L227,-541z"
					},
					{
						"name": "Central-USA",
						"path": "M309,-959,259,-545,358,-468,481,-386,552,-937z"
					},
					{
						"name": "Eastern-USA",
						"path": "M551,-937C614,-925,645,-920,645,-920L710,-891,648,-851,660,-780,678,-780,678,-828,687,-863,698,-879,727,-870,725,-833,737,-845,753,-810,736,-788,755,-781,813,-825,808,-840,846,-866,869,-892,926,-906,950,-973,963,-975,1000,-920,952,-846,963,-835,892,-693,913,-662,816,-512,858,-436,857,-403,845,-396,797,-449,761,-504,658,-470,564,-482,488,-434z"
					}
				]
			}
		]
	
    });
});
}