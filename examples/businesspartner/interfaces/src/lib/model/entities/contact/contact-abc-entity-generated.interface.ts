/*
 * Copyright(c) RIB Software GmbH
 */

import { IContactEntity } from './contact-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IContactAbcEntityGenerated extends IEntityBase {

  /**
   * ContactEntities
   */
  ContactEntities?: IContactEntity[] | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Icon
   */
  Icon?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * Sorting
   */
  Sorting: number;
}
