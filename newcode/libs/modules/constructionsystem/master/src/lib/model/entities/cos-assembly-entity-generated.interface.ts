/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICosAssemblyEntityGenerated extends IEntityBase {

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
   * EstAssemblyCatFk
   */
  EstAssemblyCatFk: number | null;

  /**
   * EstHeaderFk
   */
  EstHeaderFk: number;

  /**
   * EstLineItemFk
   */
  EstLineItemFk: number | null;

  /**
   * Id
   */
  Id: number;
}
