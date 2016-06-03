@classDecorator
class Foo {

    @propertyDecorator
    public age: number = 23;

    @methodDecorator
    foo( n: number ): number {
        return n * 2;
    }

    @methodDecorator
    logAllArgs( ...args: any[] ): string {
        var result: string;

        result = args.map((v)=>{ return String(v); }).join(' ');

        return result;
    }

    @methodDecoratorSomeParametersOnly
    logSpecificArgs( name: string, @parameterDecorator age: number, @parameterDecorator color: string ): void {
        console.log('Log Specific Args original call: ', name, age, color );
    }
}