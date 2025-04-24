/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { EstimateAssembliesWizardServiceBaseService } from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/assemblies';
import { IProjectEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root',
})
/**
 * EstimateAssembliesWizardService
 */
export class EstimateAssembliesWizardService extends EstimateAssembliesWizardServiceBaseService<IEstLineItemEntity, IProjectEntity> {
	public constructor() {
		super({
			isPrjAssembly: true,
		});
	}
}
