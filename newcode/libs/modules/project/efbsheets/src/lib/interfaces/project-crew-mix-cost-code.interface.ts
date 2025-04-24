
import { LazyInjectionToken } from '@libs/platform/common';
import { IPrjCrewMix2CostCodeEntity } from '../model/prj-crew-mix-2cost-code-entity.interface';


/**
 * Generates UI objects to select access scopes.
 */
export interface IEstimateMainService {
	
	/**
	 * returns selected line item entity
	 */
	getSelectedEntity(): IPrjCrewMix2CostCodeEntity | null;
}

export const PROJECT_EFBSHEETS_CREW_MIX_COST_CODE_SERVICE_TOKEN = new LazyInjectionToken<IEstimateMainService>('project-crew-mix-cost-code-service');
