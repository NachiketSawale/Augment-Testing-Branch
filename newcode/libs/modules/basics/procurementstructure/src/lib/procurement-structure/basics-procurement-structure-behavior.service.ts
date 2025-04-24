/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';
import { BasicsProcurementStructureDataService } from './basics-procurement-structure-data.service';
import { IPrcStructureEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementStructureBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IPrcStructureEntity>, IPrcStructureEntity> {
	private dataService: BasicsProcurementStructureDataService;

	public constructor() {
		this.dataService = inject(BasicsProcurementStructureDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IPrcStructureEntity>): void {

		containerLink.uiAddOns.toolbar.addItems([
			{
				//TODO: framework should provide the default button.
				caption: {key: 'cloud.common.deepCopy'},
				hideItem: false,
				iconClass: 'tlb-icons ico-copy-paste-deep',
				id: 't12',
				sort: 1,
				disabled: () => {
					return !this.dataService.hasSelection();
				},
				fn: () => {
					this.dataService.deepCopy();
				},
				type: ItemType.Item,
			},
			{
				caption: {key: 'cloud.common.toolbarInsertSub'},
				hideItem: false,
				iconClass: 'tlb-icons ico-sub-fld-new',
				id: 'createSubChild',
				fn: () => {
					this.dataService.createChild();
				},
				disabled: () => {
					return !this.dataService.canCreateChild();
				},
				sort: 2,
				type: ItemType.Item,
			},
			{
				caption: {key: 'basics.procurementstructure.upgradeStructure'},
				hideItem: false,
				iconClass: 'tlb-icons ico-promote',
				id: 't11',
				fn: () => {
					this.dataService.upgradeStructure();
					//Refresh grid.
					containerLink.gridData = this.dataService.getList();

					//TODO need to select back the selected data.
				},
				sort: 3,
				type: ItemType.Item,
				disabled: () => {
					return !this.dataService.canUpgradeStructure();
				}
			},
			{
				id: 't12',
				caption: {key: 'basics.procurementstructure.downgradeStructure'},
				type: ItemType.Item,
				sort: 4,
				iconClass: 'tlb-icons ico-demote',
				fn: () => {
					this.dataService.downgradeStructure();
					//Refresh grid.
					containerLink.gridData = this.dataService.getList();

					//TODO need to select back the selected data.
				},
				disabled: () => {
					return !this.dataService.canDowngradeStructure();
				}
			},
			{
				id: 'd99',
				type: ItemType.Divider
			}
		]);


		containerLink.gridConfig = {
			...containerLink.gridConfig,
			treeConfiguration: {
				// TODO: review
				parent: (entity) => {
					if (entity.PrcStructureFk) {
						return containerLink.gridData?.find(item => item.Id === entity.PrcStructureFk) || null;
					}
					return null;
				},
				children: (entity) => {

					return containerLink.gridData?.reduce((result: IPrcStructureEntity[], item) => {
						if (entity.Id === item.PrcStructureFk) {
							result.push(item);
						}
						return result;
					}, []) || [];
				}
			}
		};
	}

}
