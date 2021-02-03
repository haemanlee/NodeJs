
const {isLoggedIn, isNotLoggedIn}  = require('./middlewares');


//if문 같은 것 단위테스트 여러개가 나올 수 있음.
describe('isLoggedIn', () => {
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
    };
    const next = jest.fn();
    test('로그인되어 있으면 isLoggedIn이 next를 호출해야 함', ()=> {
        //모킹:가짜 객체만든다.
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        isLoggedIn(req,res,next);
        expect(next).toBeCalledTimes(1);
    });
    test('로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야 함', ()=> {
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        isLoggedIn(req,res,next);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요');
    });
})

describe('isNotLoggedIn', () => {
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
        redirect: jest.fn()
    };
    const next = jest.fn();
    test('로그인되어 있으면 isNotLoggedIn이 next를 호출해야 함', ()=> {
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        const message = encodeURIComponent('로그인한 상태입니다.');
        isNotLoggedIn(req,res,next);
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);

    });
    test('로그인되어 있지 않으면 isNotLoggedIn이 에러를 응답해야 함', ()=> {
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        isNotLoggedIn(req,res,next);
        expect(next).toBeCalledTimes(1);
    });
})
