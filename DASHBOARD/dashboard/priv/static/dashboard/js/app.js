'use strict';

angular.module('dashboard', ['ngRoute', 'ngResource']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/', {templateUrl:'partials/view.html',controller: DashboardCtrl}).
			otherwise({redirectTo:'/'})
	}]);