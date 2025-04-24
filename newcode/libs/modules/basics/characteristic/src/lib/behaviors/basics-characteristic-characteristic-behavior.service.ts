/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { BasicsCharacteristicCharacteristicDataService } from '../services/basics-characteristic-characteristic-data.service';
import { ICharacteristicEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BasicsCharacteristicCharacteristicBehavior implements IEntityContainerBehavior<IGridContainerLink<ICharacteristicEntity>, ICharacteristicEntity> {
	private dataService: BasicsCharacteristicCharacteristicDataService;
	
	public constructor() {
		this.dataService = inject(BasicsCharacteristicCharacteristicDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ICharacteristicEntity>): void {
	}

}
