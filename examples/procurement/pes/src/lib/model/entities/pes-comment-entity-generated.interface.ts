/*
 * Copyright(c) RIB Software GmbH
 */

import { IPesHeaderEntity } from './pes-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPesCommentEntityGenerated extends IEntityBase {

  /**
   * BasCommentFk
   */
  BasCommentFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * PesHeaderEntity
   */
  PesHeaderEntity?: IPesHeaderEntity | null;

  /**
   * PesHeaderFk
   */
  PesHeaderFk: number;
}
