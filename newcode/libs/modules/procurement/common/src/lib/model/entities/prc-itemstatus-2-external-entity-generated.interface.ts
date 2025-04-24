/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcItemstatusEntity } from './prc-itemstatus-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPrcItemstatus2externalEntityGenerated extends IEntityBase {

  /**
   * BasExternalsourceFk
   */
  BasExternalsourceFk: number;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * ExtCode
   */
  ExtCode: string;

  /**
   * ExtDescription
   */
  ExtDescription?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Isdefault
   */
  Isdefault: boolean;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * PrcItemstatusEntity
   */
  PrcItemstatusEntity?: IPrcItemstatusEntity | null;

  /**
   * PrcItemstatusFk
   */
  PrcItemstatusFk: number;

  /**
   * Sorting
   */
  Sorting: number;
}
