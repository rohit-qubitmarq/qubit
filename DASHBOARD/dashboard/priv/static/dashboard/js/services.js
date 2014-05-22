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

	// factory('uploadManager', function ($rootScope) {
	// 	var _files = [];
	// 	return {
	// 		add: function (file) {
	// 			_files.push(file);
	// 			$rootScope.$broadcast('fileAdded', file.files[0].name);
	// 		},
	// 		clear: function () {
	// 			_files = [];
	// 		},
	// 		files: function () {
	// 			var fileNames = [];
	// 			$.each(_files, function (index, file) {
	// 				fileNames.push(file.files[0].name);
	// 			});
	// 			return fileNames;
	// 		},
	// 		upload: function () {
	// 			$.each(_files, function (index, file) {
	// 				file.submit();
	// 			});
	// 			this.clear();
	// 		},
	// 		setProgress: function (percentage) {
	// 			$rootScope.$broadcast('uploadProgress', percentage);
	// 		}
	// 	};
	// });

	// factory('upload', ['uploadManager', function factory(uploadManager) {
	// 	return {
	// 		restrict: 'A',
	// 		link: function (scope, element, attrs) {
	// 			$(element).fileupload({
	// 				dataType: 'text',
	// 				add: function (e, data) {
	// 					uploadManager.add(data);
	// 				},
	// 				progressall: function (e, data) {
	// 					var progress = parseInt(data.loaded / data.total * 100, 10);
	// 					uploadManager.setProgress(progress);
	// 				},
	// 				done: function (e, data) {
	// 					uploadManager.setProgress(0);
	// 				}
	// 			});
	// 		}
	// 	};
	// }]);
	

// var app = angular.module('dashboard');

// app.config(function ($httpProvider) {
//     $httpProvider.defaults.transformRequest = function(data){
//         if (data === undefined) {
//             return data;
//         }
//         return $.param(data);
//     }
// })


