import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Reading list API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /books で本を登録し、GET /books で登録内容を取得できる', async () => {
    const server = app.getHttpServer();

    const createResponse = await request(server)
      .post('/books')
      .send({ title: 'テスト駆動開発', author: 'Kent Beck' })
      .expect(201);

    expect(createResponse.body).toMatchObject({
      title: 'テスト駆動開発',
      author: 'Kent Beck',
      status: 'unread',
    });
    expect(createResponse.body.id).toEqual(expect.any(String));

    await request(server)
      .get('/books')
      .expect(200)
      .expect([createResponse.body]);
  });
});
