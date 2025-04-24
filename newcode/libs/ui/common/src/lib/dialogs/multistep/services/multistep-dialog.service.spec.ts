import { TestBed } from '@angular/core/testing';

import { UiCommonMultistepDialogService } from './multistep-dialog.service';
import { MatDialogModule } from '@angular/material/dialog';

describe('UiCommonMultistepDialogService', () => {
  let service: UiCommonMultistepDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
		  imports: [MatDialogModule],
	  });
    service = TestBed.inject(UiCommonMultistepDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
