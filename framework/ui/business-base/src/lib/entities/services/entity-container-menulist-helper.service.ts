/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	ConcreteMenuItem,
	IDropdownBtnMenuItem, ILayoutConfiguration,
	IParentMenuItem,
	isEntityKey,
	ItemType,
	MenuListContent,
	NavigationTarget,
	UiModuleNavigationHelperService,
} from '@libs/ui/common';
import { IDataServiceContainer } from '../model/data-service-utils.model';
import { EntityContainerCommand } from '../model/menulist/entity-container-command.enum';
import { IGridContainerLink } from '../model/grid-container-link.interface';
import { IFormContainerLink } from '../model/form-container-link.interface';
import { EntityKeyNavigationMapping } from '../model/entity-key-module-mapping.model';
import { BaseValidationService, IEntityDataCreationContext, IEntitySchema, SimpleIdIdentificationDataConverter } from '@libs/platform/data-access';
import { IIdentificationData, PlatformModuleManagerService } from '@libs/platform/common';
import { ITreeContainerLink } from '../model/tree-container-link.interface';


import { ModuleNavigationMapping } from '../model/module-navigation-mapping.class';
import { EntityDynamicCreateDialogService } from './entity-dynamic-create-dialog.service';
import { TreeLevelContainer } from '../model/tree-level-container.class';
import { IEntityContainerLink } from '../model/entity-container-link.model';
import { UiBusinessBaseEntityContainerGridConfigDialogHelperService } from './entity-container-grid-config-dialog-helper.service';

/**
 * Provides supporting functionality for the toolbar/menulist in standard entity containers.
 */
@Injectable({
	providedIn: 'root'
})
export class UiBusinessBaseEntityContainerMenulistHelperService {

	private uiModuleNavigationHelperService: UiModuleNavigationHelperService = inject(UiModuleNavigationHelperService);
	private readonly moduleMangerService = inject(PlatformModuleManagerService);
	private readonly gridConfigDialogHelperSvc = inject(UiBusinessBaseEntityContainerGridConfigDialogHelperService);

	/**
	 * tree-level container class instance
	 */
	public readonly treeLevelContainer = new TreeLevelContainer();

	private createCreationDeletionMenuItems<T extends object>(dsCnt: IDataServiceContainer<T>, schema?: IEntitySchema<T>, validationService?: BaseValidationService<T>, layout?: ILayoutConfiguration<T>): ConcreteMenuItem[] {
		const creationItems: ConcreteMenuItem[] = [];
		const deletionItems: ConcreteMenuItem[] = [];
		const createDialogService = inject(EntityDynamicCreateDialogService<T>);

		if (dsCnt.entityCreate?.supportsCreate()) {

			creationItems.push({
				caption: { key: 'cloud.common.taskBarNewRecord' },
				iconClass: 'tlb-icons ico-rec-new',
				id: EntityContainerCommand.CreateRecord,
				disabled: ctx => {
					return !dsCnt.entityCreate || !dsCnt.entityCreate.canCreate();
				},
				fn: () => {
					if (dsCnt.entityDataConfiguration?.supportsConfiguredCreate()) {
						if (schema && validationService && layout) {
							const context: IEntityDataCreationContext<T> = {
								schema,
								validationService,
								layout,
							};

							dsCnt.entityDataConfiguration.createByConfiguration(context, createDialogService);
						}
					} else {
						dsCnt.entityCreate?.create();
					}
				},
				sort: 0,
				permission: '#c',
				type: ItemType.Item,
			});

			if (dsCnt.entityCreateChild) {
				creationItems.push({
					caption: { key: 'cloud.common.toolbarInsertSub' },
					iconClass: 'tlb-icons ico-sub-fld-new',
					id: EntityContainerCommand.CreateSubRecord,
					disabled: () => {
						return !dsCnt.entityCreateChild || !dsCnt.entityCreateChild.canCreateChild();
					},
					fn: () => {
						if (dsCnt.entityDataConfiguration?.supportsConfiguredCreate()) {
							if (schema && validationService && layout) {
								const context: IEntityDataCreationContext<T> = {
									schema,
									validationService,
									layout,
								};

								dsCnt.entityDataConfiguration.createByConfiguration(context, createDialogService);
							}
						} else {
							dsCnt.entityCreateChild?.createChild();
						}
					},
					sort: 10,
					permission: '#c',
					type: ItemType.Item,
				});
			}
		}

		if (dsCnt.entityDelete?.supportsDelete()) {
			deletionItems.push(
				{
					caption: { key: 'cloud.common.taskBarDeleteRecord' },
					iconClass: 'tlb-icons ico-rec-delete',
					id: EntityContainerCommand.DeleteRecord,
					disabled: () => {
						if (!dsCnt.entityDelete || !dsCnt.entityDelete.canDelete()) {
							return true;
						}
						return !dsCnt.entitySelection.hasSelection();
					},
					fn: () => {
						dsCnt.entityDelete?.delete(dsCnt.entitySelection.getSelection());
					},
					permission: '#d',
					type: ItemType.Item,
				}
			);
		}

		return [
			{
				type: ItemType.Sublist,
				id: EntityContainerCommand.CreationGroup,
				list: {
					items: creationItems
				},
				sort: 0
			},
			{
				type: ItemType.Sublist,
				id: EntityContainerCommand.DeletionGroup,
				list: {
					items: deletionItems
				},
				sort: 10
			}
		];
	}

