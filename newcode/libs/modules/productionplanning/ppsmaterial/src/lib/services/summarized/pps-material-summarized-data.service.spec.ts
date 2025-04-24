import { TestBed } from '@angular/core/testing';

import { PpsMaterialSummarizedDataService } from './pps-material-summarized-data.service';
import { HttpClientModule } from '@angular/common/http';

describe('PpsMaterialSummarizedDataService', () => {
  let service: PpsMaterialSummarizedDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
		imports: [HttpClientModule],
	});
    service = TestBed.inject(PpsMaterialSummarizedDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
