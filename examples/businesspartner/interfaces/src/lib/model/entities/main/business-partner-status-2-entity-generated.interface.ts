/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinessPartnerEntity } from './business-partner-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IBusinessPartnerStatus2EntityGenerated extends IEntityBase {

  /**
   * BusinessPartnerEntities
   */
  BusinessPartnerEntities?: IBusinessPartnerEntity[] | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Icon
   */
  Icon: number;

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
