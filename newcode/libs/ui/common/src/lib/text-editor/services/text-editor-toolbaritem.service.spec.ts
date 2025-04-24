import { TestBed } from '@angular/core/testing';

import { TextEditorToolbaritemService } from './text-editor-toolbaritem.service';

describe('TextEditorToolbaritemService', () => {
  
  let service: TextEditorToolbaritemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextEditorToolbaritemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
});
