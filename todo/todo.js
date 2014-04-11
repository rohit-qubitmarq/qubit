    function TodoCtrl($scope, $http) {
        $http.get('todo.json').success(function(data){
            $scope.todos = data;
            console.log($scope.todos);
        });

    $scope.addTodo = function() {
    $scope.todos.unshift({text:$scope.todoText, complete:false});
    $scope.todoText = '';
    };
    
    $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.todos, function(todo) {
    count += todo.complete ? 0 : 1;
    });
    return count;
    console.log(count);
    };

    $scope.delete = function() {
    var oldTodos = $scope.todos;
    $scope.todos = [];
    angular.forEach(oldTodos, function(todo) {
    if (!todo.complete) $scope.todos.unshift(todo);
    });
    };
    }