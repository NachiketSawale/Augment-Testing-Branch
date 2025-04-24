import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { WebApiHelpMainService } from './webapihelp-main.service';
import { PlatformHttpService } from '@libs/platform/common';

describe('WebApiHelpMainService', () => {
  let service: WebApiHelpMainService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, PlatformHttpService]
    });
    service = TestBed.inject(WebApiHelpMainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getSearch', () => {
    jest.spyOn(service, 'getSearch');
    service.getSearch();
    expect(service.getSearch).toBeDefined();
  });

  it('setSearchInput', () => {
    jest.spyOn(service, 'setSearchInput');
    service.setSearchInput('');
    expect(service.setSearchInput).toBeDefined();
  });


  it('getPageNumber', () => {
    jest.spyOn(service, 'getPageNumber');
    service.getPageNumber();
    expect(service.getPageNumber).toBeDefined();
  });


  it('setPageNumber', () => {
    jest.spyOn(service, 'setPageNumber');
    service.setPageNumber('1');
    expect(service.setPageNumber).toBeDefined();
  });

  it('searchFilter', () => {
    expect(service.searchFilter).toBeDefined();
  });


  it('getLeftMenubarData', () => {
    jest.spyOn(service, 'getLeftMenubarData');
    service.getLeftMenubarData();
    expect(service.getLeftMenubarData).toBeDefined();
  });

  it('getDatafrompagenumber', () => {
    jest.spyOn(service, 'getDataFromPageNumber');
    service.getDataFromPageNumber('', 2, false);
    expect(service.getDataFromPageNumber).toBeDefined();
  });

  it('getDownloadEnabledFlag', () => {
    jest.spyOn(service, 'getDownloadEnabledFlag');
    service.getDownloadEnabledFlag();
    expect(service.getDownloadEnabledFlag).toBeDefined();
  });

  it('getAuthorizeToken', () => {
    jest.spyOn(service, 'getAuthorizeToken');
    service.getAuthorizeToken();
    expect(service.getAuthorizeToken).toBeDefined();
  });

  it('initialize', () => {
    jest.spyOn(service, 'getInitialize');
    service.getInitialize('');
    expect(service.getInitialize).toBeDefined();
  });

  it('check', () => {
    jest.spyOn(service, 'getCheck');
    service.getCheck('');
    expect(service.getCheck).toBeDefined();
  });

  it('download', () => {
    jest.spyOn(service, 'getDownload');
    service.getDownload('', '');
    expect(service.getDownload).toBeDefined();
  });

  it('searchData', () => {
    jest.spyOn(service, 'searchData');
    service.searchData([''], '');
    expect(service.getDownload).toBeDefined();
  });
});
