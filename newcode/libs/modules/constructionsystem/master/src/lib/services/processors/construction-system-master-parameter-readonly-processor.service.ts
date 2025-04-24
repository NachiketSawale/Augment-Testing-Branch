/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ConstructionSystemMasterParameterDataService } from '../construction-system-master-parameter-data.service';
import { ConstructionSystemMasterParameterReadonlyProcessorBaseService } from './construction-system-master-parameter-readonly-processor-base.service';
import { ICosParameterEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterHeaderDataService } from '../construction-system-master-header-data.service';

/**
 * Construction System Master Parameter readonly processor
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameterReadonlyProcessorService extends ConstructionSystemMasterParameterReadonlyProcessorBaseService<ICosParameterEntity> {
	private readonly parentService = inject(ConstructionSystemMasterHeaderDataService);
	/**
	 *The constructor
	 */
	public constructor(protected dataService: ConstructionSystemMasterParameterDataService) {
		super(dataService);
	}

	public override get isBasFormFieldFkReadOnly() {
		const parentEntity = this.parentService.getSelectedEntity();
		if (!parentEntity) {
			return true;
		}
		return !parentEntity.BasFormFk;
	}
}
