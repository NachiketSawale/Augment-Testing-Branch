/*
 * Copyright(c) RIB Software GmbH
 */

import { ICharacteristicSectionEntity } from './characteristic-section-entity.interface';

import { ICharacteristicChainEntity, ICharacteristicEntity, ICharacteristicValueEntity } from '@libs/basics/interfaces';

export interface ICharacteristicToUpdateEntityGenerated {

  /**
   * AutomaticAssignmentToSave
   */
  AutomaticAssignmentToSave?: ICharacteristicSectionEntity[] | null;

  /**
   * Characteristic
   */
  Characteristic?: ICharacteristicEntity | null;

  /**
   * CharacteristicChainToDelete
   */
  CharacteristicChainToDelete?: ICharacteristicChainEntity[] | null;

  /**
   * CharacteristicChainToSave
   */
  CharacteristicChainToSave?: ICharacteristicChainEntity[] | null;

  /**
   * CharacteristicValueToDelete
   */
  CharacteristicValueToDelete?: ICharacteristicValueEntity[] | null;

  /**
   * CharacteristicValueToSave
   */
  CharacteristicValueToSave?: ICharacteristicValueEntity[] | null;

  /**
   * DiscreteValueToDelete
   */
  DiscreteValueToDelete?: ICharacteristicValueEntity[] | null;

  /**
   * DiscreteValueToSave
   */
  DiscreteValueToSave?: ICharacteristicValueEntity[] | null;

  /**
   * EntitiesCount
   */
  EntitiesCount: number;

  /**
   * MainItemId
   */
  MainItemId: number;
}
