var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Foo = (function () {
    function Foo() {
        this.age = 23;
    }
    Foo.prototype.foo = function (n) {
        return n * 2;
    };
    Foo.prototype.logAllArgs = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var result;
        result = args.map(function (v) { return String(v); }).join(' ');
        return result;
    };
    Foo.prototype.logSpecificArgs = function (name, age, color) {
        console.log('Log Specific Args original call: ', name, age, color);
    };
    __decorate([
        propertyDecorator
    ], Foo.prototype, "age", void 0);
    __decorate([
        methodDecorator
    ], Foo.prototype, "foo", null);
    __decorate([
        methodDecorator
    ], Foo.prototype, "logAllArgs", null);
    __decorate([
        methodDecoratorSomeParametersOnly,
        __param(1, parameterDecorator),
        __param(2, parameterDecorator)
    ], Foo.prototype, "logSpecificArgs", null);
    Foo = __decorate([
        classDecorator
    ], Foo);
    return Foo;
}());
function methodDecorator(target, key, descriptor) {
    // save a reference to the original method
    // this way we keep the values currently in the
    // descriptor and don't overwrite what another
    // decorator might have done to the descriptor.
    var originalMethod = descriptor.value;
    //editing the descriptor/value parameter
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var a = args.map(function (a) { return JSON.stringify(a); }).join();
        // note usage of originalMethod here
        var result = originalMethod.apply(this, args);
        var r = JSON.stringify(result);
        console.log("Call: " + key + "(" + a + ") => " + r);
        return result;
    };
    // return edited descriptor as opposed to overwriting
    // the descriptor by returning a new descriptor
    return descriptor;
}
function propertyDecorator(target, key) {
    // property value
    var _val = this[key];
    // property getter
    var getter = function () {
        console.log("Get: " + key + " => " + _val);
        return _val;
    };
    // property setter
    var setter = function (newVal) {
        console.log("Set: " + key + " => " + newVal);
        _val = newVal;
    };
    // Delete property.
    if (delete this[key]) {
        // Create new property with getter and setter
        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }
}
function classDecorator(target) {
    // save a reference to the original constructor
    var original = target;
    // a utility function to generate instances of a class
    function construct(constructor, args) {
        var c = function () {
            return constructor.apply(this, args);
        };
        c.prototype = constructor.prototype;
        return new c();
    }
    // the new constructor behaviour
    var f = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        console.log("New: " + original.name);
        return construct(original, args);
    };
    // copy prototype so intanceof operator still works
    f.prototype = original.prototype;
    // return new constructor (will override original)
    return f;
}
/**
 * A parameter decorator should only be used to generate some sort of metadata!!!
 * Is not supposed to modify the behavior of a constructor, method or property
 * Once the metadata has been created we can use a METHOD decorator to read it (@see: methodDecoratorSomeParametersOnly)
 */
function parameterDecorator(target, key, index) {
    console.log('decorate parameter: ', key, ' index: ', index);
    var metadataKey = "log_" + key + "_parameters";
    if (Array.isArray(target[metadataKey])) {
        target[metadataKey].push(index);
    }
    else {
        target[metadataKey] = [index];
    }
}
/**
 * This decorator is used in conjunction with the function argument decorator.
 */
function methodDecoratorSomeParametersOnly(target, key, descriptor) {
    var originalMethod = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var metadataKey = "log_" + key + "_parameters";
        var indices = target[metadataKey];
        var result;
        if (Array.isArray(indices)) {
            for (var i = 0; i < args.length; i++) {
                if (indices.indexOf(i) !== -1) {
                    var arg = args[i];
                    var argStr = JSON.stringify(arg) || arg.toString();
                    console.log("DECORATE_ARG: " + key + " arg[" + i + "]: " + argStr);
                }
            }
            result = originalMethod.apply(this, args);
            return result;
        }
        else {
            var a = args.map(function (a) { return (JSON.stringify(a) || a.toString()); }).join();
            result = originalMethod.apply(this, args);
            var r = JSON.stringify(result);
            console.log("Call specific args: " + key + "(" + a + ") => " + r);
            return result;
        }
    };
    return descriptor;
}
///<reference path="decorators.ts" />
///<reference path="Foo.ts" />
var f = new Foo;
f.foo(4);
f.logAllArgs(1, 2, 3, 4, 5, 6);
f.logSpecificArgs('Johnie', 87, 'red');
// console.log("Foo instance: ");
// for ( var k in f) {
//     console.log(k, '=>', f[k]);
// } 
