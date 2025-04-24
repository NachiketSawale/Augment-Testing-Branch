/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CloudDesktopTestService } from './cloud-desktop-test.service';



describe('CloudDesktopTestService', () => {
  let service: CloudDesktopTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: []
    });
    service = TestBed.inject(CloudDesktopTestService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should called showControlTestDialog', () => {
    expect(service.showControlTestDialog());
  });

  it('should called showCustomDialog', () => {
    expect(service.showCustomDialog());
  });

  it('should called showErrorDialogOptions', () => {
    expect(service.showErrorDialogOptions());
  });

  it('should called createFormConfig', () => {
    expect(service.createFormConfig());
  });
});
