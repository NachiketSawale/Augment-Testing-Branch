jest.mock('quill/blots/embed', () => ({
    default: class Embed {
      public constructor() {}
      public static blotName = 'embed';
      public static tagName = 'DIV';
      public static className = 'ql-embed';
    },
  }));
   
  jest.mock('quill/blots/inline', () => ({
    default: class Inline {
      public constructor() {}
      public static blotName = 'inline';
    },
  }));

  jest.mock('quill', () => {
    const ListItem = jest.fn();
    const ParchmentMock = {
      StyleAttributor: class {
      public  constructor(public name: string, public attribute: string) {}
      },
    };
    class QuillMock {
        public static register = jest.fn();
        public static import = jest.fn((path: string) => {
        if (path === 'formats/list') {
          return ListItem;
        }
        if (path === 'blots/block') {
          return class Block {};
        }
        if (path === 'parchment') {
          return ParchmentMock;
        }
        return null;
      });
   
      public on = jest.fn();
      public getModule = jest.fn();
      public setText = jest.fn();
      public getText = jest.fn();
      public getContents = jest.fn();
    }
   
    return {
      __esModule: true,
      default: QuillMock,
      Parchment: ParchmentMock,
    };
  });
      
  jest.mock('quill/core', () => ({
    Delta: jest.fn().mockImplementation(() => ({
      insert: jest.fn(),
      delete: jest.fn(),
      retain: jest.fn(),
    })),
  }));