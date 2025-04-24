/*
 * Copyright(c) RIB Software GmbH
 */

import { IRubricCategory2CompanyEntity } from './rubric-category-2-company-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IRubricCategoryEntityGenerated extends IEntityBase {

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * DescriptionShort
   */
  DescriptionShort?: string | null;

  /**
   * DescriptionShortTr
   */
  DescriptionShortTr?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * RubricCategory2CompEntities
   */
  RubricCategory2CompEntities?: IRubricCategory2CompanyEntity[] | null;

  /**
   * RubricFk
   */
  RubricFk: number;

  /**
   * Sorting
   */
  Sorting: number;
}
