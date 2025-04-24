/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsEventTypeRelEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * FixDuration
   */
  FixDuration: number;

  /**
   * FixLagTime
   */
  FixLagTime: number;

  /**
   * Id
   */
  Id: number;

  /**
   * MaterialFk
   */
  MaterialFk: number;

  /**
   * PpsEventTypeChildFk
   */
  PpsEventTypeChildFk: number;

  /**
   * PpsEventTypeParentFk
   */
  PpsEventTypeParentFk: number;

  /**
   * RelationKindFk
   */
  RelationKindFk: number;
}
