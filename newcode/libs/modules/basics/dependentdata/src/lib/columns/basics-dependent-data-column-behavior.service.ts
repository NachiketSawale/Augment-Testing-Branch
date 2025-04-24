/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IDependentDataColumnEntity } from '../model/entities/dependent-data-column-entity.interface';
import { BasicsDependentColumnDataService } from './basics-dependent-data-column-data.service';
import { ItemType } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})
export class BasicsDependentDataColumnBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IDependentDataColumnEntity>, IDependentDataColumnEntity> {
	private readonly dataService = inject(BasicsDependentColumnDataService);

	public onCreate(containerLink: IGridContainerLink<IDependentDataColumnEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId([
			{
				id: 't6',
				caption: {key: 'basics.dependentdata.generate'},
				hideItem: false,
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-generate-fields',
				fn: () => {
					this.dataService.parseView();
				},
				sort: 100
			}
		], EntityContainerCommand.Settings);
	}
}