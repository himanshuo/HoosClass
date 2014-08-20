var app = angular.module('hoosclass');
app.factory('helperFunctions', function($http) {
    return {
        getCourses: function(acronym, number, instructor, building, room, days, time, units, title, topics, desc) {
            var courses = [];
            var query = "select * from htmlpost where url='http://rabi.phys.virginia.edu/mySIS/CS2/page.php?Semester=1148&Type=Search'";
            var postdata = String.format(" and postdata='iMnemonic={0}&iNumber={1}&iStatus=&iInstructor={2}&iBuilding={3}&iRoom={4}&iDays={4}&iTime={5}&iUnits={6}&iTitle={7}&iTopic={8}&iDescription={9}&Submit=Search+for+Classes'", acronym, number, instructor, building, room, days, time, units, title, topics, desc);
            var other = " and xpath='//tr[contains(@class,\"SectionEven\")] | //tr[contains(@class,\"SectionOdd\")]  '";
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

                        var course = getCourseFromBigPage(item);
                        if (course) {
                            $http.get("https://query.yahooapis.com/v1/public/yql", {
                                params: {
                                    q: String.format("select * from html where url='http://rabi.phys.virginia.edu/mySIS/CS2/sectiontip.php?Semester=1148&ClassNumber={0}' and xpath='//tr'", course.number),
                                    format: "json",
                                    diagnostics: false,
                                    env: "store://datatables.org/alltableswithkeys",
                                    callback: ""
                                },
                                cache: true

                            }).then(function(res) {
                                try {
                                    var formatClassName = res.data.query.results.tr[0].td[1].p.content;
                                    //console.log("checkingggggg"+formatClassName);
                                    var className = formatClassName.substring(formatClassName.indexOf(")") + 1, formatClassName.length).trim();

                                    //alert(eachCourse.classNu);

                                    course.name = className;
                                    course.selected=false;
                                    //console.log(eachCourse.acronym);
                                    //console.log(course);
                                    courses.push(course);


                                } catch (err) {
                                    console.log(err.message);
                                }

                            });
                        }


                    });

                } else {
                    var item = res.data.query.results.postresult.tr;
                    var course = getCourseFromBigPage(item);
                    $http.get("https://query.yahooapis.com/v1/public/yql", {
                        params: {
                            q: String.format("select * from html where url='http://rabi.phys.virginia.edu/mySIS/CS2/sectiontip.php?Semester=1148&ClassNumber={0}' and xpath='//tr'", course.number),
                            format: "json",
                            diagnostics: false,
                            env: "store://datatables.org/alltableswithkeys",
                            callback: ""
                        },
                        cache: true

                    }).then(function(res) {
                            try {
                                var formatClassName = res.data.query.results.tr[0].td[1].p.content;
                                //console.log("checkingggggg"+formatClassName);
                                var className = formatClassName.substring(formatClassName.indexOf(")") + 1, formatClassName.length).trim();

                                //alert(eachCourse.classNu);

                                course.name = className;
                                //console.log(eachCourse.acronym);
                                //console.log(eachCourse);
                                courses.push(course);


                            } catch (err) {
                                console.log(err.message);
                            }

                        }

                    );
                    //console.log(courses);
                }
            });
            
            return courses;
        },

        getClassTypeFromNumber: function(classType) {
            if (classType == 1) {
                return "Lecture";
            }
            if (classType == 2) {
                return "Discussion";
            }
            if (classType == 3) {
                return "Seminar";
            }
            if (classType == 4) {
                return "Laboratory";
            }
            if (classType == 5) {
                return "Independent Study";
            }
            if (classType == 6) {
                return "Practicum";
            }
            if (classType == 7) {
                return "Workshop";
            }
            if (classType == 8) {
                return "Studio";
            }
            if (classType == 9) {
                return "Clinical";
            }
            return "";

        }


    };
});

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

this.is_int = function(value) {
    if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
        return true;
    } else {
        return false;
    }
};

function equalsIgnoreCase(string1, string2) {
    return string1.toUpperCase() === string2.toUpperCase();
}

this.equalsIgnoreCase = function(string1, string2) {
    return string1.toUpperCase() === string2.toUpperCase();
};

function containsIgnoreCase(outer, inner) {
    if (outer.toUpperCase().indexOf(inner.toUpperCase()) == -1) {
        return false;
    } else {
        return true;
    }
}

this.containsIgnoreCase = function(outer, inner) {
    if (outer.toUpperCase().indexOf(inner.toUpperCase()) == -1) {
        return false;
    } else {
        return true;
    }
};

