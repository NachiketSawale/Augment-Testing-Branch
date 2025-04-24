/*
 * Copyright(c) RIB Software GmbH
 */

import { IUrbConfigEntity } from '@libs/estimate/shared';

export interface IEstMainCreateBidContext{

	BasicSetting: IEstMainCreateBidBasic;

	StructureSetting: IEstMainCreateBIdStructure;

	UrbSetting: IUrbConfigEntity
}

export interface IEstMainCreateBidBasic{

	UpdateModel: number;
	TypeFk: number;
	ConfigurationFk: number;
	RubricCategoryFk: number;
	Code: string;
	Description: string;
	ResponsibleCompanyFk: number;
	ClerkFk: number;
	ProjectFk: number;
	ContractTypeFk: number;
	BusinesspartnerFk: number;
	SubsidiaryFk: number;
	CustomerFk?: number | null;
	PrcStructureFk?: number | null;
	PrjChangeFk?: number | null;
	BidHeaderFk?: number | null;

}

export interface IEstMainCreateBIdStructure{
	StructureType: number;
	MajorLineItems: boolean;
	ProjectChangeLineItems: boolean;
	EstUppUsingURP: boolean;
	CalculateHours: boolean;
	EstimateScope: number;
	DeleteOriginalBidBoq: boolean;
	CopyLineItemRete: string;
}