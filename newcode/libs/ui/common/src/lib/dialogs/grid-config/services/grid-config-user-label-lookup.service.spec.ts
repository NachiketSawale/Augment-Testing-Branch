/*
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { UiCommonGridConfigUserLabelLookupService } from './grid-config-user-label-lookup.service';

interface ITestEntity{

}

describe('GridConfigUserLabelLookupService', () => {
  let service: UiCommonGridConfigUserLabelLookupService<ITestEntity>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule]
    });
    service = TestBed.inject(UiCommonGridConfigUserLabelLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
