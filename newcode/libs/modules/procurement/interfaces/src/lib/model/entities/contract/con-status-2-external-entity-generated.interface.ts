/*
 * Copyright(c) RIB Software GmbH
 */

import { IConStatusEntity } from './con-status-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IConStatus2externalEntityGenerated extends IEntityBase {

  /**
   * BasExternalsourceFk
   */
  BasExternalsourceFk: number;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * ConStatusEntity
   */
  ConStatusEntity?: IConStatusEntity | null;

  /**
   * ConStatusFk
   */
  ConStatusFk: number;

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
   * Sorting
   */
  Sorting: number;
}
