///<reference path="decorators.ts" />
///<reference path="Foo.ts" />

var f: Foo = new Foo;

f.foo(4);
f.logAllArgs(1,2,3,4,5,6);
f.logSpecificArgs('Johnie', 87, 'red');

// console.log("Foo instance: ");
// for ( var k in f) {
//     console.log(k, '=>', f[k]);
// }