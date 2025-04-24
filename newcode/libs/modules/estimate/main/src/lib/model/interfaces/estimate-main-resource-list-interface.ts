/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstResourceEntity } from '@libs/estimate/interfaces';




/**
 * IEstimateMainResourceList is the interface with resource list property and used in the EstimateMainCommonCalculationService.
 */
export interface IEstimateMainResourceList  {
	resList: IEstResourceEntity[] | null;
}