/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {EventSequenceConfigEntity} from '../model/entities/event-sequence-config-entity.class';
import {ProductionplanningEventconfigurationEventSequenceConfigDataService} from '../services/event-sequence-config-data.service';

@Injectable({
	providedIn: 'root'
})
export class PpsEventSequenceConfigGridBehavior implements IEntityContainerBehavior<IGridContainerLink<EventSequenceConfigEntity>, EventSequenceConfigEntity> {
	private dataService: ProductionplanningEventconfigurationEventSequenceConfigDataService;

	public constructor() {
		this.dataService = inject(ProductionplanningEventconfigurationEventSequenceConfigDataService);
	}

	public onCreate(containerLink: IGridContainerLink<EventSequenceConfigEntity>) {

	}
}