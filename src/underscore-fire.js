/*
 _   _           _                                   ______ _          
| | | |         | |                                  |  ___(_)         
| | | |_ __   __| | ___ _ __ ___  ___ ___  _ __ ___  | |_   _ _ __ ___ 
| | | | '_ \ / _` |/ _ \ '__/ __|/ __/ _ \| '__/ _ \ |  _| | | '__/ _ \
| |_| | | | | (_| |  __/ |  \__ \ (_| (_) | | |  __/ | |   | | | |  __/
 \___/|_| |_|\__,_|\___|_|  |___/\___\___/|_|  \___| \_|   |_|_|  \___|

Author: Tyson Cadenhead | tysoncadenheadAtGmailDotCom | tysonjs.com

*/

/*global _ */
/*jslint plusplus: true */

(function (_) {

    "use strict";

    _.fire = function (fns, callback, before, context) {

        var numberCalled = 0,
            returnObjects = [];

        // This will be called each time we get a callback from one of our functions. We will increment the "numberCalled" and if all of the functions have been called, we will fire the callback
        function finished () {

            // Increment
            numberCalled++;

            // Fire the callback
            if (numberCalled === fns.length) {
                callback.call(context || this || undefined, returnObjects);
            }
        }

        // This will load each individual function
        function loadFunction (fn, index, arr) {

            var returnObject,
                params = [];

            _.each(arr, function (val, name) {
                params[name] = val;
            });

            // Reverse the array for manipulation. We will add the "done" callback function as the first parameter in each function we'll fire
            params = params.reverse();

            // Add the "done" callback function as the last item in the array
            params.push(function (rtn) {

                // If the "done" function gets fired, we will add the results to the returnObjects array
                returnObjects[index] = rtn;
                finished();

            });

            // Reverse the array again so that "done" is at the beginning
            params = params.reverse();

            // Fire the function
            returnObject = fn.apply(context || this || undefined, params);

            // If the function returns any data, we'll count it as being done
            if (returnObject) {
                returnObjects[index] = returnObject;
                finished();
            }

        }

        // If there is only one function passed in, make an array anyway
        if (typeof fns === "function") {
            fns = [fns];
        }

        // Loop over all of the functions and fire them
        _.each(fns, function (fn, index) {

            // If the before object is a function, use it as a filter to pass data into each function we are looping over
            if (typeof before === "function") {
                before(function (p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15) {
                    loadFunction(fn, index, [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15]);
                }, index);

            // If the before object is an array, pass it into each of the functions
            } else if (typeof before === "object") {

                // If before is an array of arrays, pass in the correct indexed array
                if (typeof before[index] === "object") {
                    loadFunction(fn, index, before[index]);

                // If before is a flat array, just pass it in
                } else {
                    loadFunction(fn, index, before);
                }

            // If there is no "before" provided, pass in an empty array
            } else {
                loadFunction(fn, index, []);
            }
            
        });

    };

}(_));