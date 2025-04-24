/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEngTask2ClerkEntityGenerated extends IEntityBase {
	/**
	 * ClerkFk
	 */
	ClerkFk: number;

	/**
	 * ClerkRoleFk
	 */
	ClerkRoleFk: number;

	/**
	 * CommentText
	 */
	CommentText?: string | null;

	/**
	 * EngTaskFk
	 */
	EngTaskFk: number;

	/**
	 * EngTaskPlannedFinish
	 */
	EngTaskPlannedFinish?: string | null;

	/**
	 * EngTaskPlannedStart
	 */
	EngTaskPlannedStart?: string | null;

	/**
	 * From
	 */
	From?: string | null;

	/**
	 * Id
	 */
	Id: number;

	// /**
	//  * ModificationInfo
	//  */
	// ModificationInfo?: IModificationInfo | null;

	/**
	 * ValidFrom
	 */
	ValidFrom?: string | null;

	/**
	 * ValidTo
	 */
	ValidTo?: string | null;
}
