/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEquipmentPriceListEntity extends IEntityBase, IEntityIdentification {
	EtmContextFk: number;
	PricelistTypeFk: number;
	CurrencyFk: number;
	Percent: number;
	IsManualEditPlantMaster: boolean;
	IsManualEditJob: boolean;
	IsManualEditDispatching: boolean;
	PricePortion1Name: string;
	PricePortion2Name: string;
	PricePortion3Name: string;
	PricePortion4Name: string;
	PricePortion5Name: string;
	PricePortion6Name: string;
	CommentText: string;
	ValidFrom: Date | string;
	ValidTo: Date | string;
	CalculationTypeFk: number;
	ReferenceYear: number;
	DescriptionInfo?: IDescriptionInfo;
	UomFk: number;
	CatalogFk: number;
}
