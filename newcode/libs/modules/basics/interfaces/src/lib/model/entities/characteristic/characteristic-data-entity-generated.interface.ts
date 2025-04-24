/*
 * Copyright(c) RIB Software GmbH
 */

import { ICharacteristicEntity } from './characteristic-entity.interface';
import { ICharacteristicValueEntity } from './characteristic-value-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICharacteristicDataEntityGenerated extends IEntityBase {

  /**
   * CharacteristicEntity
   */
  CharacteristicEntity?: ICharacteristicEntity | null;

  /**
   * CharacteristicFk
   */
  CharacteristicFk: number;

  /**
   * CharacteristicGroupFk
   */
  CharacteristicGroupFk: number;

  /**
   * CharacteristicSectionFk
   */
  CharacteristicSectionFk: number;

  /**
   * CharacteristicTypeFk
   */
  CharacteristicTypeFk: number;

  /**
   * CharacteristicValueEntity
   */
  CharacteristicValueEntity?: ICharacteristicValueEntity | null;

  /**
   * CharacteristicValueFk
   */
  CharacteristicValueFk?: number | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsComeBasics
   */
  IsComeBasics?: boolean | null;

  /**
   * IsReadonly
   */
  IsReadonly: boolean;

  /**
   * ObjectFk
   */
  ObjectFk: number;

  /**
   * ObjectPKey1Fk
   */
  ObjectPKey1Fk?: number | null;

  /**
   * ObjectPKey2Fk
   */
  ObjectPKey2Fk?: number | null;

  /**
   * ObjectPKey3Fk
   */
  ObjectPKey3Fk?: number | null;

  /**
   * ValueBool
   */
  ValueBool?: boolean | null;

  /**
   * ValueDate
   */
  ValueDate?: Date | string | null;

  /**
   * ValueNumber
   */
  ValueNumber?: number | null;

  /**
   * ValueText
   */
  //ValueText?: string | null; //TODO:Generted through DTO
  ValueText?: string | number | boolean  | null,
}
