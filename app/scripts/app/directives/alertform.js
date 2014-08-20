//top level directive
//var app = angular.module('hoosclass');

app.directive('alertForm', function() {
    return {
        restrict: 'E',
        templateUrl: 'scripts/app/views/alertform.html',
        controller: ['$scope', '$attrs', 'helperFunctions', '$http',
            function($scope, $attrs, helperFunctions, $http) {
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

                $scope.email = "";
                $scope.phone_number = "";

                $scope.searchedProperly = false;
                $scope.search = function() {
                    $scope.searchedProperly = $scope.acronym !== "" || $scope.number !== "" || $scope.instructor !== "";
                    $scope.getClasses();
                };

                $scope.getClasses = function() {
                    $scope.courses = [];

                    if ($scope.searchedProperly) {
                        $scope.courses = helperFunctions.getCourses($scope.acronym, $scope.number, $scope.instructor, $scope.building, $scope.room, $scope.days, $scope.time, $scope.units, $scope.title, $scope.topics, $scope.desc);
                    }
                    //alert($scope.courses);
                };


                $scope.tooltipstyle = function(course) {
                    //console.log(course);
                    var out = "";
                    out += String.format("<b>{0}</b><br/><b>{1}</b>", course.acronym, course.name);

                    out += "<br/>";

                    out += String.format("{0} ({1} units)<br/>", helperFunctions.getClassTypeFromNumber(course.classType), course.units);
                    if (course.status === 'w') {
                        out += String.format("Waitlist: {0}<br/>", course.waitlist);
                    }
                    if (course.status === 'o') {
                        out += String.format("Open: {0}<br/>", course.spots);
                    }
                    if (course.status === 'c') {
                        out += "Closed<br/>";
                    }
                    out += String.format("{0}<br/>", course.professor);
                    out += String.format("{0}<br/>", course.timing);
                    out += String.format("{0}<br/>", course.room);

                    return out;
                };

                $scope.atleastOneSelected = function() {
                    for (var i = 0; i < $scope.courses.length; i++) {
                        if ($scope.courses[i].selected === true) {
                            //console.log("atleast one selected.");
                            return true;
                        }
                    }
                    return false;
                };




                $scope.alertClicked = function() {
                    var socket = io();
                    var selectedCourses = [];
                    angular.forEach($scope.courses, function(course) {

                        if (course.selected) {
                            socket.emit('sendEmails', [course, $scope.email, $scope.phone_number]);
                            //console.log("course sent from client side");
                        }

                    });
                    //send to backend to put into db.
                    //open up a modal to show 
                    //that selected courses have been logged and alerts will be sent.  

                };

            }
        ]
    };
});