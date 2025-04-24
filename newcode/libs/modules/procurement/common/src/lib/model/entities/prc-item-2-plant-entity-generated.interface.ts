/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcItem2PlantEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * PlantFk
   */
  PlantFk: number;

  /**
   * PlantGroupFk
   */
  PlantGroupFk: number;

  /**
   * PlantStatusFk
   */
  PlantStatusFk: number;

  /**
   * PlantTypeFk
   */
  PlantTypeFk: number;

  /**
   * PrcItemFk
   */
  PrcItemFk: number;
}
