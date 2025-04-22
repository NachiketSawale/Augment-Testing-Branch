/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcWarrantyEntity } from './prc-warranty-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IWarrantyObligationEntityGenerated extends IEntityBase {

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
   * PrcWarrantyEntities
   */
  PrcWarrantyEntities?: IPrcWarrantyEntity[] | null;

  /**
   * Sorting
   */
  Sorting: number;
}
