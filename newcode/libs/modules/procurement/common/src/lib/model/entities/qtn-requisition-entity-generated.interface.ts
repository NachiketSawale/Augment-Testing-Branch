/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcHeaderEntity } from './prc-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IQtnRequisitionEntityGenerated extends IEntityBase {

  /**
   * Id
   */
  Id: number;

  /**
   * PrcHeaderEntity
   */
  PrcHeaderEntity?: IPrcHeaderEntity | null;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * QtnHeaderFk
   */
  QtnHeaderFk: number;

  /**
   * ReqHeaderFk
   */
  ReqHeaderFk: number;
}
