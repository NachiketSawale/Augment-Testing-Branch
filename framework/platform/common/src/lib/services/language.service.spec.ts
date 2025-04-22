/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { PlatformLanguageService } from './language.service';
import { PlatformConfigurationService } from './platform-configuration.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('PlatformLanguageService', () => {
  let service: PlatformLanguageService;
  let configService: PlatformConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
	    imports: [HttpClientModule]
    });
	 TestBed.inject(HttpClient);
    service = TestBed.inject(PlatformLanguageService);
    configService = TestBed.inject(PlatformConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return language info', () => {
    const culture = 'en-gb';
    const options = {
      numeric: {
        decimal: '.',
        thousand: ','
      }
    };

    expect(service.getLanguageInfo(culture)).toEqual(options);
  });


  it('should return language info without culture', () => {
    const options = {
      numeric: {
        decimal: '.',
        thousand: ','
      }
    };

    expect(service.getLanguageInfo()).toEqual(options);
  });
});
