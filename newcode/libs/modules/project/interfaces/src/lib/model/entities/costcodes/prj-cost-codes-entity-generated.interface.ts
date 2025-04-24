/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { IProjectCostCodesJobRateEntity } from './project-cost-codes-job-rate-entity.interface';
import { IPrjCostCodesEntity } from './prj-cost-codes-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { ICostCodeEntity } from '@libs/basics/interfaces';

export interface IPrjCostCodesEntityGenerated extends IEntityBase, ICostCodeEntity {
	/*
	 * AbcClassificationFk
	 */
	AbcClassificationFk?: number | null;

	/*
	 * BasCostCode
	 */
	BasCostCode?: ICostCodeEntity | null;

	/*
	 * Co2Project
	 */
	Co2Project?: number | null;

	/*
	 * Co2Source
	 */
	Co2Source?: number | null;

	/*
	 * Co2SourceFk
	 */
	Co2SourceFk?: number | null;

	/*
	 * ContrCostCodeFk
	 */
	ContrCostCodeFk?: number | null;

	//CostCodes :IPrjCostCodesEntity[]
	/*
	 * Contribution
	 */
	Contribution?: number | null;

	/*
	 * CostCodeLevel1Fk
	 */
	CostCodeLevel1Fk?: number | null;

	/*
	 * CostCodeLevel2Fk
	 */
	CostCodeLevel2Fk?: number | null;

	/*
	 * CostCodeLevel3Fk
	 */
	CostCodeLevel3Fk?: number | null;

	/*
	 * CostCodeLevel4Fk
	 */
	CostCodeLevel4Fk?: number | null;

	/*
	 * CostCodeLevel5Fk
	 */
	CostCodeLevel5Fk?: number | null;

	/*
	 * CostCodeLevel6Fk
	 */
	CostCodeLevel6Fk?: number | null;

	/*
	 * CostCodeLevel7Fk
	 */
	CostCodeLevel7Fk?: number | null;

	/*
	 * CostCodeLevel8Fk
	 */
	CostCodeLevel8Fk?: number | null;

	/*
	 * CostCodeParentFk
	 */
	CostCodeParentFk?: number | null;

	/*
	 * CostCodePortionsFk
	 */
	CostCodePortionsFk?: number | null;

	/*
	 * CostGroupPortionsFk
	 */
	CostGroupPortionsFk?: number | null;

	/*
	 * CurrencyFkList
	 */
	CurrencyFkList?: number[] | null;

	/*
	 * DayWorkRate
	 */
	DayWorkRate?: number;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * Description2
	 */
	Description2?: string | null;

	/*
	 * EfbType221Fk
	 */
	EfbType221Fk?: number | null;

	/*
	 * EfbType222Fk
	 */
	EfbType222Fk?: number | null;

	/*
	 * EstCostTypeFk
	 */
	EstCostTypeFk?: number | null | undefined;

	/*
	 * ExchangeRateMaps
	 */
	//ExchangeRateMaps?: IExchangeRateMap[] | null;

	/*
	 * Extra
	 */
	Extra?: number | null;

	/*
	 * FactorHour
	 */
	FactorHour?: number | undefined;

	/*
	 * FristJobRateFk
	 */
	FristJobRateFk?: number | null;

	/*
	 * HasChildren
	 */
	HasChildren?: boolean | null;

	/*
	 * HourUnit
	 */
	HourUnit?: number;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsBudget
	 */
	IsBudget?: boolean;

	/*
	 * IsChildAllowed
	 */
	IsChildAllowed?: boolean | undefined;

	/*
	 * IsChildAllowed
	 */
	NewIsProjectChildAllowed?: boolean | undefined;

	/*
	 * IsCost
	 */
	IsCost?: boolean;

	/*
	 * IsDefault
	 */
	IsDefault?: boolean | null;

	/*
	 * IsEditable
	 */
	IsEditable?: boolean;

	/*
	 * IsEstimateCostCode
	 */
	IsEstimateCostCode?: boolean;

	/*
	 * IsInformation
	 */
	IsInformation?: boolean | null;

	/*
	 * IsOnlyProjectCostCode
	 */
	IsOnlyProjectCostCode?: boolean;

	/*
	 * IsRate
	 */
	IsRate?: boolean;

	/*
	 * IsRuleMarkupCostCode
	 */
	IsRuleMarkupCostCode?: boolean;

	/*
	 * IsChecked
	 */
	IsChecked?: boolean | null;

	/*
	 * IsSubcontractor
	 */
	IsSubcontractor?: boolean | null;

	/**
	 * Is labour
	 */
	NewIsLabour?: boolean | null;

	/*
	 * JobCode
	 */
	JobCode?: string | null;

