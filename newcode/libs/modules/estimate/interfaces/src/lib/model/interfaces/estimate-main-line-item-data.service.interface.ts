/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { IEstLineItemEntity } from '../entities';

/**
 * Generates UI objects to select access scopes.
 */
export interface IEstimateMainService {
	
	/**
	 * returns selected line item entity
	 */
	getSelectedEntity(): IEstLineItemEntity | null;
}

export const ESTIMATE_MAIN_SERVICE_TOKEN = new LazyInjectionToken<IEstimateMainService>('estimate-main-line-item-data');
