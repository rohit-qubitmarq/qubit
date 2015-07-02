'use strict';

angular.module('dashboard', ['dashboardServices', 'ngCookies', 'ngRoute', 'highcharts-ng',
 'ngUpload', 'onReadFile', 'angularTreeview', 'ngAnimate', 'ui.router']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/', {templateUrl:'partials/view.html',controller: ChartCtrl}).
			when('/register', {templateUrl:'partials/register.html',controller: DashboardCtrl}).

			when('/state1', {templateUrl:'partials/state1.html',controller: MetricUploadCtrl}).
			when('/list', {templateUrl:'partials/state1.list.html',controller: MetricUploadCtrl}).
			when('/state2', {templateUrl:'partials/state2.html',controller: MetricUploadCtrl}).
			when('/list', {templateUrl:'partials/state2.list.html',controller: MetricUploadCtrl}).

			when('/charts', {templateUrl:'partials/charts.html',controller: ChartCtrl}).
			when('/charts2', {templateUrl:'partials/charts2.html',controller: ChartCtrl}).
			when('/charts3', {templateUrl:'partials/charts3.html',controller: ChartCtrl}).
			when('/charts_sla', {templateUrl:'partials/charts_sla.html',controller: ChartCtrl}).
			when('/charts_tracker', {templateUrl:'partials/charts_tracker.html',controller: ChartCtrl}).
			when('/charts_aging', {templateUrl:'partials/charts_aging.html',controller: ChartCtrl}).
			when('/charts_crm_case', {templateUrl:'partials/charts_crm_case.html',controller: ChartCtrl}).
			when('/charts_sinq_errors', {templateUrl:'partials/charts_sinq_errors.html',controller: ChartCtrl}).
			when('/charts_drilldown', {templateUrl:'partials/charts_drilldown.html',controller: ChartCtrl}).

			when('/charts_hiring_manager', {templateUrl:'partials/hiringmanager_chart.html',controller: ChartCtrl}).
			when('/charts_tentative', {templateUrl:'partials/tentative_charts.html',controller: ChartCtrl}).
			when('/charts_inventory_org', {templateUrl:'partials/inventory_org_chart.html',controller: ChartCtrl}).
			when('/charts_inventory_opm', {templateUrl:'partials/inventory_opm_chart.html',controller: ChartCtrl}).


			
			when('/maps', {templateUrl:'partials/maps.html',controller: MapsCtrl}).
			when('/mapsregion', {templateUrl:'partials/mapsregion.html'}).
			when('/mapsregionstates', {templateUrl:'partials/mapsregionstates.html',controller: MapsCtrl1}).

			when('/upload', {templateUrl:'partials/upload.html',controller: MetricUploadCtrl}).

			when('/newupload', {templateUrl:'partials/newUpload.html',controller: MetricUploadCtrl}).


			when('/uploadhiringmanager', {templateUrl:'partials/hiringmanager.html',controller:hiringmanagerUploadCtrl}).
			when('/uploadtentative', {templateUrl:'partials/tentative.html',controller:tentativeUploadCtrl}).
			when('/uploadinventory_org', {templateUrl:'partials/inventory_org.html',controller:inventory_orgUploadCtrl}).
			when('/uploadinventory_opm', {templateUrl:'partials/inventory_opm.html',controller:inventory_opmUploadCtrl}).


			when('/uploadfncs', {templateUrl:'partials/uploadfncs.html',controller:FncsRecruitListUploadCtrl}).
			when('/uploadtracker', {templateUrl:'partials/TrackerRequestUpload.html',controller:TrackerRequestUploadCtrl}).
			when('/uploadagingexample', {templateUrl:'partials/uploadagingexample.html',controller:AgingExampleUploadCtrl}).
			when('/uploadcrmcase', {templateUrl:'partials/uploadcrmcase.html',controller:CrmCaseUploadCtrl}).
			when('/uploadsinq', {templateUrl:'partials/uploadsinq.html',controller:SinqErrorsUploadCtrl}).
			when('/uploadcolumn_drilldown', {templateUrl:'partials/uploadcoldrill.html',controller:ColDrilldownCtrl}).

			when ('/sec_priority_org', {templateUrl:'partials/sec_priority_dashboard.html'}).
			when ('/sec_priority_current_status', {templateUrl:'partials/sec_priority_organization.html'}).

			// when('/catalog-roles/:catalogId', {templateUrl:'partials/catalog-roles.html', controller:DashboardCtrl}).
			// when('/role-stages/:roleId', {templateUrl:'partials/role-stages.html', controller:DashboardCtrl}).
			// when('/stage-metrics/:stageId', {templateUrl:'partials/stage-metrics.html', controller:DashboardCtrl}).
			otherwise({redirectTo:'/'})
	}]);