	// The type parameter will be used as soon as the (typed!) items are supplied for printing.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private createPrintMenuItem<T extends object>(containerLink:IEntityContainerLink<T>): ConcreteMenuItem {

		return {
			id: EntityContainerCommand.Print,
			type: ItemType.Item,
			caption: { key: 'cloud.common.print' },
			iconClass: 'tlb-icons ico-print-preview',
			fn: () => {
				containerLink.print();
			}
		};
	}

	// The type parameter will be used as soon as the (typed!) items are supplied for searching.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private createGridSearchMenuItems<T extends object>(containerLink: IGridContainerLink<T>): ConcreteMenuItem[] {
		return [{
			caption: { key: 'cloud.common.taskBarSearch' },
			iconClass: 'tlb-icons ico-search-all',
			id: EntityContainerCommand.SearchOptions,
			fn: () => {
				containerLink.searchPanel();
			},
			sort: 150,
			type: ItemType.Check,
			value: false,
		},
		{
			caption: {key: 'cloud.common.taskBarColumnFilter'},
			iconClass: 'tlb-icons ico-search-column',
			id: EntityContainerCommand.ColumnFilter,
			sort: 160,
			fn: () => {
				containerLink.columnSearch();
			},
			type: ItemType.Check,
			value: false,
		}];
	}

	// The type parameter will be used as soon as the (typed!) items are supplied for searching.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private createExportClipboardMenu<T extends object>(): ConcreteMenuItem[] {
		return [{
			caption: { key: 'cloud.common.exportClipboard' },
			groupId: 'exportClipboard',
			iconClass: 'tlb-icons ico-clipboard',
			id: EntityContainerCommand.Clipboard,
			sort: 200,
			type: ItemType.DropdownBtn,
			list: {
				cssClass: 'dropdown-menu-right',
				showImages: false,
				showTitles: true,
				items: [
					{
						caption: { key: 'cloud.common.exportArea' },
						id: EntityContainerCommand.CopyCellArea,
						sort: 100,
						type: ItemType.Item,
						fn: () => {
							throw new Error('This method is not implemented');
						},
					},
					{
						caption: { key: 'cloud.common.exportCopy' },
						id: EntityContainerCommand.Copy,
						sort: 200,
						type: ItemType.Item,
						fn: () => {
							throw new Error('This method is not implemented');
						},
					},
					{
						caption: { key: 'cloud.common.exportPaste' },
						id: EntityContainerCommand.Paste,
						sort: 300,
						type: ItemType.Item,
						fn: () => {
							throw new Error('This method is not implemented');
						},
					},
					{
						id: EntityContainerCommand.ExportOptions,
						type: ItemType.Sublist,
						sort: 400,
						list: {
							items: [
								{
									caption: { key: 'cloud.common.exportWithHeader' },
									id: EntityContainerCommand.CopyWithHeader,
									sort: 100,
									type: ItemType.Item,
									fn: () => {
										throw new Error('This method is not implemented');
									},
								}
							]
						}
					}
				]
			}
		}];
	}

	private createContainerOptionsMenu(subItems: ConcreteMenuItem[]): IDropdownBtnMenuItem {
		return {
			id: EntityContainerCommand.Settings,
			type: ItemType.DropdownBtn,
			caption: { key: 'cloud.common.gridLayout' },
			iconClass: 'tlb-icons ico-settings',
			list: {
				cssClass: 'popup-menu',
				showTitles: true,
				showImages: false,
				items: [...subItems]
			}
		};
	}

	private createGridContainerOptionsMenu<T extends object>(containerLink: IGridContainerLink<T>): IDropdownBtnMenuItem {
		return this.createContainerOptionsMenu([
			{
				id: EntityContainerCommand.GridLayout,
				type: ItemType.Item,
				caption: { key: 'cloud.common.gridlayout' },
				fn: () => {
					this.gridConfigDialogHelperSvc.openConfigDialog<T>(containerLink);
				},
				sort: 0
			},
			{
				id: EntityContainerCommand.ShowStatusBar,
				type: ItemType.Check,
				caption: { key: 'cloud.common.showStatusbar' },
				fn: (info) => {
					containerLink.uiAddOns.statusBar.isVisible = info.isChecked;
				},
				sort: 100
			},
			{
				id: EntityContainerCommand.MarkReadOnly,
				type: ItemType.Check,
				caption: { key: 'cloud.common.markReadonlyCells' },
				fn: () => {
					containerLink.gridConfig.markReadonlyCells = !containerLink.gridConfig.markReadonlyCells;
				},
				sort: 110
			}
		]);
	}

	private createNavDropdown<T extends object>(containerLink: IGridContainerLink<T>, schema?: IEntitySchema<T>): IParentMenuItem | null {
		if (schema) {
			const navDropdown = this.createNavigationMenuItems(containerLink, schema);
			if (navDropdown.list.items && navDropdown.list.items?.length > 0) {
				return navDropdown;
			}
		}

		return null;
	}

	/**
	 * Generates the standard menu items for an entity-based list container.
	 *
	 * @typeParam T The entity object type.
	 *
	 * @param containerLink A reference to the target container.
	 *
	 * @param schema A reference to the schema of the related container.
	 *
	 * @returns The generated menu items.
	 */
	public createListMenuItems<T extends object>(containerLink: IGridContainerLink<T>, schema?: IEntitySchema<T>, validationService?: BaseValidationService<T>, layout?: ILayoutConfiguration<T>): ConcreteMenuItem[] {
		const dsCnt: IDataServiceContainer<T> = containerLink;

		const listMenu: ConcreteMenuItem[] = [
			...this.createCreationDeletionMenuItems(dsCnt, schema, validationService, layout),
			{
				caption: { key: 'cloud.common.taskBarGrouping' },
				iconClass: 'tlb-icons ico-group-columns',
				id: EntityContainerCommand.Grouping,
				fn: () => {
					containerLink.groupPanel();
				},
				sort: 100,
				type: ItemType.Check,
			},
			{
				...this.createPrintMenuItem<T>(containerLink),
				sort: 120
			},
			...this.createGridSearchMenuItems<T>(containerLink),
			...this.createExportClipboardMenu<T>(),
			{
				...this.createGridContainerOptionsMenu(containerLink),
				sort: 500
			}
		];

		const navItem = this.createNavDropdown(containerLink, schema);
		if (navItem) {
			listMenu.push({
				...navItem,
				sort: 600,
			} as ConcreteMenuItem);
		}

		return listMenu;
	}


	/**
	 * Generates the standard menu items for an entity-based tree container.
	 *
	 * @typeParam T The entity object type.
	 *
	 * @param containerLink A reference to the target container.
	 *
	 * @param schema A reference to the schema of the related container.
	 *
	 * @returns The generated menu items.
	 */
	public createTreeMenuItems<T extends object>(containerLink: ITreeContainerLink<T>, schema?: IEntitySchema<T>, validationService?: BaseValidationService<T>, layout?: ILayoutConfiguration<T>): ConcreteMenuItem[] {
		const dsCnt: IDataServiceContainer<T> = containerLink;
		const treeMenu: ConcreteMenuItem[] = [
			...this.createCreationDeletionMenuItems(dsCnt, schema, validationService, layout),
			{
				type: ItemType.Sublist,
				id: EntityContainerCommand.ExpandCollapseGroup,
				list: {
					// TODO: levels dropdown DEV-14715
					items: [
						this.addToolbarItemsForTreeLevelGrid(containerLink),
						{
							caption: { key: 'cloud.common.toolbarCollapse' },
							iconClass: 'tlb-icons ico-tree-collapse',
							id: EntityContainerCommand.Collapse,
							fn: () => {
								containerLink.entitySelection.getSelection().forEach((item) => {
									containerLink.collapse(item);
								});
							},
							sort: 50,
							type: ItemType.Item,
						},
						{
							caption: { key: 'cloud.common.toolbarExpand' },
							iconClass: 'tlb-icons ico-tree-expand',
							id: EntityContainerCommand.Expand,
							fn: () => {
								containerLink.entitySelection.getSelection().forEach((item) => {
									containerLink.expand(item);
								});
							},
							sort: 60,
							type: ItemType.Item,
						},
						{
							caption: { key: 'cloud.common.toolbarCollapseAll' },
							iconClass: ' tlb-icons ico-tree-collapse-all',
							id: EntityContainerCommand.CollapseAll,
							fn: () => {
								containerLink.collapseAll();
							},
							sort: 70,
							type: ItemType.Item,
						},
						{
							caption: {key: 'cloud.common.toolbarExpandAll'},
						iconClass: 'tlb-icons ico-tree-expand-all',
						id: EntityContainerCommand.ExpandAll,
						fn: () => {
							containerLink.expandAll();
						},
						sort: 80,
						type: ItemType.Item,
					}]
				},
				sort: 80
			},
			{
				...this.createPrintMenuItem<T>(containerLink),
				sort: 120
			},
			...this.createGridSearchMenuItems<T>(containerLink),
			...this.createExportClipboardMenu<T>(),
			{
				type: ItemType.Sublist,
				id: EntityContainerCommand.ChangeHierarchyLevelGroup,
				list: {
					items: [{
						caption: { key: 'ui.business-base.demoteItem' },
						iconClass: 'tlb-icons ico-demote',
						id: EntityContainerCommand.Demote,
						fn: () => {
							// TODO: demote items (and check disabled) when DEV-14703 is ready
						},
						// disabled: () => {
						// 	return this.disableButton;
						// },
						sort: 10,
						type: ItemType.Item,
					},
						{
							caption: {key: 'ui.business-base.promoteItem'},
						iconClass: ' tlb-icons ico-promote',
						id: EntityContainerCommand.Promote,
						fn: () => {
							// TODO: promote items (and check disabled) when DEV-14703 is ready
						},
						// disabled: () => {
						// 	return this.disableButton;
						// },
						sort: 20,
						type: ItemType.Item,
					}]
				},
				sort: 200
			},
			{
				...this.createGridContainerOptionsMenu(containerLink),
				sort: 500
			}
		];

		const navItem = this.createNavDropdown(containerLink, schema);
		if (navItem) {
			treeMenu.push({
				...navItem,
				sort: 600
			} as  ConcreteMenuItem);
		}

		return treeMenu;
	}

	/**
	 * Generates the standard menu items for an entity-based details container.
	 *
	 * @typeParam T The entity object type.
	 *
	 * @param containerLink A reference to the target container.
	 *
	 * @returns The generated menu items.
	 */
	public createDetailsMenuItems<T extends object>(containerLink: IFormContainerLink<T>, schema?: IEntitySchema<T>, validationService?: BaseValidationService<T>, layout?: ILayoutConfiguration<T>): ConcreteMenuItem[] {
		const dsCnt: IDataServiceContainer<T> = containerLink;

		return [
			...this.createCreationDeletionMenuItems(dsCnt, schema, validationService, layout),
			{
				id: EntityContainerCommand.ExpandCollapseGroup,
				type: ItemType.Sublist,
				list: {
					items: [
						{
							id: EntityContainerCommand.CollapseAll,
							caption: { key: 'platform.formContainer.collapseAll' },
							type: ItemType.Item,
							iconClass: 'tlb-icons ico-tree-collapse-all',
							fn: () => {
								containerLink.collapseAll();
							}
						},
						{
							id: EntityContainerCommand.ExpandAll,
							caption: { key: 'platform.formContainer.expandAll' },
							type: ItemType.Item,
							iconClass: 'tlb-icons ico-tree-expand-all',
							fn: () => {
								containerLink.expandAll();
							}
						}
					]
				},
				sort: 100
			},
			{
				id: EntityContainerCommand.RecordNavigationGroup,
				type: ItemType.Sublist,
				list: {
					items: [...this.createRecordNavigationMenuItem(containerLink)],
				},
				sort: 110,
			},
			{
				...this.createPrintMenuItem<T>( containerLink),
				sort: 120
			},
			{
				...this.createContainerOptionsMenu([
					{
						id: EntityContainerCommand.FormConfiguration,
						type: ItemType.Item,
						caption: { key: 'platform.formContainer.settings' },
						fn: () => {
							throw new Error('This method is not yet implemented.');
						}
					}
				]),
				sort: 500
			}
		];
	}

	/**
	 * Generates the standard menu items for an entity-based navigation.
	 *
	 * @typeParam T The entity object type.
	 *
	 * @param containerLink A reference to the target container.
	 *
	 * @param schema A reference to the schema used for  container.
	 *
	 * @returns The generated navigation menu items.
	 */
	public createNavigationMenuItems<T extends object>(containerLink: IDataServiceContainer<T>, schema: IEntitySchema<T>): IParentMenuItem {
		const dsCnt: IDataServiceContainer<T> = containerLink;
		const targets: NavigationTarget[] = [];
		if (schema.mainModule && this.moduleMangerService.activeModule?.internalModuleName?.toLocaleLowerCase() !== schema.mainModule.toLocaleLowerCase()) {
			const navigatableModuleName = new ModuleNavigationMapping().getNavigatableModuleName(schema.mainModule);
			targets.push({ internalModuleName: navigatableModuleName, translationKey: { key: 'ui.business-base.navigator.navigateToMainModule' }, originFkName: 'Id' });
		}
		for (const schemaKey in schema.properties) {
			if (isEntityKey(schemaKey)) {
				const found = new EntityKeyNavigationMapping().getNavigationTarget(schemaKey);
				if (found) {
					if (Array.isArray(found)) {
						found.forEach(e => e.originFkName = schemaKey);
						targets.push(...found);
					} else {
						found.originFkName = schemaKey;
						targets.push(found);
					}
				}
			}
		}

		const navButtons: ConcreteMenuItem[] = [];
		targets.forEach((target) => {
			const converter = new SimpleIdIdentificationDataConverter();
			if (dsCnt) {
				const identFunc = () => {
					const entityIdentificationsList: IIdentificationData[] = [];
					dsCnt.entitySelection.getSelection().forEach(selection => {
						const ident = converter.convertWithKey(selection, target.originFkName ?? 'Id');
						if (ident) {
							entityIdentificationsList.push(ident);
						}
					});
					return entityIdentificationsList;
				};
				navButtons.push(this.uiModuleNavigationHelperService.createNavigationItem({
					entityIdentifications: identFunc,
					displayText: target.translationKey,
					internalModuleName: target.internalModuleName,
					getPinningContext: () => {
						return dsCnt.entityNavigation?.preparePinningContext(dsCnt.entitySelection);
					}
				}));
			}

		});

		return {
			id: 'navigationGroup',
			groupId: 'navigationGroupList',
			layoutChangeable: true,
			layoutModes: 'vertical',
			type: ItemType.DropdownBtn,
			caption: 'ui.business-base.navigator.goTo',
			iconClass: 'tlb-icons ico-goto',
			disabled: () => !dsCnt.entitySelection.hasSelection(),
			list: {
				items: navButtons,
				iconClass: 'tlb-icons ico-goto',
				isVisible: true,
				showImages: true,
				showTitles: true
			}
		};
	}

	/**
	 * This Function return the record navigation menu item
	 *
	 * @param {IFormContainerLink} containerLink current form container refrence object
	 * @returns {ConcreteMenuItem[]} return the tool menu item
	 */
	private createRecordNavigationMenuItem<T extends object>(containerLink: IFormContainerLink<T>): ConcreteMenuItem[] {
		return [
			{
				id: EntityContainerCommand.First,
				type: ItemType.Item,
				caption: { key: 'platform.formContainer.first' },
				iconClass: 'tlb-icons ico-rec-first',
				fn: () => {
					containerLink.entitySelection.selectFirst();
				},
			},
			{
				id: EntityContainerCommand.Previous,
				type: ItemType.Item,
				caption: { key: 'platform.formContainer.previous' },
				iconClass: 'tlb-icons ico-rec-previous',
				fn: () => {
					containerLink.entitySelection.selectPrevious();
				},
			},
			{
				id: EntityContainerCommand.Next,
				type: ItemType.Item,
				caption: { key: 'platform.formContainer.next' },
				iconClass: 'tlb-icons ico-rec-next',
				fn: () => {
					containerLink.entitySelection.selectNext();
				},
			},
			{
				id: EntityContainerCommand.Last,
				type: ItemType.Item,
				caption: { key: 'platform.formContainer.last' },
				iconClass: 'tlb-icons ico-rec-last',
				fn: () => {
					containerLink.entitySelection.selectLast();
				},
			},
		];
	}


	/**
	 * Used to add toolbar item from tree-level grid and
	 * to remove selected level from drodown menu item and
	 * display as active level in dropdown menu item.
	 *
	 * @param {ITreeContainerLink<T>} containerLink
	 * @returns {IDropdownBtnMenuItem} returns dropdown menu item for
	 * tree level expand-collapse.
	 */
	public addToolbarItemsForTreeLevelGrid<T extends object>(containerLink: ITreeContainerLink<T>, level?: number): IDropdownBtnMenuItem {

		let toolbar: IDropdownBtnMenuItem = {
			id: 'treeGridAccordion',
			sort: 58,
			caption: { key: 'cloud.common.toolbarCollapse' },
			iconClass: 'tlb-icons ico-tree-level-collapse',
			type: ItemType.DropdownBtn,
			disabled: false,
			list: {
				showTitles: true,
				showImages: true,
				items: [],
				activeValue: 'collapse'
			}
		};

		const maxLevel = level ? level : 9;
		const updatedToolbar = this.getUpdatedToolbar(containerLink);
		if (updatedToolbar) {
			toolbar = updatedToolbar;
		}
		this.updateActiveLevel(toolbar, maxLevel);

		const toolbarData = this.treeLevelContainer.generateTreeLevelToolbaritems(maxLevel, containerLink, toolbar);
		return toolbarData;
	}


	/**
	 * Used to get updated dropdown data for respective container.
	 *
	 * @param {ITreeContainerLink<T>} containerLink  contaier link
	 * @returns returns updated dropdown menu item
	 */
	public getUpdatedToolbar<T extends object>(containerLink: ITreeContainerLink<T>): IDropdownBtnMenuItem<void> | undefined {

		const groupItem = (containerLink?.uiAddOns.toolbar as MenuListContent).items?.items?.find((item) => item.id === EntityContainerCommand.ExpandCollapseGroup);

		if (groupItem) {
			const toolbar = (groupItem as IParentMenuItem).list.items?.find((item) => item.id === 'treeGridAccordion') as IDropdownBtnMenuItem;
			return toolbar;
		}
		return;
	}


	/**
	 * Used to update active level if active level is greater than
	 * max tree level.
	 *
	 * @param {IDropdownBtnMenuItem} toolbar tree-level dropdown data
	 * @param {number} maxLevel max level
	 */
	public updateActiveLevel(toolbar: IDropdownBtnMenuItem, maxLevel: number) {
		if (toolbar.list.activeValue !== 'collapse' && toolbar.list.activeValue !== 'expand') {
			const activeLevel = parseInt(toolbar.list.activeValue as string);
			if (activeLevel > maxLevel) {
				toolbar.list.activeValue = 'expand';
			}
		}
	}

}
