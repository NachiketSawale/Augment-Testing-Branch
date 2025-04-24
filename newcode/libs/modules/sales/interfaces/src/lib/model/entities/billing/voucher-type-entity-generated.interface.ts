/*
 * Copyright(c) RIB Software GmbH
 */

import { ICategoryDefaultsEntity } from './category-defaults-entity.interface';
import { IBilHeaderEntity } from './bil-header-entity.interface';
import { ITypeEntity } from './type-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IVoucherTypeEntityGenerated extends IEntityBase {

  /**
   * Acronym
   */
  Acronym?: string | null;

  /**
   * BilTypeFk
   */
  BilTypeFk: number;

  /**
   * CategoryDefaultsEntities
   */
  CategoryDefaultsEntities?: ICategoryDefaultsEntity[] | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * HeaderEntities
   */
  HeaderEntities?: IBilHeaderEntity[] | null;

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
   * Sorting
   */
  Sorting: number;

  /**
   * TypeEntity
   */
  TypeEntity?: ITypeEntity | null;
}
