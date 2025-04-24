/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IProjectCostCodesJobRateEntity } from './project-cost-codes-job-rate-entity.interface';
import { PrjCostCodesEntity } from './prj-cost-codes-entity.class';

/**
 * Interface representing the complete set of project cost codes including their associated job rates.
 */
export interface IProjectCostCodesComplete extends CompleteIdentification<PrjCostCodesEntity> {
	/**
	 * Id
	 */
	Id: number;
	/**
	 * EntitiesCount
	 */
	EntitiesCount: number | null;
	/**
	 * PrjCostCodes
	 */
	PrjCostCodes: PrjCostCodesEntity[] | null;
	/**
	 * EstHeaderId
	 */
	EstHeaderId: number | null;
	/**
	 * MainItemId
	 */
	MainItemId?: number;
	/**
	 * PrjCostCodesJobRateToSave
	 */
	PrjCostCodesJobRateToSave: IProjectCostCodesJobRateEntity[] | null;
	/**
	 * PrjCostCodesJobRateToDelete
	 */
	PrjCostCodesJobRateToDelete: IProjectCostCodesJobRateEntity | null;
}
