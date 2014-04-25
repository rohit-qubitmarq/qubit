function DashboardCtrl($scope, $http, $location, $routeParams){
	var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

	$scope.data =function(){
		 var fromServer = ({
            "answers": [{"text":"Answer 1","correct":true}, {"text":"Another Answer 2","correct":false}]
        });
        console.log(fromServer);
		$http.post('/metricdashboard/get_data', fromServer, config).success(function(data) {
			console.log(data);
			// location.reload();
			// alert("json data uploaded and added to mongoDB");
		});
	};
}