/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsLogConfigEntityGenerated extends IEntityBase {

	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * EntityId
	 */
	EntityId?: number | null;

	/*
	 * EntityType
	 */
	EntityType?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * LogConfigType
	 */
	LogConfigType?: number | null;

	/*
	 * PpsLogReasonGroupFk
	 */
	PpsLogReasonGroupFk?: number | null;

	/*
	 * PropertyId
	 */
	PropertyId?: number | null;
}
