/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';


import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';


import {  ItemType, UiCommonDialogService } from '@libs/ui/common';
import { IActivityEntity } from '@libs/scheduling/interfaces';
import { SchedulingMainDataService } from '../services/scheduling-main-data.service';
import { PlatformPermissionService } from '@libs/platform/common';
import { SchedulingMainRelationshipAllService } from '../services/scheduling-main-relationship-all.service';

/**
 * Scheduling Main Behavior Service
 */
@Injectable({
	providedIn: 'root',
})
export class SchedulingMainBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IActivityEntity>, IActivityEntity> {
	public dataService = inject(SchedulingMainDataService);
	public relationshipDataService = inject(SchedulingMainRelationshipAllService);
	public modalDialogService = inject(UiCommonDialogService);
	private readonly permissonservice = inject(PlatformPermissionService);
	public onCreate(containerLink: IGridContainerLink<IActivityEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems(EntityContainerCommand.Settings);
		this.updateToolMenuItem(containerLink);
	}
	public updateToolMenuItem(containerLink: IGridContainerLink<IActivityEntity>) {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: {key: 'cloud.common.toolbarNewByContext'},
				iconClass: 'tlb-icons ico-new',
				id: 't1',
				type: ItemType.Item,
				disabled:()=> {
					// Permission check
					if (!this.permissonservice.hasWrite('0fcbaf8c89ac4493b58695cfa9f104e2')) {
						return true;
					}
					return !this.dataService.canCreate();
				},
				fn: () => {
					this.dataService.appendActivity();
				},
			},
			{

				caption: {key: 'scheduling.main.changeActivityType'},
				iconClass: 'tlb-icons ico-task-to-hammock',
				id: 't1',
				type: ItemType.Item,
				disabled:()=> {
					// Permission check
					const selection = this.dataService.getSelection()[0];

					if (selection?.IsReadOnly === true) {
						return true;
					}
					if (!this.permissonservice.hasWrite('0fcbaf8c89ac4493b58695cfa9f104e2')) {
						return true;
					}
					return this.dataService.toolbarEnabled();
				},
				fn: () => {

					this.dataService.changeActivityType();
				},
			},
			{
				caption: {key: 'scheduling.main.activityChain'},
				iconClass: 'control-icons ico-link-activities-relationship',
				id: 'ac',
				type: ItemType.Item,
				disabled:()=> {
					// Permission check
					if (!this.permissonservice.hasWrite('0fcbaf8c89ac4493b58695cfa9f104e2')) {
						return true;
					}
					return this.dataService.toolbarEnabled();
				},
				fn: () => {
					this.relationshipDataService.addRelationships();
				},
			},
			{
				caption: {key: 'scheduling.main.deepCopy'},
				iconClass: 'tlb-icons ico-copy-paste-deep',
				id: 't3',
				type: ItemType.Item,
				disabled:()=> {
					// Permission check
					const selection = this.dataService.getSelection()[0];
					if (this.dataService.getSelection().length > 0 && !selection && !this.permissonservice.hasWrite('0fcbaf8c89ac4493b58695cfa9f104e2')) {
						return true;
					}
					return this.dataService.toolbarEnabled();
				},
				fn: () => {
					this.dataService.createDeepCopy();
				},
			},
			{
				id: 't201',
				caption: { key: 'cloud.common.gridSettings' },
				sort: 200,
				type: ItemType.DropdownBtn,

				cssClass: 'tlb-icons ico-settings',
				list: {
					showImages: false,
					showTitles: true,
					cssClass: 'dropdown-menu-right',
					items: [
						{
							id: 't111',
							sort: 112,
							caption: { key: 'cloud.common.gridlayout' },
							permission: '91c3b3b31b5d4ead9c4f7236cb4f2bc0',

							type: ItemType.Item,
						},
						{
							id: 't155',
							sort: 200,
							caption: { key: 'cloud.common.showStatusbar' },
							type: ItemType.Check,
						},
						{
							id: 't255',
							sort: 200,
							caption: { key: 'cloud.common.markReadonlyCells' },
							type: ItemType.Check,
						},
						{
							id: 't500',
							sort: 200,
							caption: { key: 'scheduling.main.activitySettings' },
							type: ItemType.Item,
							fn: () => {
								this.dataService.settingsDialog();
							},
						},
						{
							id: 't501',
							sort: 200,
							caption: { key: 'scheduling.main.simulatedGantt.configTitle' },
							type: ItemType.Item,
							fn: () => {
								this.dataService.simulationGanttSettingsDialog();
							},
						},
					],
				},
				iconClass: 'tlb-icons ico-settings',

				hideItem: false,
			},
		]);
	}
}
