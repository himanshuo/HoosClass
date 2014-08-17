app.directive('questions', function() {
    return {
        restrict: 'E',
        require: '^alertForm',
        templateUrl: 'scripts/app/views/questions.html',
        controller: ['$scope', '$attrs',
            function($scope, $attrs) {
                //form validation here. - one or more of the values must be chosen
                //perhaps some way to seperate cs and cs2150
                //lookaheads
                //  


                $scope.search = function(){
                    $scope.searchedProperly = ($scope.acronym !== "" || $scope.number !== "" || $scope.instructor !== "");
                    $scope.$emit('search', null);
                };


            }
        ]
    };
});