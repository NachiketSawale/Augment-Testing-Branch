/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPrcItemAssignmentEntity } from '@libs/procurement/interfaces';
import { ProcurementPackageItemAssignmentDataService } from '../services/item-assignment-data.service';
import { InsertPosition, ItemType } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageItemAssignmentBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IPrcItemAssignmentEntity>, IPrcItemAssignmentEntity> {
	private readonly dataService = inject(ProcurementPackageItemAssignmentDataService);

	public onCreate(containerLink: IGridContainerLink<IPrcItemAssignmentEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId(
			[
				{
					id: 'calculateBudgets',
					caption: 'Calculate Budgets',
					type: ItemType.Item,
					iconClass: 'control-icons ico-recalculate',
					disabled: () => {
						const item = this.dataService.packageDataService.getSelectedEntity();
						if (!item) {
							return true;
						}
						return this.dataService.packageDataService.getHeaderContext().readonly;
					},
					fn: async () => {
						await this.dataService.relCalculationItemBudget();
					},
				},
			],
			EntityContainerCommand.Settings,
			InsertPosition.Before,
		);
	}
}