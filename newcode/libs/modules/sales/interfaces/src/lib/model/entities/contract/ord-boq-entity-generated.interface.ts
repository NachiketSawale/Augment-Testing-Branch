/*
 * Copyright(c) RIB Software GmbH
 */

import { IOrdHeaderEntity } from './ord-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IOrdBoqEntityGenerated extends IEntityBase {

  /**
   * BoqHeaderFk
   */
  BoqHeaderFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * OrdHeaderEntity
   */
  OrdHeaderEntity?: IOrdHeaderEntity | null;

  /**
   * OrdHeaderFk
   */
  OrdHeaderFk: number;
}
