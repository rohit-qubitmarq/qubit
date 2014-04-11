'use strict';

function TodoCtrl($scope, $http) {
    var config = {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}};

    $scope.todos = [];

    $http.get('/todo/todo_json').success(function(data){
        $scope.todos = data;
    });

    $scope.addTodo = function (){
        if(!($scope.todoText)){
            return;
        }
        if ($scope.todos === ""){
            $scope.todos = [];
        }
        var sendData = "todotxt=" + $scope.todoText;
        $http.post('/todo/todo_add', sendData, config).success(function(data){
            $scope.todos.unshift(data.task);
        });
        $scope.todoText = '';
    };

    $scope.editCheck = function(todo){
        var sendcheckId = "id=" +(todo.id) + "&complete=" + todo.complete;
        $http.post('/todo/todo_editcheck', sendcheckId, config);
    };

    $scope.remaining = function() {
        var count = 0;
        angular.forEach($scope.todos, function(todo) {
            count += todo.complete ? 0 : 1;
        });
    return count;
    };

    $scope.delete = function(){
        var array = [];
        for (var todo in $scope.todos){
            if($scope.todos[todo].complete === false){
                array.unshift($scope.todos[todo]);
            }
            else{
                deleteTask($scope.todos[todo].id);
            }
        }
        $scope.todos = array;
    };

    var deleteTask = function(id){
        var taskDelete = "id=" + id ;
        $http.post('/todo/todo_delete', taskDelete, config).success(function(data){
        console.log("Deleted");
        });
    };
}



 // var jsonTask = function(){
    //     $http.get('/todo/todo_json').success(function(data){
    //         $scope.todos = data.task;
    //     });
    // };
    // jsonTask();