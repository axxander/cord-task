import { TestWatcher } from 'jest';
import { validateBody, validateQuery, hasProps, hasExtraneousProps } from '../utils/typing.util';

describe('hasExtraneousProps', () => {
    describe('Given I have an array of properties and a value', () => {
        describe('And it has no extraneous properties', () => {
            it('Then it should return false', () => {
                const schemaProps = ['account_id'];
                const value = {
                    account_id: 1,
                };
    
                expect(hasExtraneousProps(schemaProps, value)).toBe(false);
            });
        });

        describe('And it has extraneous properties', () => {
            it('Then it should return true', () => {
                const schemaProps = ['account_id'];
                const value = {
                    account_id: 1,
                    extraneous: 1,
                };
    
                expect(hasExtraneousProps(schemaProps, value)).toBe(true);
            });
        });

        describe('And it has no properties', () => {
            it('Then it should return true', () => {
                const schemaProps = ['account_id'];
                const value = {};
    
                expect(hasExtraneousProps(schemaProps, value)).toBe(false);
            });
        });
    });
});

describe('hasProps', () => {
    describe('Given I have an array of properties and a value', () => {
        describe('And it has all the properties', () => {
            it('Then it should return true', () => {
                const props = ['account_id', 'person_id'];
                const value = {
                    account_id: 1,
                    person_id: 1,
                };
    
                expect(hasProps(props, value)).toBe(true);
            });
        });
    
        describe('And it is missing some properties', () => {
            it('Then hasProps should return false', () => {
                const props = ['account_id', 'person_id'];
                const value = {
                    account_id: 1,
                };
    
                expect(hasProps(props, value)).toBe(false);
            });
        });
    });
});


/*
Testing `validateQuery`
*/
describe('validateQuery', () => {
    describe('Given I have a primitive query schema', () => {
        describe('And a valid value', () => {
            it('Then it should return true', () => {
                const schema = {
                    type: 'string',
                };
                const value = 'bonjour';
    
                expect(validateQuery(schema, value)).toBe(true);
            });
        });
    
        describe('And a valid value', () => {
            it('Then it should return true', () => {
                const schema = {
                    type: 'integer',
                };
                const value = 1;
    
                expect(validateQuery(schema, value)).toBe(true);
            });
        });
    
        describe('And an invalid value', () => {
            it('Then it should return false', () => {
                const schema = {
                    type: 'string',
                };
                const value = 1;
    
                expect(validateQuery(schema, value)).toBe(false);
            });
        });
    
        describe('And an invalid value', () => {
            it('Then it should return false', () => {
                const schema = {
                    type: 'string',
                };
                const value = { hello: 'world' };
    
                expect(validateQuery(schema, value)).toBe(false);
            });
        });
    
        describe('And an invalid value', () => {
            it('Then it should return false', () => {
                const schema = {
                    type: 'string',
                };
                const value = false;
    
                expect(validateQuery(schema, value)).toBe(false);
            });
        });
    });
    
    describe('Given I have a complex query schema', () => {
        describe('And a valid value', () => {
            it('Then it should return true', () => {
                const schema = {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                };
                const value = ['hello', 'world'];
    
                expect(validateQuery(schema, value)).toBe(true);
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
    
                expect(validateQuery(schema, value)).toBe(true);
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
    
                expect(validateQuery(schema, value)).toBe(false);
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
    
                expect(validateQuery(schema, value)).toBe(false);
            });
        });

        describe('And an invalid value', () => {
            it('Then it should return false', () => {
                const schema = {
                    type: 'array',
                    items: {
                        type: 'array',
                        items: {
                            type: 'array',
                            items: {
                                type: 'integer'
                            }
                        },
                    },
                };
                const value = [
                    [1, 1, 2],
                    [4, 5, 6],
                ];
    
                expect(validateQuery(schema, value)).toBe(false);
            });
        });
    });
});


/*
Testing `validateBody`
*/
describe('validateBody', () => {
    describe('Given I have a primitive body schema', () => {
        describe('And a valid request body with all required fields', () => {
            it('Then it should return true', () => {
                const schema = {
                    type: 'object',
                    required: ['account_id'],
                    properties: {
                        account_id: {
                            type: 'integer',
                        },
                    },
                };
                const body = {
                    account_id: 1,
                };
    
                expect(validateBody(schema, body)).toBe(true);
            });
        });
    
        describe('And an invalid request body with missing required fields', () => {
            it('Then it should return false', () => {
                const schema = {
                    type: 'object',
                    required: ['account_id'],
                    properties: {
                        account_id: {
                            type: 'integer',
                        },
                    },
                };
                const body = {};
    
                expect(validateBody(schema, body)).toBe(false);
            });
        });
    });

    describe('Given I have a complext body schema', () => {
        describe('And a valid request body with all required fields (nested)', () => {
            it('Then it should return true', () => {
                const schema = {
                    type: 'object',
                    required: ['account_id', 'person_id'],
                    properties: {
                        account_id: {
                            type: 'integer',
                        },
                        person_id: {
                            type: 'integer'
                        },
                        address: {
                            type: 'object',
                            required: ['postcode', 'house_number'],
                            properties: {
                                house_number: {
                                    type: 'integer',
                                },
                                postcode: {
                                    type: 'string'
                                },
                                country: {
                                    type: 'string'
                                },
                            }
                        }
                    },
                };
                const body = {
                    account_id: 1,
                    person_id: 1,
                    address: {
                        house_number: 1,
                        postcode: 'w92jq',
                        country: 'United Kingdom'
                    }
                };
    
                expect(validateBody(schema, body)).toBe(true);
            });
        });
    
        describe('And an invalid request body missing required fields (nested)', () => {
            it('Then it should return false', () => {
                const schema = {
                    type: 'object',
                    required: ['account_id', 'person_id'],
                    properties: {
                        account_id: {
                            type: 'integer',
                        },
                        person_id: {
                            type: 'integer'
                        },
                        address: {
                            type: 'object',
                            required: ['postcode', 'house_number'],
                            properties: {
                                house_number: {
                                    type: 'integer',
                                },
                                postcode: {
                                    type: 'string'
                                },
                                country: {
                                    type: 'string'
                                },
                            }
                        }
                    },
                };
                const body = {
                    account_id: 1,
                    person_id: 1,
                    address: {
                        house_number: 1,
                        country: 'United Kingdom',
                    },
                };
    
                expect(validateBody(schema, body)).toBe(false);
            });
        });
    });
});