/*
 * Copyright(c) RIB Software GmbH
 */

import { IDependentDataEntity } from './dependent-data-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IDependentDataTypeEntityGenerated extends IEntityBase {

  /**
   * DependentDataEntities
   */
  DependentDataEntities?: IDependentDataEntity[] | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * Sorting
   */
  Sorting: number;
}
