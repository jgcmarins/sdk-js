import StringType from '../../src/validation/stringType';

describe('A string type', () => {
    test('should provide the allowed type', () => {
        expect(new StringType().getTypes()).toEqual(['string']);
    });

    test.each([
        [null, false],
        ['foo', true],
        [true, false],
        [1, false],
        [1.23, false],
        [['foo', 'bar'], false],
        [{foo: 'bar'}, false],
        [new Object('foo'), false],
    ])('should determine whether the type of a given value is valid', (value: any, expected: boolean) => {
        expect(new StringType().isValidType(value)).toBe(expected);
    });

    test.each([
        ['foo', new StringType({minLength: 2})],
        ['foo', new StringType({maxLength: 4})],
        ['foo', new StringType({enumeration: ['foo']})],
        ['foo', new StringType({pattern: /fo+/})],
        ['bd70aced-f238-4a06-b49d-0c96fe10c4f8', new StringType({format: 'uuid'})],
        ['2015-08-31', new StringType({format: 'date'})],
        ['http://www.foo.com.br', new StringType({format: 'url'})],
    ])('should allow %s with %o', (value: string, type: StringType) => {
        function validate(): void {
            type.validate(value);
        }

        expect(validate).not.toThrowError(Error);
    });

    test.each([
        [null, new StringType({}), 'Expected value of type string at path \'/\', actual null.'],
        [1, new StringType({}), 'Expected value of type string at path \'/\', actual integer.'],
        [[], new StringType({}), 'Expected value of type string at path \'/\', actual array.'],
        [{}, new StringType({}), 'Expected value of type string at path \'/\', actual Object.'],
        ['a', new StringType({minLength: 2}), "Expected at least 2 characters at path '/', actual 1."],
        ['abc', new StringType({maxLength: 2}), "Expected at most 2 characters at path '/', actual 3."],
        ['abc', new StringType({minLength: 2, maxLength: 2}), "Expected exactly 2 characters at path '/', actual 3."],
        [
            'c',
            new StringType({enumeration: ['a', 'b']}),
            "Unexpected value at path '/', expecting 'a' or 'b', found 'c'.",
        ],
        ['bar', new StringType({pattern: /fo+/}), "Invalid format at path '/'."],
        ['foo', new StringType({format: 'url'}), "Invalid url format at path '/'."],
    ])('should not allow %s with %o', (
        value: any,
        type: StringType,
        message: string,
    ) => {
        function validate(): void {
            type.validate(value);
        }

        expect(validate).toThrow(Error);
        expect(validate).toThrow(message);
    });
});