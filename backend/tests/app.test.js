const request = require('supertest');
const express = require('express');
const routes = require('../routes');
const { isConnected } = require('../db');

jest.mock('../db');

const app = express();
app.use('/', routes);

describe('GET /live', () => {
  it('responds with json', async () => {
    const response = await request(app).get('/live');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

describe('GET /ready', () => {
    it('responds with json when connected', async () => {
        isConnected.mockReturnValue(true);
        const response = await request(app).get('/ready');
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toEqual({ status: 'ok' });
    });

    it('responds with 503 when not connected', async () => {
        isConnected.mockReturnValue(false);
        const response = await request(app).get('/ready');
        expect(response.statusCode).toBe(503);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toEqual({ status: 'unavailable' });
    });
});

describe('GET /items', () => {
  it('responds with json', async () => {
    const response = await request(app).get('/items');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual([{ item: 'test' }]);
  });
});

describe('POST /items', () => {
    it('responds with json', async () => {
        const response = await request(app)
            .post('/items')
            .send({ item: 'new' });
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toEqual({ item: 'new', _id: 'mockId' });
    });
});
