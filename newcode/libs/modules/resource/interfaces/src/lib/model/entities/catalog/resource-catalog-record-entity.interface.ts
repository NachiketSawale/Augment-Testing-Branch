/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceCatalogRecordEntity extends IEntityBase, IEntityIdentification {
	CatalogFk: number;
	Code: string;
	Description: string;
	Specification: string;
	Equipment: string;
	Consumable: string;
	Characteristic1: string;
	UoM1Fk: number;
	CharacteristicValue1: number;
	Characteristic2: string;
	UoM2Fk: number;
	CharacteristicValue2: number;
	MeasureA: string;
	UoMAFk: number;
	MeasureValueA: string;
	MeasureUnitA: number;
	MeasureB: string;
	UoMBFk: number;
	MeasureValueB: string;
	MeasureUnitB: number;
	MeasureC: string;
	UoMCFk: number;
	MeasureValueC: string;
	MeasureUnitC: number;
	MeasureD: string;
	UoMDFk: number;
	MeasureValueD: string;
	MeasureUnitD: number;
	MeasureE: string;
	UoMEFk: number;
	MeasureValueE: string;
	MeasureUnitE: number;
	Weight: string;
	MachineLive: number;
	OperationMonthsFrom: number;
	OperationMonthsTo: number;
	MonthlyFactorDepreciationInterestFrom?: number;
	MonthlyFactorDepreciationInterestTo?: number;
	MonthlyRepair?: number;
	Flag: string;
	ValueNew: number;
	WeightPercent: number;
	Reinstallment: number;
	ReinstallmentPercent: number;
	MonthlyRepairValue: number;
	MonthlyFactorDepreciationInterestValueFrom: number;
	MonthlyFactorDepreciationInterestValueTo: number;
	ProducerPriceIndex: number;
	CatalogCodeContentFk?: number;
	CharacteristicContent1: string;
	CharacterValueType1Fk?: number;
	CharacteristicContent2: string;
	CharacterValueType2Fk?: number;
	With: string;
	Without: string;
}
