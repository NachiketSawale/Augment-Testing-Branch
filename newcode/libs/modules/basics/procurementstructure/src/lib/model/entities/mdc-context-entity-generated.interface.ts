/*
 * Copyright(c) RIB Software GmbH
 */

import { IInterCompanyStructureEntity } from './inter-company-structure-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMdcContextEntityGenerated extends IEntityBase {

  /**
   * BasCurrencyFk
   */
  BasCurrencyFk: number;

  /**
   * DescriptionTranslateType
   */
  DescriptionTranslateType?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * InterCompanyStructure
   */
  InterCompanyStructure?: IInterCompanyStructureEntity | null;

  /**
   * Isdefault
   */
  Isdefault: boolean;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * Sorting
   */
  Sorting: number;
}
