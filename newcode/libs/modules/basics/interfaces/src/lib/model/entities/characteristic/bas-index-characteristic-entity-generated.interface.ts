/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ICharacteristicEntity } from './characteristic-entity.interface';
import { IBasIndexHeaderEntity } from './bas-index-header-entity.interface';

export interface IBasIndexCharacteristicEntityGenerated extends IEntityBase {

  /**
   * CharacteristicEntity
   */
  CharacteristicEntity?: ICharacteristicEntity | null;

  /**
   * CharacteristicFk
   */
  CharacteristicFk: number;

  /**
   * CharacteristicSectionFk
   */
  CharacteristicSectionFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IndexHeaderFk
   */
  IndexHeaderFk: number;

  /**
   * IndexheaderEntity
   */
  IndexheaderEntity?: IBasIndexHeaderEntity | null;
}
