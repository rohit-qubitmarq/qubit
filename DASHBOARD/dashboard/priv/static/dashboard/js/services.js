'use strict';

/* Services */
angular.module('dashboardServices', ['ngResource']).
	factory('LoginService', function($resource) {
		var personDetails = {
			isLogged: false,
			username: '',
			getUser: function(){
				return this.username;
			}
		};
		return personDetails;
	});