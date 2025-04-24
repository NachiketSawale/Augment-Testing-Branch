/*
 * Copyright(c) RIB Software GmbH
 */

import { ICharacteristicGroupEntity } from './characteristic-group-entity.interface';
import { ICharacteristicGroup2CompanyEntity } from './characteristic-group-2-company-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { ICharacteristicGroup2SectionEntity } from './characteristic-group-2-section-entity.interface';

export interface ICharacteristicGroupEntityGenerated extends IEntityBase {

  /**
   * CharacteristicGroup
   */
  CharacteristicGroup?: ICharacteristicGroupEntity | null;

  /**
   * CharacteristicGroup2Companys
   */
  CharacteristicGroup2Companys?: ICharacteristicGroup2CompanyEntity[] | null;

  /**
   * CharacteristicGroup2Sections
   */
  CharacteristicGroup2Sections?: ICharacteristicGroup2SectionEntity[] | null;

  /**
   * CharacteristicGroupFk
   */
  CharacteristicGroupFk?: number | null;

  /**
   * CharacteristicGroups
   */
  CharacteristicGroups?: ICharacteristicGroupEntity[] | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Groups
   */
  Groups?: ICharacteristicGroupEntity[] | null;

  /**
   * HasChildren
   */
  HasChildren: boolean;

  /**
   * Id
   */
  Id: number;
}
