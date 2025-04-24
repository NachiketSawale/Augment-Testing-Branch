/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICosControllingGroupEntityGenerated extends IEntityBase {

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

  /**
   * MdcControllingGroupDetailFk
   */
  MdcControllingGroupDetailFk: number;

  /**
   * MdcControllingGroupFk
   */
  MdcControllingGroupFk: number;
}
