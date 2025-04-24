
/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {  Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { IProjectAddressEntity } from '@libs/project/interfaces';
import { ProjectMainAddressDataService } from './project-main-address-data.service';

@Injectable({
	providedIn: 'root'
})
export class ProjectMainAddressValidationService extends BaseValidationService<IProjectAddressEntity> {

	public constructor(private projectMainAddressDataService: ProjectMainAddressDataService) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IProjectAddressEntity> {
		return {
			AddressFk: [this.validateIsMandatory],
			AddressTypeFk: [this.validateIsMandatory],
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectAddressEntity> {
		return this.projectMainAddressDataService;
	}

}