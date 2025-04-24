import { TestBed } from '@angular/core/testing';

import { PpsCadToMaterialValidationService } from './pps-cad-to-material-validation.service';
import { HttpClientModule } from '@angular/common/http';

describe('PpsCadToMaterialValidationService', () => {
  let service: PpsCadToMaterialValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
		imports: [HttpClientModule],
	});
    service = TestBed.inject(PpsCadToMaterialValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
