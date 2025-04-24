/*
 * Copyright(c) RIB Software GmbH
 */

import { BlobsEntity } from '@libs/basics/shared';
import { IEntityBase } from '@libs/platform/common';

export interface IPhotoEntityGenerated extends IEntityBase {

  /**
   * Blob
   */
  Blob?: BlobsEntity | null;

  /**
   * BlobsFk
   */
  BlobsFk: number;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * PhotoDate
   */
  PhotoDate?: Date | string | null;
}
