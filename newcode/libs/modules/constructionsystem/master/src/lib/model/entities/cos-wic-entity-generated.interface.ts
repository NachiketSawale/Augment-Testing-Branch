/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICosWicEntityGenerated extends IEntityBase {

  /**
   * BoqHeaderFk
   */
  BoqHeaderFk: number;

  /**
   * BoqItemFk
   */
  BoqItemFk: number;

  /**
   * BoqWicCatBoqFk
   */
  BoqWicCatBoqFk: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CosHeaderFk
   */
  CosHeaderFk: number;

  /**
   * Id
   */
  Id: number;
}
