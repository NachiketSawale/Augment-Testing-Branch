/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICommentEntityGenerated extends IEntityBase {

  /**
   * BilHeaderFk
   */
  BilHeaderFk: number;

  /**
   * CommentFk
   */
  CommentFk: number;

  /**
   * HeaderEntity
   */
  HeaderEntity?: IBilHeaderEntity | null;

  /**
   * Id
   */
  Id: number;
}
