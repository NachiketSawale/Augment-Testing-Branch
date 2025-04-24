/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { BasicsCharacteristicDiscreteValueDataService } from '../services/basics-characteristic-discrete-value-data.service';
import { ICharacteristicValueEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BasicsCharacteristicDiscreteValueBehavior implements IEntityContainerBehavior<IGridContainerLink<ICharacteristicValueEntity>, ICharacteristicValueEntity> {
	private dataService: BasicsCharacteristicDiscreteValueDataService;

	public constructor() {
		this.dataService = inject(BasicsCharacteristicDiscreteValueDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ICharacteristicValueEntity>): void {
	}

}
