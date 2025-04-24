/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface ISchedulingExceptionDayEntityGeneratedInterface extends IEntityBase, IEntityIdentification {
	Id: number;
	Code: string;
	CommentText?: string;
	ExceptDate:dateFns;
	CalendarFk:number;
	IsWorkday:boolean;
	BackgroundColor:number;
	FontColor: number;
	WorkStart :dateFns;
	IsShownInChart :boolean;
	WorkEnd :dateFns;
}
