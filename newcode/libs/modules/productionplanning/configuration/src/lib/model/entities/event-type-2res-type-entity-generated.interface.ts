/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEventType2ResTypeEntityGenerated extends IEntityBase {

	/*
	 * BasResourceContextFk
	 */
	BasResourceContextFk?: number | null;

	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * DateshiftModeResRequisition
	 */
	DateshiftModeResRequisition?: number | null;

	/*
	 * EventTypeFk
	 */
	EventTypeFk?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsDriver
	 */
	IsDriver?: boolean | null;

	/*
	 * IsLinkedFixToReservation
	 */
	IsLinkedFixToReservation?: boolean | null;

	/*
	 * IsTruck
	 */
	IsTruck?: boolean | null;

	/*
	 * ResResourceFk
	 */
	ResResourceFk?: number | null;

	/*
	 * ResTypeFk
	 */
	ResTypeFk?: number | null;
}
