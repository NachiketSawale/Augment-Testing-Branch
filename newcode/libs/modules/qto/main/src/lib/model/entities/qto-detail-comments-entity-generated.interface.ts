/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IQtoMainDetailGridEntity } from '../qto-main-detail-grid-entity.class';

export interface IQtoDetailCommentsEntityGenerated extends IEntityBase {

/*
 * BasQtoCommentsTypeFk
 */
  BasQtoCommentsTypeFk: number;

/*
 * CommentDescription
 */
  CommentDescription?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsCreate
 */
  IsCreate?: boolean | null;

/*
 * IsDelete
 */
  IsDelete?: boolean | null;

/*
 * IsRead
 */
  IsRead?: boolean | null;

/*
 * IsWrite
 */
  IsWrite?: boolean | null;

/*
 * PermissionObjectInfo
 */
  PermissionObjectInfo?: string | null;

/*
 * QtoDetailEntity
 */
  QtoDetailEntity?: IQtoMainDetailGridEntity | null;

/*
 * QtoDetailFk
 */
  QtoDetailFk: number;
}
