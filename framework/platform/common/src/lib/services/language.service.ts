/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { platformLanguageData } from '../constant/platform-language-data';
import { INumericOptions } from '../interfaces/numeric-options.interface';
import { PlatformConfigurationService } from './platform-configuration.service';

/**
 * Provides language info based on culture.
 */
@Injectable({
  providedIn: 'root'
})

export class PlatformLanguageService {

  private readonly configurationService = inject(PlatformConfigurationService);

  /**
   * Provides language info based on culture.
   * By default provides language info for 'en-gb'.
   * @param {string} culture optional parameter
   * @returns {INumericOptions} options
   */
  public getLanguageInfo(culture?: string): INumericOptions {
    return (culture ? platformLanguageData[culture.toLowerCase()] : platformLanguageData[this.configurationService.savedOrDefaultUiCulture]);

  }
}
