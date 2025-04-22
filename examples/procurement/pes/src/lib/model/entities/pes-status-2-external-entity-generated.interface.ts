/*
 * Copyright(c) RIB Software GmbH
 */

import { IPesStatusEntity } from './pes-status-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPesStatus2externalEntityGenerated extends IEntityBase {

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
   * PesStatusEntity
   */
  PesStatusEntity?: IPesStatusEntity | null;

  /**
   * PesStatusFk
   */
  PesStatusFk: number;

  /**
   * Sorting
   */
  Sorting: number;
}
