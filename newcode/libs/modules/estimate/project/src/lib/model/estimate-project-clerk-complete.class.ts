import { CompleteIdentification } from '@libs/platform/common';
import { IEstimateProjectHeader2ClerkEntity } from './entities/estimate-project-header-2clerk-entity.interface';

/**
 * @class EstimateProjectClerkComplete
 * @brief A class that implements CompleteIdentification for IEstimateProjectHeader2ClerkEntity.
 */
export class EstimateProjectClerkComplete implements CompleteIdentification<IEstimateProjectHeader2ClerkEntity> {
	public Id: number = 0;

	public EstimateProjectHeader2Clerks: IEstimateProjectHeader2ClerkEntity[] | null = [];
}
