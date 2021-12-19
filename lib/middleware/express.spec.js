import { checkAgainstRules } from './express';

describe('Given my request method is GET and route is /api/account/search', () => {
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

    describe('And a valid query parameter `page` with a valid value of `50` is included', () => {
        it('Then the next function should be called with no arguments', () => {
            mockReq = {
                ...mockReq,
                query: {
                    page: '50',
                },
            };

            checkAgainstRules(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalledWith();
        });
    });

    describe('And a valid query parameter `page` with an invalid value of `hello` is included', () => {
        it('Then the next function should be called with an error message containing the parameter name', () => {
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

    describe('And an extraneous query parameter `extraneous` is included', () => {
        it('Then the next function should be called with an error message containing the parameter name', () => {
            mockReq = {
                ...mockReq,
                query: {
                    extraneous: 10,
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
});
