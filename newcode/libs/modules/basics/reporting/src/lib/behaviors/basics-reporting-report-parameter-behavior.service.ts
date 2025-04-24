/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IReportParameterEntity } from '../model/entities/report-parameter-entity.interface';
import { ItemType } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class BasicsReportingReportParameterBehavior implements IEntityContainerBehavior<IGridContainerLink<IReportParameterEntity>, IReportParameterEntity> {

	public onCreate(containerLink: IGridContainerLink<IReportParameterEntity>) {
		containerLink.uiAddOns.toolbar.addItems(
			[
				{
					id: 'defaultx01',
					caption: { key: 'basics.common.button.refresh' },
					sort: 200,
					hideItem: false,
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-refresh',
					fn: () => {
						//TODO: need to migrate callParameter
					},
				}
			]
		);
	}
}