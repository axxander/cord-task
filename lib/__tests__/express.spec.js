import { checkAgainstRules } from '../middleware/express';


describe('/api/account/search', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            baseUrl: '/api/account',
            path: '/search',
            method: 'GET',
        };
        mockRes = {};
        mockNext = jest.fn();
    });

    describe('Given I send a GET request', () => {
        describe('And include an allowed query parameter `page` with a valid value of `50`', () => {
            it('Then the next function should be called with no arguments', () => {
                mockReq = {
                    ...mockReq,
                    query: {
                        page: 50,
                    },
                };
    
                checkAgainstRules(mockReq, mockRes, mockNext);
                expect(mockNext).toHaveBeenCalledWith();
            })
        })

        describe('And include an allowed query parameter `page` with an invalid value of `hello`', () => {
            it('Then the next function should be called with an error message containing the parameter name `page`', () => {
                mockReq = {
                    ...mockReq,
                    query: {
                        page: 'hello',
                    },
                };

                checkAgainstRules(mockReq, mockRes, mockNext);
                expect(mockNext).toHaveBeenCalledWith(
                    expect.objectContaining({
                        msg: expect.stringContaining('`page`'),
                    })
                );
            });
        });

        describe('And include a disallowed query parameter `extraneous` with some value', () => {
            it('Then the next function should be called with an error message containing the parameter name `extraneous`', () => {
                mockReq = {
                    ...mockReq,
                    query: {
                        extraneous: 1,
                    },
                };

                checkAgainstRules(mockReq, mockRes, mockNext);
                expect(mockNext).toHaveBeenCalledWith(
                    expect.objectContaining({
                        msg: expect.stringContaining('`extraneous`'),
                    })
                );
            });
        });
    })

    describe('Given I send a POST request (not in rules)', () => {
        describe('And include a query parameter with some value', () => {
            it('Then the next function should be called with no arguments', () => {
                mockReq = {
                    ...mockReq,
                    method: 'POST',
                    query: {
                        extraneous: 1,
                    },
                };

                checkAgainstRules(mockReq, mockRes, mockNext);
                expect(mockNext).toHaveBeenCalledWith()
            });
        });
    })
})

describe('/api/account/profile', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            baseUrl: '/api/account',
            path: '/profile',
            method: 'PUT',
        };
        mockRes = {};
        mockNext = jest.fn();
    });

    describe('Given I send a PUT request', () => {
        describe('And include request body with all required fields and valid values', () => {
            it('Then the next function should be called with no arguments', () => {
                mockReq = {
                    ...mockReq,
                    body: {
                        name: 'alex',
                        job_title: 'dev',
                        photo_url: 's3://image.com',
                    },
                };
    
                checkAgainstRules(mockReq, mockRes, mockNext);
                expect(mockNext).toHaveBeenCalledWith();
            })
        })

        describe('And include request body with all required fields and an invalid value', () => {
            it('Then the next function should be called with a generic error', () => {
                mockReq = {
                    ...mockReq,
                    body: {
                        name: 10,
                        job_title: 'dev',
                        photo_url: 's3://image.com',
                    },
                };
    
                checkAgainstRules(mockReq, mockRes, mockNext);
                expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
                    msg: expect.stringContaining('request body is invalid')
                }));
            })
        })
    })

    describe('Given I send a POST request (not in rules)', () => {
        describe('And include a request body', () => {
            it('Then the next function should be called with no arguments', () => {
                mockReq = {
                    ...mockReq,
                    method: 'POST',
                    body: {
                        hello: 'world',
                    },
                };

                checkAgainstRules(mockReq, mockRes, mockNext);
                expect(mockNext).toHaveBeenCalledWith()
            });
        });
    })
})

describe('/api/account/role', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            baseUrl: '/api/account',
            path: '/role',
            method: 'GET',
        };
        mockRes = {};
        mockNext = jest.fn();
    });

    describe('Given I send a GET request', () => {
        describe('And include request body', () => {
            it('Then the next function should be called with an error stating the request body is not permitted', () => {
                mockReq = {
                    ...mockReq,
                    body: {
                        name: 'alex',
                        job_title: 'dev',
                        photo_url: 's3://image.com',
                    },
                };
    
                checkAgainstRules(mockReq, mockRes, mockNext);
                expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
                    msg: expect.stringContaining('no request body permitted')
                }));
            })
        })
    })
})