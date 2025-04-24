/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMaterialTemplateTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	IsTemplate: boolean;
	MatchCode: boolean;
	Description1: boolean;
	Description2: boolean;
	Specification: boolean;
	MaterialABC: boolean;
	Currency: boolean;
	Uom: boolean;
	RetailPrice: boolean;
	ListPrice: boolean;
	Discount: boolean;
	Charges: boolean;
	PriceCondition: boolean;
	EstimatePrice: boolean;
	PriceUnit: boolean;
	UomPriceUnit: boolean;
	FactorPriceUnit: boolean;
	SellUnit: boolean;
	MaterialDiscountGrp: boolean;
	WeightType: boolean;
	WeightNumber: boolean;
	Weight: boolean;
	ExternalCode: boolean;
	TaxCode: boolean;
	Blobs: boolean;
	BlobsSpecification: boolean;
	Material: boolean;
	Agreement: boolean;
	LeadTime: boolean;
	MinQuantity: boolean;
	CostType: boolean;
	LeadTimeExtra: boolean;
	UserDefined1: boolean;
	UserDefined2: boolean;
	UserDefined3: boolean;
	UserDefined4: boolean;
	UserDefined5: boolean;
	FactorHour: boolean;
	UpdIsLive: boolean;
	IsProduct: boolean;
	Brand: boolean;
	ModelName: boolean;
	UserDefinedText1: boolean;
	UserDefinedText2: boolean;
	UserDefinedText3: boolean;
	UserDefinedText4: boolean;
	UserDefinedText5: boolean;
	UserDefinedDate1: boolean;
	UserDefinedDate2: boolean;
	UserDefinedDate3: boolean;
	UserDefinedDate4: boolean;
	UserDefinedDate5: boolean;
	UserDefinedNumber1: boolean;
	UserDefinedNumber2: boolean;
	UserDefinedNumber3: boolean;
	UserDefinedNumber4: boolean;
	UserDefinedNumber5: boolean;
	DangerClass: boolean;
	PackageType: boolean;
	UomVolume: boolean;
	Volume: boolean;
	InheritCodeFk: number;
	UpdateUomWeight: boolean;
}
