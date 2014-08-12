angular.module('plunker', ['ui.bootstrap']);

function AccordionDemoCtrl($scope, $http, $timeout) {

    $scope.oneAtATime = true;
    $scope.groups = [{
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
    }, {
        title: 'Dynamic Group Header - 2',
        content: 'Dynamic Group Body - 2'
    }];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    $scope.courses = [];

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

    //$scope.selectedCourses=[];

    /*
select td.p from htmlpost where
url='http://rabi.phys.virginia.edu/mySIS/CS2/page.php?Semester=1148&Type=Search' 
and postdata='iMnemonic=cs&iNumber=&iInstructor=&iBuilding=&iRoom=&iDays=&iTime=&iUnits=&iTitle=&iTopic=&iDescription=&Submit=Search+for+Classes' and xpath='//td[contains(@class,"CourseNum")]'

*/

    if (!String.format) {
        String.format = function(format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };
    }

    //define trim method for older browsers. (IE8)
    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }



    function is_int(value) {
        if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
            return true;
        } else {
            return false;
        }
    }

    function equalsIgnoreCase(string1, string2) {
        return string1.toUpperCase() === string2.toUpperCase();
    }

    function containsIgnoreCase(outer, inner) {
        if (outer.toUpperCase().indexOf(inner.toUpperCase()) == -1) {
            return false;
        } else {
            return true;
        }
    }


    //setTimeout(getClasses,10);
    $scope.getClasses = function() {
        $scope.courses = [];
        console.log("hi");
        //alert("acronym:"+$scope.acronym+"number"+$scope.number+ "courses:"+$scope.courses);
        if (($scope.acronym.length === 0 || $scope.acronym.length > 1) && ($scope.number.length === 0 || $scope.number.length > 2)) {

            var query = "select * from htmlpost where url='http://rabi.phys.virginia.edu/mySIS/CS2/page.php?Semester=1148&Type=Search'";
            var postdata = String.format(" and postdata='iMnemonic={0}&iNumber={1}&iInstructor={2}&iBuilding={3}&iRoom={4}&iDays={4}&iTime={5}&iUnits={6}&iTitle={7}&iTopic={8}&iDescription={9}&Submit=Search+for+Classes'", $scope.acronym, $scope.number, $scope.instructor, $scope.building, $scope.room, $scope.days, $scope.time, $scope.units, $scope.title, $scope.topics, $scope.desc);
            var other = " and xpath='//tr[contains(@class,\"SectionEven\")] | //tr[contains(@class,\"SectionOdd\")]  '";
            //  var test = "select p from html where url='http://rabi.phys.virginia.edu/mySIS/CS2/page.php?Semester=1148&Type=Group&Group=Mathematics' and xpath='//td[contains(@class,\"CourseNum\")]'"
            //alert(query + postdata + other);
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
                //alert(res);
                //var classes = [];
                console.log(res);
                console.log(res.data.query.results.postresult.tr);
                
                if( Object.prototype.toString.call( res.data.query.results.postresult.tr ) === '[object Array]' ) {
                   angular.forEach(res.data.query.results.postresult.tr, function(item) {
                   
                    console.log(item.class);
                    getCourseFromBigPage(item);
                  

                });
                }
                else
                {
                  item = res.data.query.results.postresult.tr;
                  getCourseFromBigPage(item);

                }

               



                //alert($scope.courses);
            });
        }

    };


    function getCourseFromBigPage(item) {


        try {
            var formatCourseAcronym = item.class.split(" ")[2];
            //console.log(formatCourseAcronym);
            if (is_int(formatCourseAcronym[2])) {
                formatCourseAcronym = formatCourseAcronym.substring(0, 2) + " " + formatCourseAcronym.substring(2, formatCourseAcronym.length);
            } else if (is_int(formatCourseAcronym[3])) {
                formatCourseAcronym = formatCourseAcronym.substring(0, 3) + " " + formatCourseAcronym.substring(3, formatCourseAcronym.length);

            } else {
                formatCourseAcronym = formatCourseAcronym.substring(0, 4) + " " + formatCourseAcronym.substring(4, formatCourseAcronym.length);

            }

            var formatClassNum = item.td[0].a.content;
            if (!is_int(formatClassNum)) {
                formatClassNum = item.td[0].p.a.content;

            }
            //console.log($scope.number+$scope.acronym+($scope.acronym === "" || containsIgnoreCase(formatCourseAcronym.split(" ")[0], $scope.acronym)));
            //console.log(formatCourseAcronym.split(" ")[1]+formatCourseAcronym.split(" ")[0]+($scope.number === "" || $scope.number === formatCourseAcronym.split(" ")[1]));
            if (
              ($scope.acronym === "" || containsIgnoreCase(formatCourseAcronym.split(" ")[0], $scope.acronym) ) &&
                ($scope.number === "" || formatCourseAcronym.split(" ")[1].substring(0,3) === $scope.number || formatCourseAcronym.split(" ")[1].substring(0,4) === $scope.number)
            ) {

                $http.get("https://query.yahooapis.com/v1/public/yql", {
                    params: {
                        q: String.format("select * from html where url='http://rabi.phys.virginia.edu/mySIS/CS2/sectiontip.php?Semester=1148&ClassNumber={0}' and xpath='//tr'", formatClassNum),
                        format: "json",
                        diagnostics: false,
                        env: "store://datatables.org/alltableswithkeys",
                        callback: ""
                    },
                    cache: true

                }).then(function(res) {
                        try {
                            var formatClassName = res.data.query.results.tr[0].td[1].p.content;
                            //console.log(formatClassName);
                            var className = formatClassName.substring(formatClassName.indexOf(")") + 1, formatClassName.length).trim();

                            //alert(eachCourse.classNu);

                            var eachCourse = {
                                classNum: formatClassNum,
                                acronym: formatCourseAcronym,
                                courseName: className,
                                selected: false

                            };
                            //console.log(eachCourse.acronym);

                            $scope.courses.push(eachCourse);


                        } catch (err) {
                            console.log(err.message);
                        }
                    }

                    //----------------


                );
            }




        } catch (err) {
            console.log(err.message);

        }




    }



    $scope.clicked = function() {
        var selectedCourses = [];
        angular.forEach($scope.courses, function(course) {

            if (course.selected) {
                selectedCourses.push(course);
            }

        });


        console.log(selectedCourses.length);
//send to backend to put into db.
//open up a modal to show that selected courses have been logged and alerts will be sent.  


    };
}







//https://query.yahooapis.com/v1/public/yql?q=select%20p%20from%20html%20where%20url%3D%22http%3A%2F%2Frabi.phys.virginia.edu%2FmySIS%2FCS2%2Fpage.php%3FSemester%3D1148%26Type%3DGroup%26Group%3DAnthropology%22%20and%20xpath%3D'%2F%2Ftd%5Bcontains(%40class%2C%22CourseNum%22)%5D'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="

function testing($scope, $http) {
    $scope.um = 4;

}