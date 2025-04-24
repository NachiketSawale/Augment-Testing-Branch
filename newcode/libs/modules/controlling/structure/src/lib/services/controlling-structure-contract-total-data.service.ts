/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { ControllingCommonPrcContractDataService, ControllingCommonProjectComplete, IControllingCommonPrcContractEntity, IControllingCommonProjectEntity } from '@libs/controlling/common';
import { ProjectMainForCOStructureDataService } from './project-main-for-costructure-data.service';
export const CONTROLLING_STRUCTURE_CONTRACT_TOTAL_DATA_TOKEN = new InjectionToken<ControllingStructureContractTotalDataService>('controllingStructureContractTotalDataToken');

@Injectable({
	providedIn: 'root'
})
export class ControllingStructureContractTotalDataService extends ControllingCommonPrcContractDataService<IControllingCommonPrcContractEntity,IControllingCommonProjectEntity, ControllingCommonProjectComplete>{
	/**
	 * The constructor
	 */
	public constructor() {
		 super(inject(ProjectMainForCOStructureDataService));
	}
}
