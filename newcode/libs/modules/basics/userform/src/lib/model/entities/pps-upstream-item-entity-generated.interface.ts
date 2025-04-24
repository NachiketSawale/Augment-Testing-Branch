/*
 * Copyright(c) RIB Software GmbH
 */

import { IPpsUpstreamItemFormDataEntity } from './pps-upstream-item-form-data-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPpsUpstreamItemEntityGenerated extends IEntityBase {

  /**
   * Id
   */
  Id: number;

  /**
   * PpsItemFk
   */
  PpsItemFk?: number | null;

  /**
   * PpsItemUpstreamFk
   */
  PpsItemUpstreamFk?: number | null;

  /**
   * PpsUpstreamItemFormdataEntities
   */
  PpsUpstreamItemFormdataEntities?: IPpsUpstreamItemFormDataEntity[] | null;

  /**
   * PpsUpstreamTypeFk
   */
  PpsUpstreamTypeFk?: number | null;
}
