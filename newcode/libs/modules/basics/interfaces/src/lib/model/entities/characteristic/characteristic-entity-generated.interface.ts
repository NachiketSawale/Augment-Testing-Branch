/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IBasIndexCharacteristicEntity } from './bas-index-characteristic-entity.interface';
import { ICharacteristicChainEntity } from './characteristic-chain-entity.interface';

export interface ICharacteristicEntityGenerated extends IEntityBase {

  /**
   * CharacteristicGroupFk
   */
  CharacteristicGroupFk: number;

  /**
   * CharacteristicTypeFk
   */
  CharacteristicTypeFk: number;

  /**
   * Chrctrstc2indexEntities
   */
  Chrctrstc2indexEntities?: IBasIndexCharacteristicEntity[] | null;

  /**
   * ChrctrstcChainEntities_ChainedCharacteristicFk
   */
  ChrctrstcChainEntities_ChainedCharacteristicFk?: ICharacteristicChainEntity[] | null;

  /**
   * ChrctrstcChainEntities_CharacteristicFk
   */
  ChrctrstcChainEntities_CharacteristicFk?: ICharacteristicChainEntity[] | null;

  /**
   * Code
   */
  Code: string;

  /**
   * DefaultValue
   */
  //DefaultValue?: string | null; //TODO:Generted through DTO
  DefaultValue?: string | boolean | number | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IndexHeaderFk
   */
  IndexHeaderFk: number;

  /**
   * IsReadonly
   */
  IsReadonly: boolean;

  /**
   * IsVisible
   */
  IsVisible: boolean;

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
