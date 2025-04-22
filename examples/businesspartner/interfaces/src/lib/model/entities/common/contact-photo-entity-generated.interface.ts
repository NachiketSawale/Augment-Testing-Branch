/*
 * Copyright(c) RIB Software GmbH
 */

import { BlobsEntity } from '@libs/basics/shared';
import { IEntityBase } from '@libs/platform/common';
import { IContactEntity } from '../contact';

export interface IContactPhotoEntityGenerated extends IEntityBase {

  /**
   * Blob
   */
  Blob?: BlobsEntity | null;

  /**
   * BlobsFk
   */
  BlobsFk: number;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * ContactEntity
   */
  ContactEntity?: IContactEntity | null;

  /**
   * ContactFk
   */
  ContactFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * PhotoDate
   */
  PhotoDate?: Date | string | null;
}
