/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsSharedHistoricalPriceForItemEntity extends IEntityBase, IEntityIdentification {
	Index?: string;
	PId?: number | null;
	MaterialId?: number | null;
	Selected: boolean;
	ItemCodeAndDesc?: string;
	SourceType?: string;
	CalatlogType?: string;
	CatalogId?: number | null;
	Type: number;
	SourceCodeAndDesc?: string;
	UnitRate: number;
	CurrencyId?: number | null;
	ProjectId?: number | null;
	ConvertedUnitRate?: number;
	Variance?: number;
	VarianceFormatter?: number | null;
	PriceUnit: number;
	MaterialPriceListId?: number | null;
	UomId: number;
	Weighting: number;
	BusinessPartnerId?: number | null;
	DateTime?: Date | null;
	Co2Project?: number | null;
	Co2Source?: number | null;
	Children?: IBasicsSharedHistoricalPriceForItemEntity[] | [];
	Date: Date;
	UpdateDate: Date;
}