this.getCourseFromSmallPage = function(result) {
    try {

        var formatCourseAcronym = result.query.results.tr[0].td[1].p.content.split(" ")[1] + " " + result.query.results.tr[0].td[1].p.content.split(" ")[2];
        console.log(formatCourseAcronym);
        var classType = result.query.results.tr[0].td[1].p.content.split(" ")[5].substring(1, result.query.results.tr[0].td[1].p.content.split(" ")[5].length - 2);
        console.log(classType);
        var formatClassType = 10;
        if (classType === "Lecture") {
            formatClassType = 1;
        }
        if (classType === "Discussion") {
            formatClassType = 2;
        }
        if (classType === "Seminar") {
            formatClassType = 3;
        }
        if (classType === "Laboratory") {
            formatClassType = 4;
        }
        if (classType === "Independent Study") {
            formatClassType = 5;
        }
        if (classType === "Practicum") {
            formatClassType = 6;
        }
        if (classType === "Workshop") {
            formatClassType = 7;
        }
        if (classType === "Studio") {
            formatClassType = 8;
        }
        if (classType === "Clinical") {
            formatClassType = 9;
        }

        console.log(formatClassType);
        var status = result.query.results.tr[6].td[1].p.split(",")[0];

        console.log(status);
        var waitlist = 0;
        var statusCode = "w";
        if (status.substring(0, 4) === "Wait") {
            var temp = status.split(" ")[2];
            //waitlist = temp.substring(1, temp.length - 1);
            statusCode = "w";


        } else if (status === "Closed") {
            statusCode = "c";
        } else if (status === "Open") {
            statusCode = "o";

        }
        console.log(statusCode);

        var units = result.query.results.tr[7].td[1].p;
        console.log(units);
        console.log(units);

        var spots = result.query.results.tr[5].td[1].p;
        var spotsFormat = spots.split(" ")[0] + "/" + spots.split(" ")[3].substring(0, spots.split(" ")[3].length - 1);
        console.log(spotsFormat);

        var professor = result.query.results.tr[2].td[1].table.tr.td[0].strong;
        console.log(professor);
        var timing = result.query.results.tr[2].td[1].table.tr.td[1].p;
        console.log(timing);
        var room = result.query.results.tr[2].td[1].table.tr.td[2].p;
        console.log(room);

        var name = result.query.results.tr[0].td[1].p.content.split("\n")[2].trim();
        console.log(name);

        var classNum = result.query.results.tr[0].td[1].p.content.split(" ")[0];
        console.log(classNum);

        var course = {};
        course.acronym = formatCourseAcronym;
        course.classType = formatClassType;
        course.units = units;
        course.waitlist = waitlist;
        course.spots = spotsFormat;
        course.professor = professor;
        course.timing = timing;
        course.room = room;
        course.name = name;
        course.number = classNum;
        course.status = statusCode;
        return course;
    } catch (err) {
        console.log(err);
    }
};

function getCourseFromBigPage(item) {
    try {
        if (item.td[0] === null && item.td[1] === null && item.td[2] === null && item.td[3] === null && item.td[4] === null) {
            return null;
        }
        var course = {};
        var formatCourseAcronym = item.class.split(" ")[2];

        if (is_int(formatCourseAcronym[2])) {
            formatCourseAcronym = formatCourseAcronym.substring(0, 2) + " " + formatCourseAcronym.substring(2, formatCourseAcronym.length);
        } else if (is_int(formatCourseAcronym[3])) {
            formatCourseAcronym = formatCourseAcronym.substring(0, 3) + " " + formatCourseAcronym.substring(3, formatCourseAcronym.length);

        } else {
            formatCourseAcronym = formatCourseAcronym.substring(0, 4) + " " + formatCourseAcronym.substring(4, formatCourseAcronym.length);

        }
        //console.log(formatCourseAcronym);
        var formatClassNum = item.td[0].a.content || item.td[0].p.a.content;
        if (!is_int(formatClassNum)) {
            formatClassNum = item.td[0].p.a.content;

        }
        //console.log(formatClassNum);
        var classType = item.td[2].strong;
        //console.log(classType);
        var formatClassType = 10;
        if (classType === "Lecture") {
            formatClassType = 1;
        }
        if (classType === "Discussion") {
            formatClassType = 2;
        }
        if (classType === "Seminar") {
            formatClassType = 3;
        }
        if (classType === "Laboratory") {
            formatClassType = 4;
        }
        if (classType === "Independent Study") {
            formatClassType = 5;
        }
        if (classType === "Practicum") {
            formatClassType = 6;
        }
        if (classType === "Workshop") {
            formatClassType = 7;
        }
        if (classType === "Studio") {
            formatClassType = 8;
        }
        if (classType === "Clinical") {
            formatClassType = 9;
        }

        var units = item.td[2].p.split(" ");
        //console.log(units);
        var formatUnits = units[0].substring(1, units[0].length);
        if (units.length === 4) {

            formatUnits = formatUnits + " - " + units[2];
        }
        //console.log(formatUnits);
        var status = item.td[3].p.content || item.td[3].p;
        //console.log(status);
        var waitlist = 0;
        var statusCode = "w";
        if (status.substring(0, 4) === "Wait") {
            var temp = status.split(" ")[2];
            waitlist = temp.substring(1, temp.length - 1);
            statusCode = "w";

        } else if (status === "Closed") {
            statusCode = "c";
        } else if (status === "Open") {
            statusCode = "o";

        }
        //console.log(statusCode);

        var spots = item.td[4].a.content || item.td[4].a[0].content;
        //console.log(spots);
        //console.log(spots);
        var professor = item.td[5].strong.span.content;
        //console.log(professor);
        var timing = item.td[6].p;
        //console.log(timing);
        var room = item.td[7].p;
        //console.log(room);

        //------------
        /*
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
                    //console.log("checkingggggg"+formatClassName);
                    var className = formatClassName.substring(formatClassName.indexOf(")") + 1, formatClassName.length).trim();

                    //alert(eachCourse.classNu);

                    var eachCourse = {
                        classNum: formatClassNum,
                        acronym: formatCourseAcronym,
                        courseName: className,
                        selected: false

                    };
                    //console.log(eachCourse.acronym);
                    //console.log(eachCourse);
                    return eachCourse;


                } catch (err) {
                    console.log(err.message);
                }

            }


       */
        //----------------
        course.acronym = formatCourseAcronym;
        course.classType = formatClassType;
        course.units = formatUnits;
        course.waitlist = waitlist;
        course.spots = spots;
        course.professor = professor;
        course.timing = timing;
        course.room = room;
        course.number = formatClassNum;
        course.status = statusCode;
        return course;


    } catch (err) {
        console.log(err.message + err);

    }





}