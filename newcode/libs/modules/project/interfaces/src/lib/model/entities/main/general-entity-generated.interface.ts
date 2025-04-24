/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IProjectEntity } from './project-main-entity.interface';


export interface IGeneralEntityGenerated extends IEntityBase {

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * GeneralstypeFk
 */
  GeneralstypeFk: number;

/*
 * Id
 */
  Id: number;

/*
 * ProjectEntity
 */
  ProjectEntity?: IProjectEntity | null;

/*
 * ProjectFk
 */
  ProjectFk: number;

/*
 * Value
 */
  Value: number;

/*
 * ValueType
 */
  ValueType?: number | null;
}
