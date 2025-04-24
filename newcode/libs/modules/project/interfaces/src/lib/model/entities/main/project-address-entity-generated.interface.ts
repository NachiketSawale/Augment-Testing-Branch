/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IProjectEntity } from './project-main-entity.interface';

export interface IProjectAddressEntityGenerated extends IEntityBase {

/*
 * AddressEntity
 */
	// TODO: Add AddressEntity (previously in basics/shared, but it will cause circular dependency)
  AddressEntity?: object | null;

/*
 * AddressFk
 */
  AddressFk: number;

/*
 * AddressTypeFk
 */
  AddressTypeFk: number;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * Description
 */
  Description?: string | null;

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
}
