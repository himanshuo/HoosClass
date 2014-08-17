//top level directive
//var app = angular.module('hoosclass');

app.directive('alertForm', function() {
    return {
        restrict: 'E',
        templateUrl: 'scripts/app/views/alertform.html',
        controller: ['$scope', '$attrs',
            function($scope, $attrs) {
                $scope.courses = [];
                //currently being used.
                $scope.acronym = "";
                $scope.number = "";
                $scope.instructor = "";

                $scope.building = "";
                $scope.room = "";
                $scope.days = "";
                $scope.time = "";
                $scope.units = "";
                $scope.title = "";
                $scope.topics = "";
                $scope.desc = "";

                $scope.email="";
                $scope.phone_number="";

                

              $scope.searchedProperly=false;
              

            }
        ]
    };
});