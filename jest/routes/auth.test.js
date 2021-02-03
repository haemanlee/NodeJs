const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

beforeAll(async () => {
    await sequelize.sync();
})

describe('POST /join', () => {

    
    test('로그인 안 했으면 가입', async (done) => {
        request(app)
            .post('/auth/join')
            .send({
                email: 'newId@naver.com',
                nick: 'haeman',
                password: '123456',
            })
            .expect('Location', '/')
            .expect(302, done);//success란 뜻.
    })

    const agent = request.agent(app);
    beforeEach((done) => {
      agent
        .post('/auth/login')
        .send({
          email: 'newId@naver.com',
          password: '123456',
        })
        .end(done);
    });
  
    test('로그인했으면 redirect /', (done) => {
      const message = encodeURIComponent('로그인한 상태입니다.');
      agent
        .post('/auth/join')
        .send({ email: 'newId@naver.com', password: '123456' })
        .expect('Location', `/?error=${message}`)
        .expect(302, done);
    });
});

describe('POST /login', () => {
    test('로그인 수행', async (done) => {
        request(app)
            .post('/auth/login')
            .send({
                email: 'newId@naver.com',
                password: '123456',
            })
            .expect('Location', '/')
            .expect(302, done);
    })

    test('가입되지 않은 회원', async (done) => {
        const message = encodeURIComponent('가입되지 않은 회원입니다.');
        request(app)
          .post('/auth/login')
          .send({
            email: 'zerohch1@gmail.com',
            password: 'nodejsbook',
          })
          .expect('Location', `/?loginError=${message}`)
          .expect(302, done);
      });
    
      test('비밀번호 틀림', async (done) => {
        const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
        request(app)
          .post('/auth/login')
          .send({
            email: 'newId@naver.com',
            password: 'wrong',
          })
          .expect('Location', `/?loginError=${message}`)
          .expect(302, done);
      });
});

describe('GET /logout', () => {
    test('로그인 되어있지 않으면 403', async (done) => {
        request(app)
            .get('/auth/logout')
            .expect(403, done);
    })
    //agent로 app을 만들 수 있음. 한번 로그인 상태로 유지할 수 있음 > 이상태로 여러 테스트를 할 수 있음.
    const agent = request.agent(app);
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email: 'newId@naver.com',
                password: '123456',
            })
            .end(done);
    })

    test('로그아웃 수행', async (done) => {
        const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
        agent
          .get('/auth/logout')
          .expect('Location', `/`)
          .expect(302, done);
      });


});

afterAll(async () => {
    await sequelize.sync({ force: true });
})
