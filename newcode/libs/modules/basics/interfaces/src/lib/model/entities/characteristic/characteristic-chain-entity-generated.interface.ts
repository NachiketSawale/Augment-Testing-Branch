/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ICharacteristicEntity } from './characteristic-entity.interface';

export interface ICharacteristicChainEntityGenerated extends IEntityBase {

  /**
   * ChainedCharacteristicFk
   */
  ChainedCharacteristicFk?: number | null;

  /**
   * CharacteristicEntity_ChainedCharacteristicFk
   */
  CharacteristicEntity_ChainedCharacteristicFk?: ICharacteristicEntity | null;

  /**
   * CharacteristicEntity_CharacteristicFk
   */
  CharacteristicEntity_CharacteristicFk?: ICharacteristicEntity | null;

  /**
   * CharacteristicFk
   */
  CharacteristicFk: number;

  /**
   * Id
   */
  Id: number;
}
