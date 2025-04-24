/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IEstimateProjectHeader2ClerkEntity } from './entities/estimate-project-header-2clerk-entity.interface';
import { IEstimateCompositeEntity } from '@libs/estimate/shared';

/**
 * Estimate Project Complete Class
 */
export class EstimateProjectComplete extends CompleteIdentification<IEstimateCompositeEntity>{

	public Id: number = 0;

	public EstimateComplete?: IEstimateCompositeEntity;

	public EstimateProjectHeader2ClerksToSave: IEstimateProjectHeader2ClerkEntity [] | null;
	public EstimateProjectHeader2ClerksToDelete:IEstimateProjectHeader2ClerkEntity [] | null;
	
	public constructor(e: IEstimateCompositeEntity | null) {
		super();
		this.EstimateProjectHeader2ClerksToSave = null;
        this.EstimateProjectHeader2ClerksToDelete = null;
	}
}