	/*
	 * JobCostCodePriceVersionDescription
	 */
	JobCostCodePriceVersionDescription?: string | null;

	/*
	 * JobCostCodePriceVersionFk
	 */
	JobCostCodePriceVersionFk?: number | null;

	/*
	 * JobDescription
	 */
	JobDescription?: string | null;

	/*
	 * JobRateId
	 */
	JobRateId?: number | null;

	/*
	 * JobRateInsertedAt
	 */
	JobRateInsertedAt?: string | null;

	/*
	 * JobRateInsertedBy
	 */
	JobRateInsertedBy?: number | null;

	/*
	 * JobRateUpdatedAt
	 */
	JobRateUpdatedAt?: string | null;

	/*
	 * JobRateUpdatedBy
	 */
	JobRateUpdatedBy?: number | null;

	/*
	 * JobRateVersion
	 */
	JobRateVersion?: number | null;

	/*
	 * LgmJobFk
	 */
	LgmJobFk?: number | null;

	/*
	 * MdcCostCodeFk
	 */
	MdcCostCodeFk?: number | null;

	/*
	 * MdcPriceListDescription
	 */
	MdcPriceListDescription?: string | null;

	/*
	 * MdcPriceListFk
	 */
	MdcPriceListFk?: number | null;

	/*
	 * NewCo2Project
	 */
	NewCo2Project?: number | null;

	/*
	 * NewCo2Source
	 */
	NewCo2Source?: number | null;

	/*
	 * NewCo2SourceFk
	 */
	NewCo2SourceFk?: number | null;

	/*
	 * NewCode
	 */
	NewCode?: string | null;

	/*
	 * NewCurrencyFk
	 */
	NewCurrencyFk?: number | null;

	/*
	 * NewDayWorkRate
	 */
	NewDayWorkRate?: number | null;

	/*
	 * NewDescription
	 */
	NewDescription?: string | null;

	/*
	 * NewFactorCosts
	 */
	NewFactorCosts?: number | null;

	/*
	 * NewFactorHour
	 */
	NewFactorHour?: number | null;

	/*
	 * NewFactorQuantity
	 */
	NewFactorQuantity?: number | null;

	/*
	 * NewRate
	 */
	NewRate?: number | null;

	/*
	 * NewRate
	 */
	NewIsRate?: number | null;

	/*
	 * NewRealFactorCosts
	 */
	NewRealFactorCosts?: number | null;

	/*
	 * NewRealFactorQuantity
	 */
	NewRealFactorQuantity?: number | null;

	/**
	 * NewUomFk
	 */
	NewUomFk?: number | null;

	/*
	 * OriginalId
	 */
	OriginalId?: number | null;

	/*
	 * ParentMdcCostCodeFk
	 */
	ParentMdcCostCodeFk?: number | null;

	/*
	 * PrcStructureFk
	 */
	PrcStructureFk?: number;

	/*
	 * PrjCostCodeChildren
	 */
	PrjCostCodeChildren?: IPrjCostCodesEntity[] | null;

	/*
	 * PrjCostCodeParent
	 */
	PrjCostCodeParent?: IPrjCostCodesEntity | null;

	/*
	 * ProjectCostCodeJobRateEntities
	 */
	ProjectCostCodeJobRateEntities?: IProjectCostCodesJobRateEntity[] | null;

	PriceListForUpdate?: IPrjCostCodesEntity[] | null;

	/*
	 * ProjectCostCodes
	 */
	ProjectCostCodes?: IPrjCostCodesEntity[] | null;

	/*
	 * ProjectFk
	 */
	ProjectFk?: number | null;

	/**
	 * Remark
	 */
	NewRemark?: string | null;

	/**
	 * Cost Code Type
	 */
	NewCostCodeTypeFk?: number | null;

	/*
	 * EstCostTypeFk
	 */
	NewEstCostTypeFk?: number | null;

	/*
	 * SearchPattern
	 */
	SearchPattern?: string | null;

	/*
	 * Status
	 */
	Status?: 'WarningNoJob' | 'Success' | 'Warning' | 'Error' | null;

	/*
	 * Surcharge
	 */
	Surcharge?: number | null;

	/*
	 * UserDefined1
	 */
	UserDefined1?: string | null;

	/*
	 * UserDefined2
	 */
	UserDefined2?: string | null;

	/*
	 * UserDefined3
	 */
	UserDefined3?: string | null;

	/*
	 * UserDefined4
	 */
	UserDefined4?: string | null;

	/*
	 * UserDefined5
	 */
	UserDefined5?: string | null;

	/*
	 * VirtualId
	 */
	VirtualId?: number | null;

	/*
	 * VirtualParentId
	 */
	VirtualParentId?: number | null;

	/*
	 * isMissingParentLevel
	 */
	isMissingParentLevel?: boolean | null;
}
