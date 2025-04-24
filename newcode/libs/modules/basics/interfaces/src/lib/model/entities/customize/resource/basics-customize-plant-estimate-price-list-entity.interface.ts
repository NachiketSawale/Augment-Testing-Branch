/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePlantEstimatePriceListEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	LineItemContextFk: number;
	MasterDataContextFk: number;
	PlantDivisionFk: number;
	Percent: number;
	CalculationTypeFk: number;
	CatalogFk: number;
	UomFk: number;
	CommentText: string;
	IsDefault: boolean;
	IsLive: boolean;
	Sorting: number;
	ReferenceYear: number;
	PricelisttypeFk: number;
}
