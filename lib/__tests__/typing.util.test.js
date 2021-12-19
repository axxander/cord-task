import { validate } from '../utils/typing.util';

describe('Given I have a primitive schema', () => {
    describe('And a valid value', () => {
        it('Then it should return true', () => {
            const schema = {
                type: 'string',
            };
            const value = 'bonjour';

            expect(validate(schema, value)).toBe(true);
        });
    });

    describe('And a valid value', () => {
        it('Then it should return true', () => {
            const schema = {
                type: 'integer',
            };
            const value = 1;

            expect(validate(schema, value)).toBe(true);
        });
    });

    describe('And an invalid value', () => {
        it('Then it should return false', () => {
            const schema = {
                type: 'string',
            };
            const value = 1;

            expect(validate(schema, value)).toBe(false);
        });
    });

    describe('And an invalid value', () => {
        it('Then it should return false', () => {
            const schema = {
                type: 'string',
            };
            const value = { hello: 'world' };

            expect(validate(schema, value)).toBe(false);
        });
    });

    describe('And an invalid value', () => {
        it('Then it should return false', () => {
            const schema = {
                type: 'string',
            };
            const value = false;

            expect(validate(schema, value)).toBe(false);
        });
    });
});

describe('Given I have a complex schema', () => {
    describe('And a valid value', () => {
        it('Then it should return true', () => {
            const schema = {
                type: 'array',
                items: 'string',
            };
            const value = ['hello', 'world'];

            expect(validate(schema, value)).toBe(true);
        });
    });

    describe('And a valid value', () => {
        it('Then it should return true', () => {
            const schema = {
                type: 'array',
                items: {
                    type: 'array',
                    items: {
                        type: 'integer',
                    },
                },
            };
            const value = [
                [1, 2, 3],
                [4, 5, 6],
            ];

            expect(validate(schema, value)).toBe(true);
        });
    });

    describe('And an invalid value', () => {
        it('Then it should return false', () => {
            const schema = {
                type: 'array',
                items: {
                    type: 'array',
                    items: {
                        type: 'integer',
                    },
                },
            };
            const value = [
                [1, 2, 3],
                [4, 5, 'a'],
            ];

            expect(validate(schema, value)).toBe(false);
        });
    });

    describe('And an invalid value', () => {
        it('Then it should return false', () => {
            const schema = {
                type: 'array',
                items: {
                    type: 'array',
                    items: {
                        type: 'integer',
                    },
                },
            };
            const value = [
                [1, { hello: 'world' }, 3],
                [4, 5, 6],
            ];

            expect(validate(schema, value)).toBe(false);
        });
    });
});
