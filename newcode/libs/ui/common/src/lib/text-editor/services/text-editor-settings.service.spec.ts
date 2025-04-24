import { TestBed } from '@angular/core/testing';

import { TextEditorSettingsService } from './text-editor-settings.service';
import { HttpClientModule } from '@angular/common/http';

describe('TextEditorSettingsService', () => {
  let service: TextEditorSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(TextEditorSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  
});
