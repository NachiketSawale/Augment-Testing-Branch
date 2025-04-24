/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';
import { Router } from '@angular/router';
import { IControllingCommonProjectEntity } from '@libs/controlling/common';

@Injectable({
	providedIn: 'root'
})
export class ProjectMainForCOStructureBehavior implements IEntityContainerBehavior<IGridContainerLink<IControllingCommonProjectEntity>, IControllingCommonProjectEntity> {
	private router = inject(Router);

	public onCreate(containerLink: IGridContainerLink<IControllingCommonProjectEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
		containerLink.uiAddOns.toolbar.addItems(
			[{
				type: ItemType.Item,
				caption: {key: 'cloud.common.Navigator.goTo' + 'Project main'},
				iconClass: 'tlb-icons ico-goto',
				id: 't21',
				fn: () => {
					// TODO: framework gap
					this.router.navigateByUrl('project/main/');
				},
				sort: 0,
				permission: '#c',
			},
				{
					caption: {key: 'cloud.common.Navigator.goTo' + 'iTWO 5D Controlling'},
					iconClass: 'tlb-icons ico-goto2',
					id: 't22',
					fn: () => {
						// TODO: framework gap
						// this.router.navigateByUrl(`${this.configService.webApiBaseUrl}/basics/common/externalservice/execute/`);
					},
					sort: 0,
					permission: '#c',
					type: ItemType.Item,
				},],
			EntityContainerCommand.CreateRecord,
		);
	}
}