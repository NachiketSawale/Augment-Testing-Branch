/*
 * Copyright(c) RIB Software GmbH
 */
import { FilterMethod } from '../../enums/cos-filter-method.enum';
/**
 * Filter Structures interface
 */
export interface IFilterStructures {
	Method: FilterMethod;
	EstLicCostGrp1?: number[] | null;
	EstLicCostGrp2?: number[] | null;
	EstLicCostGrp3?: number[] | null;
	EstLicCostGrp4?: number[] | null;
	EstLicCostGrp5?: number[] | null;
	EstPrjCostGrp1?: number[] | null;
	EstPrjCostGrp2?: number[] | null;
	EstPrjCostGrp3?: number[] | null;
	EstPrjCostGrp4?: number[] | null;
	EstPrjCostGrp5?: number[] | null;
	EstPrjLocation?: number[] | null;
	EstCtu?: number[] | null;
	EstBoq?: number[] | null;
}
