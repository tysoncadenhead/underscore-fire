#Underscore-Fire

This underscore add-on was written to allow you to fire multiple functions at the same time and get a single callback when they are all completed. There is no reliance on the DOM, so you can use it in the browser or in Node.

Please note that there is currently no support for chaining function calls and that all of the functions will be fired at the same time.

The only hard dependency is [underscore](https://github.com/documentcloud/underscore) or [lodash](https://github.com/bestiejs/lodash).

## API

While the _.fire method is very powerful, it only has three parameters:

#### _.fire( array [functions to fire], function [callback], function or array [filter] );

The functions to fire will each be called by passing in any data from the optional filter parameter. Once all of the functions have been completed, the callback function will fire with an array of all of the results from the functions as its only parameter.

Maybe a few examples would be helpful...

## Examples

### Firing a single function

You'd probably never need to fire a single function with Underscore-Fire, but this is how you would do it.

```javascript
var fns = function () {
    return "hello world";
};

_.fire( fns, function (data) {
    // ["hello world"];
    console.log(data);
});
```

### Firing multiple functions

We can fire multiple functions. Once they are all fired, the callback will contain an array of all three results.

```javascript
var fns = [function () {
    return "hello world";
}, function () {
    return "hello moon";
}, function () {
    return "hello sun";
}];

_.fire( fns, function (data) {
    // ["hello world", "hello moon", "hello sun"];
    console.log(data);
});
```

### Asynchronous callbacks

Every function has a "done" function as its first parameter. Instead of using return, you can fire the done function when you are ready. This is useful for timeouts, ajax calls and asynchronous node processes. Note that even though the third function will complete before the first function, the results are still returned in the order the functions are added to the array.

```javascript
var fns = [function (done) {
    setTimeout(function () {
       done("hello world");
    }, 2000);
}, function (done) {
    setTimeout(function () {
       done("hello moon");
    }, 1500);
}, function (done) {
    setTimeout(function () {
       done("hello sun");
    }, 1000);
}];

_.fire( fns, function (data) {
    // ["hello world", "hello moon", "hello sun"];
    console.log(data);
});
```

### Passing in parameters

Every function has a "done" function as its first parameter. Instead of using return, you can fire the done function when you are ready. This is useful for timeouts, ajax calls and asynchronous node processes. Note that even though the third function will complete before the first function, the results are still returned in the order the functions are added to the array. You can pass up to 15 parameters into the filter array.

```javascript
var fns = [function (done, hello, exclamation) {
    return hello + " world" + exclamation;

}, function (done, hello, exclamation) {
    return hello + " moon" + exclamation;

}, function (done, hello, exclamation) {
    return hello + " sun" + exclamation;
}];

_.fire( fns, function (data) {

    // ["hello world!", "hello moon!", "hello sun!"];
    console.log(data);

}, ["hello", "!"]);
```

### Passing in different parameters for each function

If you provide an array of filters, each one will be applied to the function with the same index.

```javascript
var fns = [function (done, hello) {
    return hello;

}, function (done, hello) {
    return hello;
    
}, function (done, hello) {
    return hello;
}];

var filters = [
  ["hello world"],
  ["hello moon"],
  ["hello sun"]
];

_.fire( fns, function (data) {

    // ["hello world", "hello moon", "hello sun"];
    console.log(data);

}, filters);
```

### Passing the filters as a function

You can use a function for the filters instead of an array. The function will include a "done" function to use as a callback and the index of the function being called.

```javascript
var fns = [function (done, hello) {
    return hello;

}, function (done, hello) {
    return hello;
    
}, function (done, hello) {
    return hello;
}];

var filters = function (done, index) {
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

    // ["hello world", "hello moon", "hello sun"];
    console.log(data);

}, filters);
```

### Setting the context

You can pass the context for the functions and the callback as the fourth parameter in the _.fire() function. If the context is passed in, "this" will refer to the context you have provided.

```javascript
var fns = [function () {

    // true
    console.log(this.isRightContext);
    return true;
}];

var Context = function () {

    this.isRightContext = true;

    this.fire = function () {

        _.fire( fns, function (data) {
            
            // true
            console.log(this.isRightContext);
            
        }, [], this);
        
    };

};

var context = new Context();
context.fire();
```