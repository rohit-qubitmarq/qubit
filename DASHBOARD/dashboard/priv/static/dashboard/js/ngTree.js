var app = angular.module('dashboard',[])
app.directive('menu', function() {
  return {
    template: '<ul><menu-node ng-repeat="list in tree"></menu-node></ul>',
    restrict: 'E',
    replace: true,
    scope: {
      tree:'=tree'
    }
  };
})
app.directive('menuNode', function($compile) {
  return { 
    restrict: 'E',
    template: '<li>{{tree.parent}}</li>',
    link: function(scope, elm, attrs) {
      if (scope.tree.child.length > 0) {
        var children = $compile('<menu tree="tree.child"></menu>')(scope);
        elm.append(children);
      }
    }
  };
});