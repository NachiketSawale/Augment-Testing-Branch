/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICharacteristicGroup2SectionEntityGenerated extends IEntityBase {

  /**
   * CharacteristicGroupFk
   */
  CharacteristicGroupFk: number;

  /**
   * CharacteristicSectionFk
   */
  CharacteristicSectionFk: number;

  /**
   * Checked
   */
  Checked: boolean;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Id
   */
  Id: number;
}
