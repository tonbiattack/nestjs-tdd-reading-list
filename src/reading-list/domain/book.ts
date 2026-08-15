export type ReadingStatus = 'unread' | 'read';

export interface BookProps {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly status: ReadingStatus;
}

export interface NewBookProps {
  readonly id: string;
  readonly title: string;
  readonly author: string;
}

export class InvalidBookTitleError extends Error {
  public constructor() {
    super('本のタイトルは空にできません。');
    this.name = 'InvalidBookTitleError';
  }
}

export class Book {
  public static create(props: NewBookProps): BookProps {
    const title = props.title.trim();

    if (title.length === 0) {
      throw new InvalidBookTitleError();
    }

    return {
      id: props.id,
      title,
      author: props.author.trim(),
      status: 'unread',
    };
  }
}
