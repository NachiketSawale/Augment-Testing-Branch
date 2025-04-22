/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IProcurementCommonEventsEntity extends IEntityBase, IEntityIdentification{
	PrcPackageFk:number;
	PrcEventTypeFk:number;
	StartCalculated?:Date|null;
	EndCalculated?:Date|null;
	StartOverwrite?:Date|null;
	EndOverwrite?:Date|null;
	StartActual?:Date|null;
	EndActual?:Date|null;
	CommentText:string;
	StartRelevant?:Date|null;
	EndRelevant?:Date|null;
	StartActualBool:boolean;
	EndActualBool:boolean;
}