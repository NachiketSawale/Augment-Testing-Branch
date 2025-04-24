/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface ICharacteristicGroupDataCombineEntityGenerated {

  /**
   * CharacteristicGroupFk
   */
  CharacteristicGroupFk?: number | null;

  /**
   * CharacteristicTypeFk
   */
  CharacteristicTypeFk: number;

  /**
   * Code
   */
  Code?: string | null;

  /**
   * DefaultValue
   */
  DefaultValue?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsGroup
   */
  IsGroup: boolean;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * ValidFrom
   */
  ValidFrom?: Date | string | null;

  /**
   * ValidTo
   */
  ValidTo?: Date | string | null;
}
