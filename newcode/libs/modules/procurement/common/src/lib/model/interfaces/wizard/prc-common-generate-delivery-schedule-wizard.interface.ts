/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcItemEntity } from '../../entities/prc-item-entity.interface';

export interface IPrcItemEntitySelectable extends IPrcItemEntity {
	isSelected: boolean;
	SourceStatus?: number;
	MinStartDate?: Date;
	MaxFinishDate?: Date;
}

export interface IGenerateDeliverySchedulePrepareItemScope {
	BasicOption: number;
	PackageId: number;
	PrcHeaderId?: number | undefined;
	ActivityFk?: number | undefined;
}

export interface IGenerateDeliverySchedulePrepareItems {
	LinkedEstLineItem: boolean;
	LinkedEstLineItemAction: boolean;

	HasActivity: boolean;
	LinkedActivity: boolean;
	LinkedActivityAction: boolean;
	SelectIds: number[];
}

export interface IGenerateDeliverySchedulePrepareSpecifyDetails {
	DescriptionPrefix: string | undefined;
	RepeatOptionId: number;
	StartDate: Date | undefined;
	EndDate: Date | undefined;
	Occurrence: number | undefined;
	TimeRequired?: string | undefined;
	RoundUpQuantity: boolean | undefined;
	UseTempSafetyLeadTime: number | undefined | null;

	OccurrenceAction: boolean;
	UseTempSafetyLeadTimeAction: boolean;
	StartDateAction: boolean;
	EndDateAction: boolean;
	HasError: boolean;
}

export interface IGenerateDeliveryScheduleWarningResult {
	MdcMaterialFk: number;
	Description1: string;
	PackageQuantity: number;
	EstimateQuantity: number;
	Difference: number;
	BasUomFk: number;
}

export interface IGenerateDeliveryScheduleDataComplete {
	multipleOptions: boolean;
	prepareItemScope: {
		optionItem: IGenerateDeliverySchedulePrepareItemScope;
	};
	prepareItems: {
		optionItem: IGenerateDeliverySchedulePrepareItems;
		prcItems: IPrcItemEntitySelectable[];
	};
	prepareSpecifyDetails: {
		optionItem: IGenerateDeliverySchedulePrepareSpecifyDetails;
	};
	prepareResultItems: {
		isSuccess: boolean;
		warningItems: IGenerateDeliveryScheduleWarningResult[];
	};
}
