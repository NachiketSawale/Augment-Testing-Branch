/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { PrjCostCodesEntity } from './prj-cost-codes-entity.class';
import { IProjectCostCodesJobRateEntity } from './project-cost-codes-job-rate-entity.interface';

export interface IProjectCostCodesJobRateEntityGenerated extends IEntityBase {
	[key: string]: string | number | boolean | PrjCostCodesEntity[] | null | undefined | Date | PrjCostCodesEntity | IProjectCostCodesJobRateEntity | IProjectCostCodesJobRateEntity[];
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
	 * CurrencyFk
	 */
	CurrencyFk?: number | null;

	/*
	 * FactorCosts
	 */
	FactorCosts?: number | null;

	/*
	 * BasFactorCosts
	 */
	BasFactorCosts?: number | null;

	/*
	 * BasRealFactorCosts
	 */
	BasRealFactorCosts?: number | null;

	/*
	 * FactorHour
	 */
	FactorHour?: number | null;

	/*
	 * BasFactorHour
	 */
	BasFactorHour?: number | null;

	/*
	 * FactorQuantity
	 */
	FactorQuantity?: number | null;

	/*
	 * BasFactorQuantity
	 */
	BasFactorQuantity?: number | null;
	/*
	 * BasRealFactorQuantity
	 */
	BasRealFactorQuantity?: number | null;
	/*
	 * BasRate
	 */
	BasRate?: number | null;

	/*
	 * BasRate
	 */
	BasCurrencyfk?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * LgmJobFk
	 */
	LgmJobFk?: number | null;

	/*
	 * ParentPrjCostCodeId
	 */
	ParentPrjCostCodeId?: number | null;

	/*
	 * PrjCostCodesEntity
	 */
	PrjCostCodesEntity?: PrjCostCodesEntity | null;

	/*
	 * ProjectCostCodeFk
	 */
	ProjectCostCodeFk?: number | null;

	/*
	 * Rate
	 */
	Rate?: number | null;

	/*
	 * RealFactorCosts
	 */
	RealFactorCosts?: number | null;

	/*
	 * RealFactorQuantity
	 */
	RealFactorQuantity?: number | null;

	/*
	 * SalesPrice
	 */
	SalesPrice?: number | null;

  /*
	 * NewFactorCosts
	 */
	NewFactorCosts?: number | undefined | null;

  /*
	 * NewRealFactorCosts
	 */
	NewRealFactorCosts?: number | undefined | null;

  /*
	 * NewFactorQuantity
	 */
	NewFactorQuantity?: number | null | undefined;

  /*
	 * NewRealFactorQuantity
	 */
	NewRealFactorQuantity?: number | null | undefined;

  /*
	 * ModifiedJobRate
	 */
	ModifiedJobRate?: IProjectCostCodesJobRateEntity[];
}
