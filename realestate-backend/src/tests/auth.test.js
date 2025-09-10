const request = require('supertest');
const app = require('../app');

describe('Auth Endpoints', () => {
    describe('GET /health', () => {
        it('should return health status', async () => {
            const res = await request(app)
                .get('/health')
                .expect(200);

            expect(res.body).toHaveProperty('status', 'OK');
            expect(res.body).toHaveProperty('timestamp');
            expect(res.body).toHaveProperty('uptime');
        });
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                phone: '1234567890',
                role: 'tenant'
            };

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('user');
        });

        it('should not register user with invalid data', async () => {
            const invalidData = {
                name: '',
                email: 'invalid-email',
                password: '123',
                role: 'invalid'
            };

            await request(app)
                .post('/api/auth/register')
                .send(invalidData)
                .expect(400);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123'
            };

            const res = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(200);

            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
        });

        it('should not login with invalid credentials', async () => {
            const invalidData = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };

            await request(app)
                .post('/api/auth/login')
                .send(invalidData)
                .expect(401);
        });
    });
});
