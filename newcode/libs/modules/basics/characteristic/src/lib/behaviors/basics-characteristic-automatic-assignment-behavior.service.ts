/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { IBasicsCharacteristicAutomaticAssignmentEntity } from '../model/entities/basics-characteristic-automatic-assignment-entity.interface';
import { BasicsCharacteristicAutomaticAssignmentDataService } from '../services/basics-characteristic-automatic-assignment-data.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicAutomaticAssignmentBehavior implements IEntityContainerBehavior<IGridContainerLink<IBasicsCharacteristicAutomaticAssignmentEntity>, IBasicsCharacteristicAutomaticAssignmentEntity> {
	private dataService: BasicsCharacteristicAutomaticAssignmentDataService;
	
	public constructor() {
		this.dataService = inject(BasicsCharacteristicAutomaticAssignmentDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IBasicsCharacteristicAutomaticAssignmentEntity>): void {
		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IGridContainerLink<IBasicsCharacteristicAutomaticAssignmentEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'createChild']);
	}

}
