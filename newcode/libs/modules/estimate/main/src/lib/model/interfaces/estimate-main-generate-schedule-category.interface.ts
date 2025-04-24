/*
 * Copyright(c) RIB Software GmbH
 */

export interface IGenerateScheduleCategory {
	TemplateProjectFk: number;
	TemplateScheduleFk: number;
	StartDate: Date;
	UseTargetProjectCalendar: boolean;
	UseLineItemQuantity: boolean;
	UseLineItemTime: boolean;
	EstimateHeaderId:number;
	Code: string;
}