app.directive('selectClass', function() {
    return {
        restrict: 'E',
        require: '^alertForm',
        templateUrl: 'scripts/app/views/selectclass.html',
        controller: ['$scope', '$attrs', 'helperFunctions', '$http',
            function($scope, $attrs, helperFunctions, $http) {
                //get a list of courses based on input.
                //popups for each course.

                $scope.courses = [];

                $scope.$on('search', function() {
                    $scope.getCourses();
                });
                $scope.getCourses = function() {
                    var query = "select * from htmlpost where url='http://rabi.phys.virginia.edu/mySIS/CS2/page.php?Semester=1148&Type=Search'";
                    var postdata = String.format(" and postdata='iMnemonic={0}&iNumber={1}&iStatus=&iInstructor={2}&iBuilding={3}&iRoom={4}&iDays={4}&iTime={5}&iUnits={6}&iTitle={7}&iTopic={8}&iDescription={9}&Submit=Search+for+Classes'", $scope.acronym, $scope.number, $scope.instructor, $scope.building, $scope.room, $scope.days, $scope.time, $scope.units, $scope.title, $scope.topics, $scope.desc);
                    var other = " and xpath='//tr[contains(@class,\"SectionEven\")] | //tr[contains(@class,\"SectionOdd\")]  '";

                    if ($scope.searchedProperly) {
                        console.log("called");
                        $http.get("https://query.yahooapis.com/v1/public/yql", {
                            params: {
                                q: query + postdata + other,
                                format: "json",
                                diagnostics: false,
                                env: "store://datatables.org/alltableswithkeys",
                                callback: ""
                            },
                            cache: true

                        }).then(function(res) {
                            if (Object.prototype.toString.call(res.data.query.results.postresult.tr) === '[object Array]') {
                                angular.forEach(res.data.query.results.postresult.tr, function(item) {


                                    helperFunctions.getCourseFromBigPage(item).then(
                                        function(data) {
                                            $scope.courses += data;
                                        });

                                });
                            } else {
                                var item = res.data.query.results.postresult.tr;
                                $scope.courses += helperFunctions.getCourseFromBigPage(item);

                            }

                        });
                    }

                };

            }
        ]
    };
});