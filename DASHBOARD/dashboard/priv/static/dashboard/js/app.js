'use strict';

angular.module('dashboard', ['dashboardServices', 'ngCookies', 
								'ngRoute', 'highcharts-ng', 
								'ngUpload', 'onReadFile',
								'angularTreeview']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/', {templateUrl:'partials/view.html',controller: DashboardCtrl}).
			when('/register', {templateUrl:'partials/register.html',controller: DashboardCtrl}).
			when('/charts', {templateUrl:'partials/charts.html',controller: ChartCtrl}).
			when('/charts2', {templateUrl:'partials/charts2.html',controller: ChartCtrl}).
			when('/charts3', {templateUrl:'partials/charts3.html',controller: ChartCtrl}).
			when('/upload', {templateUrl:'partials/upload.html',controller: FileUploadCtrl}).
			when('/catalog-roles/:catalogId', {templateUrl:'partials/catalog-roles.html', controller:DashboardCtrl}).
			when('/role-stages/:roleId', {templateUrl:'partials/role-stages.html', controller:DashboardCtrl}).
			when('/stage-metrics/:stageId', {templateUrl:'partials/stage-metrics.html', controller:DashboardCtrl}).
			otherwise({redirectTo:'/'})
	}]);