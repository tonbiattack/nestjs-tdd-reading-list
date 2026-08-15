import { Test, type TestingModule } from '@nestjs/testing';

import { ReadingListService } from '../application/reading-list.service';
import { ReadingListController } from './reading-list.controller';

describe('ReadingListController', () => {
  let controller: ReadingListController;
  let service: {
    add: jest.Mock;
    list: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      add: jest.fn(),
      list: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadingListController],
      providers: [{ provide: ReadingListService, useValue: service }],
    }).compile();

    controller = module.get(ReadingListController);
  });

  it('登録要求をサービスへ渡し、作成された本を返す', async () => {
    const createdBook = {
      id: 'book-1',
      title: 'テスト駆動開発',
      author: 'Kent Beck',
      status: 'unread' as const,
    };
    service.add.mockResolvedValue(createdBook);

    await expect(
      controller.create({ title: 'テスト駆動開発', author: 'Kent Beck' }),
    ).resolves.toEqual(createdBook);

    expect(service.add).toHaveBeenCalledWith({
      title: 'テスト駆動開発',
      author: 'Kent Beck',
    });
  });

  it('一覧取得をサービスへ委譲する', async () => {
    service.list.mockResolvedValue([]);

    await expect(controller.findAll()).resolves.toEqual([]);
    expect(service.list).toHaveBeenCalledTimes(1);
  });
});
