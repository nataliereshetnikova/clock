var canvasHTML;//variable for picking the canvas
var userTime;//variable for picking the form where user put optional time
var userDate; //variable for date from the form with user's optional date and time
var digitalWatch=[{name:"clock1",timezone:"Europe/Madrid"},{name:"clock2",timezone:"Europe/Kiev"},{name:"clock3",timezone:"Europe/London"}]; //array of digital elements
var analogueWatch=[{name:"myCanvas1",timezone:-1},{name:"myCanvas2",timezone:0},{name:"myCanvas3",timezone:-2}];//array of analogue elements

function displayCanvas(systemDateObject, timeDifference) {
    var contextHTML = canvasHTML.getContext('2d');
    contextHTML.strokeRect(0, 0, canvasHTML.width, canvasHTML.height);
    var t_sec = 6 * systemDateObject.getSeconds();                           //determine the angle for the seconds
    var t_min = 6 * (systemDateObject.getMinutes() + (1 / 60) * systemDateObject.getSeconds()); //determine the angle for the minutes
    var t_hour = 30 * (systemDateObject.getHours() + timeDifference + (1 / 60) * systemDateObject.getMinutes()); //determine the angle for the hours
    //drawing clock
    var radiusClock = canvasHTML.width / 2 - 10;
    var xCenterClock = canvasHTML.width / 2;
    var yCenterClock = canvasHTML.height / 2;

    //Screen cleaning
    contextHTML.fillStyle = "#ffffff";
    contextHTML.fillRect(0, 0, canvasHTML.width, canvasHTML.height);

    //Drawing the clock canvas
    contextHTML.strokeStyle = "#000000";
    contextHTML.lineWidth = 1;
    contextHTML.beginPath();
    contextHTML.arc(xCenterClock, yCenterClock, radiusClock, 0, 2 * Math.PI, true);
    contextHTML.moveTo(xCenterClock, yCenterClock);
    contextHTML.stroke();
    contextHTML.closePath();

    //Drawing the clock skeleton
    var radiusNum = radiusClock - 10;
    var radiusPoint;
    for (var tm = 0; tm < 60; tm++) {
        contextHTML.beginPath();
        if (tm % 5 == 0) {
            radiusPoint = 5;
        } else {
            radiusPoint = 2;
        }
        var xPointM = xCenterClock + radiusNum * Math.cos(-6 * tm * (Math.PI / 180) + Math.PI / 2);
        var yPointM = yCenterClock - radiusNum * Math.sin(-6 * tm * (Math.PI / 180) + Math.PI / 2);
        contextHTML.arc(xPointM, yPointM, radiusPoint, 0, 2 * Math.PI, true);
        contextHTML.stroke();
        contextHTML.closePath();
    }

    //Digitizing clock face
    for (var th = 1; th <= 12; th++) {
        contextHTML.beginPath();
        contextHTML.font = '30px sans-serif';
        var xText = xCenterClock + (radiusNum - 30) * Math.cos(-30 * th * (Math.PI / 180) + Math.PI / 2);
        var yText = yCenterClock - (radiusNum - 30) * Math.sin(-30 * th * (Math.PI / 180) + Math.PI / 2);
        if (th <= 9) {
            contextHTML.strokeText(th, xText - 5, yText + 10);
        } else {
            contextHTML.strokeText(th, xText - 15, yText + 10);
        }
        contextHTML.stroke();
        contextHTML.closePath();

        //Drawing seconds
        contextHTML.beginPath();
        contextHTML.strokeStyle = "#FF0000";
        contextHTML.moveTo(xCenterClock, yCenterClock);
        contextHTML.lineTo(xCenterClock + lengthSeconds * Math.cos(Math.PI / 2 - t_sec * (Math.PI / 180)),
            yCenterClock - lengthSeconds * Math.sin(Math.PI / 2 - t_sec * (Math.PI / 180)));
        contextHTML.stroke();
        contextHTML.closePath();

        //Drawing minutes
        contextHTML.beginPath();
        contextHTML.strokeStyle = "#000000";
        contextHTML.lineWidth = 3;
        contextHTML.moveTo(xCenterClock, yCenterClock);
        contextHTML.lineTo(xCenterClock + lengthMinutes * Math.cos(Math.PI / 2 - t_min * (Math.PI / 180)),
            yCenterClock - lengthMinutes * Math.sin(Math.PI / 2 - t_min * (Math.PI / 180)));
        contextHTML.stroke();
        contextHTML.closePath();

        ///Drawing hours
        contextHTML.beginPath();
        contextHTML.lineWidth = 5;
        contextHTML.moveTo(xCenterClock, yCenterClock);
        contextHTML.lineTo(xCenterClock + lengthHour * Math.cos(Math.PI / 2 - t_hour * (Math.PI / 180)),
            yCenterClock - lengthHour * Math.sin(Math.PI / 2 - t_hour * (Math.PI / 180)));
        contextHTML.stroke();
        contextHTML.closePath();

        //Drawing the center of the clock
        contextHTML.beginPath();
        contextHTML.strokeStyle = "#000000";
        contextHTML.fillStyle = "#ffffff";
        contextHTML.lineWidth = 3;
        contextHTML.arc(xCenterClock, yCenterClock, 5, 0, 2 * Math.PI, true);
        contextHTML.stroke();
        contextHTML.fill();
        contextHTML.closePath();

        //Drawing the clock hands
        var lengthSeconds = radiusNum - 10;
        var lengthMinutes = radiusNum - 15;
        var lengthHour = lengthMinutes / 1.5;
    }
}

    function systemTime(systemDateObject) {
        //setting digital watch
        digitalWatch.forEach(function(element) {
            document.getElementById(element.name).innerHTML = systemDateObject.toLocaleTimeString('en-us', {timeZone: element.timezone});
        });
        //setting analogue watch
        analogueWatch.forEach(function(element) {
            canvasHTML = document.getElementById(element.name);
            displayCanvas(systemDateObject, element.timezone);
        });
    }

    function getNewDate(systemDateObject){
        var timeDifference = sessionStorage.getItem("userTimeDifference");
        var newDateObj = moment(systemDateObject).add(timeDifference, 's').toDate();
        return newDateObj;
    }
    window.onload = function () {
        document.getElementById("submitButton").addEventListener("click", function () {
            userTime = document.getElementById("userTime");
            //save into storage time difference between time, setting by user and current time in seconds
            userDate = new Date(userTime.value);
            var systemDateObject = new Date();
            var userTimeDifference = (userDate.getTime() - systemDateObject.getTime())/1000;
            sessionStorage.setItem("userTimeDifference", userTimeDifference);
        });
        document.getElementById("resetButton").addEventListener("click", function () {
            sessionStorage.clear();
        });
        window.setInterval(
            function () {
                var systemDateObject = new Date();
                if (sessionStorage.getItem("userTimeDifference") != null) {
                    //if there is a userDate, update systemTime with a date that is corrected on getNewDate() function
                    var userDateObject = getNewDate(systemDateObject);
                    systemTime(userDateObject);
                }
                else {
                    systemTime(systemDateObject);
                }
            }
            , 1000);
    }


