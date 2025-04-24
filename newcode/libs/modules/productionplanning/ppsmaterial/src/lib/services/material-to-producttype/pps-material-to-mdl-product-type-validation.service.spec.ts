import { TestBed } from '@angular/core/testing';

import { PpsMaterialToMdlProductTypeValidationService } from './pps-material-to-mdl-product-type-validation.service';
import { HttpClientModule } from '@angular/common/http';

describe('PpsMaterialToMdlProductTypeValidationService', () => {
  let service: PpsMaterialToMdlProductTypeValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
		imports: [HttpClientModule],
	});
    service = TestBed.inject(PpsMaterialToMdlProductTypeValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
