/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';
import { IPrjCostCodesEntity } from './prj-cost-codes-entity.interface';
import { IProjectCostCodesJobRateEntity } from './project-cost-codes-job-rate-entity.interface';
import { ICostCodeEntity } from '@libs/basics/interfaces';

export class PrjCostCodesEntity implements IPrjCostCodesEntity {
	[key: string]: string | number | boolean | Date | PrjCostCodesEntity[] | IProjectCostCodesJobEntity |
	 IDescriptionInfo | null | undefined | ICostCodeEntity | ICostCodeEntity[] | IProjectCostCodesJobRateEntity;

	public Id!: number;

	public ProjectFk!: number;

	public BasCostCode?: ICostCodeEntity | null;
	
	public Code!: string;

	public Description?: string | null;
	
	public ProjectCostCodes?: PrjCostCodesEntity[] | undefined | null;

	public CostCodeParentFk?: number | null;

	public FactorCosts?: number | null | undefined;

	public FactorHour: number | undefined;

	public FactorQuantity?: number | undefined | null;

	public RealFactorQuantity?: number | undefined | null;

	public RealFactorCosts?: number | undefined | null;

	public Rate: number | null | undefined;

	public DayWorkRate?: number | undefined;

	public CurrencyFk: number | null | undefined;

	public IsChildAllowed: boolean | undefined;

	public NewFactorCosts?: number | undefined | null;

	public NewRealFactorCosts?: number | undefined | null;

	public NewFactorQuantity?: number | null | undefined;

	public NewRealFactorQuantity: number | null | undefined;

	public Co2Project?: number | null;

	public Co2Source?: number | null;
	
	public Co2SourceFk?: number | null;

	public CostGroupPortionsFk: number | undefined;

	public AbcClassificationFk: number | undefined;

	public PrcStructureFk: number | undefined;

	public ContrCostCodeFk: number | undefined;

	public LgmJobFk?: number | null;

	public PriceListForUpdate?:PrjCostCodesEntity[]|null;
	
	public PriceListFk?: number | null;

	public PriceVersionFk?: number | null;

	public ValidFrom?: Date | null;

	public ValidTo?: Date | null;

	public Weighting?:number | null;

	public Job?:IProjectCostCodesJobEntity | null;

}
export interface IProjectCostCodesJobEntity{
	JobCostCodePriceVersionFk:number;
	ProjectCostCodes:PrjCostCodesEntity[];
}
