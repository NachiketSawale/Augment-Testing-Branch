/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinessPartnerEntity } from './business-partner-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ICreditstandingEntityGenerated extends IEntityBase {

  /**
   * BusinessPartnerEntities
   */
  BusinessPartnerEntities?: IBusinessPartnerEntity[] | null;

  /**
   * Code
   */
  Code?: string | null;

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
   * IsLive
   */
  IsLive: boolean;

  /**
   * Sorting
   */
  Sorting: number;
}
