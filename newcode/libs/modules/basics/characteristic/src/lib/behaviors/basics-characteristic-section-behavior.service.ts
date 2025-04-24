/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { BasicsCharacteristicSectionDataService } from '../services/basics-characteristic-section-data.service';
import { ICharacteristicSectionEntity } from '../model/entities/characteristic-section-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicSectionBehavior implements IEntityContainerBehavior<IGridContainerLink<ICharacteristicSectionEntity>, ICharacteristicSectionEntity> {
	private dataService: BasicsCharacteristicSectionDataService;

	public constructor() {
		this.dataService = inject(BasicsCharacteristicSectionDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ICharacteristicSectionEntity>): void {
		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IGridContainerLink<ICharacteristicSectionEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'createChild']);
	}


}
