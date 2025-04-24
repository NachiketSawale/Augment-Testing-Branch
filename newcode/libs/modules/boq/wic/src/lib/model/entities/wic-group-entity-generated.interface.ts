/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IWicBoqEntity } from '@libs/boq/interfaces';
import { IWicGroup2ClerkEntity } from './wic-group-2clerk-entity.interface';
import { IWicGroupEntity } from './wic-group-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IWicGroupEntityGenerated extends IEntityBase {

/*
 * AccessRightDescriptorFk
 */
  AccessRightDescriptorFk?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * Id
 */
	readonly Id: number;

/*
 * MdcLineItemContextFk
 */
  MdcLineItemContextFk?: number | null;

/*
 * PermissionObjectInfo
 */
  PermissionObjectInfo?: string | null;

/*
 * WicBoqs
 */
  WicBoqs?: IWicBoqEntity[] | null;

/*
 * WicGroup2Clerks
 */
  WicGroup2Clerks?: IWicGroup2ClerkEntity[] | null;

/*
 * WicGroupChildren
 */
  WicGroupChildren?: IWicGroupEntity[] | null;

/*
 * WicGroupFk
 */
  WicGroupFk?: number | null;

/*
 * WicGroupParent
 */
  WicGroupParent?: IWicGroupEntity | null;

/*
 * WicGroups
 */
  WicGroups?: IWicGroupEntity[] | null;
}
