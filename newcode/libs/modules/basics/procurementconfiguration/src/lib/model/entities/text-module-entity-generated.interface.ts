/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcConfiguration2TextTypeEntity } from './prc-configuration-2-text-type-entity.interface';
import { IDescriptionInfo } from '@libs/platform/common';

export interface ITextModuleEntityGenerated {

  /**
   * BasBlobsFk
   */
  BasBlobsFk?: number | null;

  /**
   * BasClobsFk
   */
  BasClobsFk?: number | null;

  /**
   * BasLanguageFk
   */
  BasLanguageFk: number;

  /**
   * BasRubricFk
   */
  BasRubricFk?: number | null;

  /**
   * BasTextModuleContextFk
   */
  BasTextModuleContextFk: number;

  /**
   * BasTextModuleTypeFk
   */
  BasTextModuleTypeFk?: number | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * Language
   */
  Language: string;

  /**
   * PrcConfiguration2TextTypeEntities
   */
  PrcConfiguration2TextTypeEntities?: IPrcConfiguration2TextTypeEntity[] | null;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * TextFormatFk
   */
  TextFormatFk?: number | null;
}
