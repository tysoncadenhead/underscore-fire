/*jslint node: true */
/*global describe, it, _ */

var assert = require("assert");
             require( "underscore" );
             require( "../src/underscore-fire.js" );

(function () {

    "use strict";

    describe("underscore-fire", function () {
        describe("_.fire", function () {
            it("Should fire a single function", function (done) {

                var fns = function () {
                    return "hello world";
                };

                _.fire( fns, function (data) {
                    assert.equal(typeof data, "object");
                    assert.equal(data[0], "hello world");
                    done();
                });

            });

            it("Should fire each function and return the results in an array for the callback", function (done) {
                
                var fns = [function () {
                    return "hello world";
                }, function () {
                    return "hello moon";
                }, function () {
                    return "hello sun";
                }];

                _.fire( fns, function (data) {
                    assert.equal(typeof data, "object");
                    assert.equal(data[0], "hello world");
                    assert.equal(data[1], "hello moon");
                    assert.equal(data[2], "hello sun");
                    done();
                });

            });

            it("Should return all of the results in order asynchronously", function (done) {
                
                var fns = [function (done) {
                    setTimeout(function () {
                       done("hello world");
                    }, 1000);
                }, function (done) {
                    setTimeout(function () {
                       done("hello moon");
                    }, 500);
                }, function (done) {
                    setTimeout(function () {
                       done("hello sun");
                    }, 250);
                }];

                _.fire( fns, function (data) {
                    assert.equal(typeof data, "object");
                    assert.equal(data[0], "hello world");
                    assert.equal(data[1], "hello moon");
                    assert.equal(data[2], "hello sun");
                    done();
                });

            });

            it("Should pass in data from the filter", function (done) {
                
                var fns = [function (done, hello, exclamation) {
                        return hello + " world" + exclamation;

                    }, function (done, hello, exclamation) {
                        return hello + " moon" + exclamation;

                    }, function (done, hello, exclamation) {
                        return hello + " sun" + exclamation;
                    }],
                    filters = ["hello", "!"];

                _.fire( fns, function (data) {

                    assert.equal(typeof data, "object");
                    assert.equal(data[0], "hello world!");
                    assert.equal(data[1], "hello moon!");
                    assert.equal(data[2], "hello sun!");
                    done();

                }, filters);

            });

            it("Should pass in data from the filters", function (done) {
                
                var fns = [function (done, hello) {
                    return hello;

                }, function (done, hello) {
                    return hello;
                    
                }, function (done, hello) {
                    return hello;
                }],

                filters = [
                  ["hello world"],
                  ["hello moon"],
                  ["hello sun"]
                ];

                _.fire( fns, function (data) {

                    assert.equal(typeof data, "object");
                    assert.equal(data[0], "hello world");
                    assert.equal(data[1], "hello moon");
                    assert.equal(data[2], "hello sun");
                    done();

                }, filters);

            });

            it("Should pass in data from the filters function", function (done) {

                var fns = [function (done, hello) {
                    return hello;

                }, function (done, hello) {
                    return hello;
                    
                }, function (done, hello) {
                    return hello;
                }],

                filters = function (done, index) {
                  switch(index) {
                    
                    case 0:
                      done("hello world");
                      break;

                    case 1:
                      done("hello moon");
                      break;
                    
                    case 2:
                      done("hello sun");
                      break;
                  }
                };

                _.fire( fns, function (data) {

                    assert.equal(typeof data, "object");
                    assert.equal(data[0], "hello world");
                    assert.equal(data[1], "hello moon");
                    assert.equal(data[2], "hello sun");
                    done();

                }, filters);

            });

            it("Should not set the correct context for the functions we fire because it is not passed in", function (done) {

                var Context, context, fns = [function () {
                    assert.equal(typeof this, "undefined");
                    return true;
                }];

                Context = function () {

                    this.isRightContent = true;

                    this.fire = function () {

                        _.fire( fns, function (data) {
                            done();
                        }, []);
                        
                    };

                };

                context = new Context();
                context.fire();

            });

            it("Should set the correct context for the functions we fire", function (done) {

                var Context, context, fns = [function (done) {
                    assert.equal(this.isRightContent, true);
                    return true;

                }, function (done) {
                    assert.equal(this.isRightContent, true);
                    return true;
                    
                }];

                Context = function () {

                    this.isRightContent = true;

                    this.fire = function () {

                        _.fire( fns, function (data) {
                            done();
                        }, [], this);
                        
                    };

                };

                context = new Context();
                context.fire();

            });

            it("Should set the correct context for the callback", function (done) {

                var Context, context, fns = [function (done) {
                    return true;
                }];

                Context = function () {

                    this.isRightContent = true;

                    this.fire = function () {

                        _.fire( fns, function (data) {
                            assert.equal(this.isRightContent, true);
                            done();
                        }, [], this);
                        
                    };

                };

                context = new Context();
                context.fire();

            });

        });
    });

}());