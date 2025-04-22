/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {BusinesspartnerPrcStructureDataService} from '../services/businesspartner-prcstructure-data.service';
import {InsertPosition, ItemType} from '@libs/ui/common';
import {CollectionHelper} from '@libs/platform/common';
import { IBusinessPartner2PrcStructureEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerMainPrcStructureGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IBusinessPartner2PrcStructureEntity>, IBusinessPartner2PrcStructureEntity> {
	private dataService: BusinesspartnerPrcStructureDataService;

	public constructor() {
		this.dataService = inject(BusinesspartnerPrcStructureDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IBusinessPartner2PrcStructureEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId(
			{
				id: EntityContainerCommand.CreateRecord,
				type: ItemType.Item,
				caption: {key: 'cloud.common.taskBarNewRecord'},
				iconClass: 'tlb-icons ico-rec-new',
				sort: 0,
				permission: '#c',
				disabled: () => {
					return !this.dataService.canCreate();
				},
				fn: () => {
					this.dataService.createItem();
				},
			},
			EntityContainerCommand.CreateRecord,
			InsertPosition.Instead
		);

		containerLink.gridConfig = {
			...containerLink.gridConfig,
			treeConfiguration: {
				parent: entity => {
					if (entity.ParentPrcStructureFk) {
						return containerLink.gridConfig?.items?.find(item => item.PrcStructureFk === entity.ParentPrcStructureFk) || null;
					}
					return null;
				},
				children: entity => {
					const list = CollectionHelper.Flatten(containerLink.gridConfig?.items || [], this.dataService.childrenOf);
					return list.reduce((result: IBusinessPartner2PrcStructureEntity[], item) => {
						if (entity.PrcStructureFk === item.ParentPrcStructureFk) {
							result.push(item);
						}
						return result;
					}, []) || [];
				}
			}
		};
	}
}