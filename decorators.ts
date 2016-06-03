function methodDecorator(target: any, key: string, descriptor: any) {
// save a reference to the original method
    // this way we keep the values currently in the
    // descriptor and don't overwrite what another
    // decorator might have done to the descriptor.
    var originalMethod = descriptor.value;

    //editing the descriptor/value parameter
    descriptor.value =  function (...args: any[]) {
        var a = args.map(a => JSON.stringify(a)).join();
        // note usage of originalMethod here
        var result = originalMethod.apply(this, args);
        var r = JSON.stringify(result);
        console.log(`Call: ${key}(${a}) => ${r}`);
        return result;
    }

    // return edited descriptor as opposed to overwriting
    // the descriptor by returning a new descriptor
    return descriptor;
}

function propertyDecorator(target: any, key: string) {

    // property value
    var _val = this[key];

    // property getter
    var getter = function () {
        console.log(`Get: ${key} => ${_val}`);
        return _val;
    };

    // property setter
    var setter = function (newVal) {
        console.log(`Set: ${key} => ${newVal}`);
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

function classDecorator(target: any) {

    // save a reference to the original constructor
    var original = target;

    // a utility function to generate instances of a class
    function construct(constructor, args) {
        var c : any = function () {
            return constructor.apply(this, args);
        };
        c.prototype = constructor.prototype;
        return new c();
    }

    // the new constructor behaviour
    var f : any = function (...args) {
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
function parameterDecorator(target: any, key : string, index : number) {
    console.log('decorate parameter: ', key, ' index: ', index  );
    var metadataKey = `log_${key}_parameters`;
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
function methodDecoratorSomeParametersOnly(target: any, key: string, descriptor: any) {

    var originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {

        var metadataKey = `log_${key}_parameters`;
        var indices = target[metadataKey];
        var result;

        if (Array.isArray(indices)) {

            for (var i = 0; i < args.length; i++) {

                if (indices.indexOf(i) !== -1) {

                    var arg = args[i];
                    var argStr = JSON.stringify(arg) || arg.toString();
                    console.log(`DECORATE_ARG: ${key} arg[${i}]: ${argStr}`);
                }
            }
            result = originalMethod.apply(this, args);
            return result;
        }
        else {

            var a = args.map(a => (JSON.stringify(a) || a.toString())).join();
            result = originalMethod.apply(this, args);
            var r = JSON.stringify(result);
            console.log(`Call specific args: ${key}(${a}) => ${r}`);
            return result;
        }
    };

    return descriptor;
}