/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ConcreteMenuItem, ICustomDialogOptions, InsertPosition, ItemType, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';

import { UsermanagementRightSelectRightsDialogComponent } from '../components/usermanagement-right-select-rights-dialog/usermanagement-right-select-rights-dialog.component';

import { UsermanagementRightDataService } from '../services/usermanagement-right-data.service';

import { IDescriptorStructureEntity } from '../model/entities/descriptor-structure-entity.interface';


/**
 * Usermanagement Right Entity Behavior Service
 */
@Injectable({
	providedIn: 'root',
})
export class UsermanagementRightBehavior implements IEntityContainerBehavior<IGridContainerLink<IDescriptorStructureEntity>, IDescriptorStructureEntity> {
	public dataService = inject(UsermanagementRightDataService);
	public modalDialogService = inject(UiCommonDialogService);
	public onCreate(containerLink: IGridContainerLink<IDescriptorStructureEntity>): void {
		this.initToolBar(containerLink);
	}

	/**
	 * initialize or modify the defaul tool bar item menu
	 * @param {IGridContainerLink<IDescriptorStructureEntity>} containerLink get current Container Details
	 */
	private initToolBar(containerLink: IGridContainerLink<IDescriptorStructureEntity>): void {
		//TODO : This Tool and function action Behavior by default bind from the DataServiceHierarchicalLeaf gird type
		const menuItems: ConcreteMenuItem[] = [
			{
				type: ItemType.Sublist,
				sort: 11,
				list: {
					items: [
						{
							id: 'treeGridAccordion',
							caption: { key: 'cloud.desktop.pinningDesktopDialogHeader' },
							iconClass: ' action tlb-icons ico-tree-level-expand',
							type: ItemType.DropdownBtn,
							list: {
								showImages: true,
								showTitles: true,
								cssClass: 'dropdown-menu-right popup-menu overflow',
								items: [
									{
										caption: { key: 'Undefined' },
										id: 'Undefined',
										type: ItemType.Item,
										iconClass: 'tlb-icons ico-tree-level-undefined',
										//hideItem: true,
									},
									{
										caption: { key: 'Collapse' },
										id: 'collapse',
										type: ItemType.Item,
										iconClass: 'tlb-icons ico-tree-level-collapse',
										fn: () => {
											console.log('click on Collapse');
										},
										//hideItem: true,
									},
									{
										caption: { key: 'Level1' },
										id: '1',
										type: ItemType.Item,
										iconClass: 'tlb-icons ico-tree-level1',
										fn: () => {
											console.log('click on Level1');
										},
										//hideItem: true,
									},
									{
										caption: { key: 'Level2' },
										id: '2',
										type: ItemType.Item,
										iconClass: 'tlb-icons ico-tree-level2',
										fn: () => {
											console.log('click on Level2');
										},
										//hideItem: true,
									},
									{
										caption: { key: 'Level3' },
										id: '3',
										type: ItemType.Item,
										iconClass: 'tlb-icons ico-tree-level3',
										fn: () => {
											console.log('click on Level3');
										},
										//hideItem: true,
									},
									{
										caption: { key: 'Level4' },
										id: '4',
										type: ItemType.Item,
										iconClass: 'tlb-icons ico-tree-level4',
										fn: () => {
											console.log('click on Level4');
										},
										//hideItem: true,
									},
									{
										caption: { key: 'Level5' },
										id: '5',
										type: ItemType.Item,
										iconClass: 'tlb-icons ico-tree-level5',
										fn: () => {
											console.log('click on Level5');
										},
										//hideItem: true,
									},
									{
										caption: { key: 'Level6' },
										id: '6',
										type: ItemType.Item,
										iconClass: 'tlb-icons ico-tree-level6',
										fn: () => {
											console.log('click on Level6');
										},
										//hideItem: true,
									},
									{
										caption: { key: 'Level7' },
										id: '7',
										type: ItemType.Item,
										iconClass: 'tlb-icons ico-tree-level7',
										fn: () => {
											console.log('click on Level7');
										},
										//hideItem: true,
									},
									{
										caption: { key: 'Level8' },
										id: '8',
										type: ItemType.Item,
										iconClass: 'tlb-icons ico-tree-level8',
										fn: () => {
											console.log('click on Level8');
										},
										//hideItem: true,
									},
									{
										caption: { key: 'Level9' },
										id: '9',
										type: ItemType.Item,
										iconClass: 'tlb-icons ico-tree-level9',
										fn: () => {
											console.log('click on Level9');
										},
										//hideItem: true,
									},

									{
										caption: { key: 'Expand' },
										id: 'expand',
										type: ItemType.Item,
										iconClass: 'tlb-icons ico-tree-level-expand',
										fn: () => {
											console.log('click on expand');
										},
										//hideItem: true,
									},
								],
							},
							sort: 119,
						},
						{
							id: 'collapsenode',
							caption: { key: 'cloud.common.toolbarCollapse' },
							iconClass: ' tlb-icons ico-tree-collapse',
							type: ItemType.Item,
							fn: () => {
								//TODO: Implement pending of pin to desktop as a tile.
							},
							sort: 60,
						},
						{
							id: 'expandnode',
							caption: { key: 'cloud.common.toolbarExpand' },
							iconClass: ' tlb-icons ico-tree-expand',
							type: ItemType.Item,
							fn: () => {
								//TODO: Implement pending of pin to desktop as a tile.
							},
							sort: 70,
						},
						{
							id: 'collapseall',
							caption: { key: 'cloud.common.toolbarCollapseAll' },
							iconClass: 'tlb-icons ico-tree-collapse-all',
							type: ItemType.Item,
							fn: () => {
								//TODO: Implement pending of pin to desktop as a tile.
							},
							sort: 80,
						},
						{
							id: 'expandall',
							caption: { key: 'cloud.common.toolbarExpandAll' },
							iconClass: 'tlb-icons ico-tree-expand-all',
							type: ItemType.Item,
							fn: () => {
								//TODO: Implement pending of pin to desktop as a tile.
							},
							sort: 90,
						},
					],
				},
			},
		];
		containerLink.uiAddOns.toolbar.deleteItems('grouping');
		containerLink.uiAddOns.toolbar.addItems(menuItems);

		containerLink.uiAddOns.toolbar.addItemsAtId(
			{
				type: ItemType.Sublist,
				list: {
					items: [
						{
							caption: { key: 'cloud.common.taskBarNewRecord' },
							iconClass: 'tlb-icons ico-rec-new',
							id: EntityContainerCommand.CreateRecord,
							disabled: (ctx) => {
								return !this.dataService.canCreate();
							},
							fn: () => {
								this.openModalSelectRightsDialog();
							},
							sort: 0,
							permission: '#c',
							type: ItemType.Item,
						},
					],
				},
				sort: 0,
			},
			EntityContainerCommand.CreateRecord,
			InsertPosition.Instead,
		);
		console.log(containerLink);
	}

	/**
	 * This Function used for open the Select Right modal dialog
	 */
	public async openModalSelectRightsDialog() {
		const modalOptions: ICustomDialogOptions<{ text: string }, UsermanagementRightSelectRightsDialogComponent> = {
			width: '600px',

			resizeable: true,
			backdrop: false,
			buttons: [{ id: StandardDialogButtonId.Ok }, { id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } }],

			headerText: { key: 'usermanagement.right.dialogTitleDescriptorStructure', text: 'Select Descriptor Structure' },
			id: 'SelectRight',
			value: { text: 'save dialog' },
			bodyComponent: UsermanagementRightSelectRightsDialogComponent,
		};
		const result = await this.modalDialogService.show(modalOptions);
		//TODO: Operations to be done on the result object
		console.log(result);
	}
}
