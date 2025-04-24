/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { FilterScriptDefProvider, IDialog, IFilterScriptEditorOption, IMenuItemsList, ItemType } from '@libs/ui/common';

@Component({
	selector: 'estimate-main-object-expert-filter',
	templateUrl: './main-object-expert-filter.component.html',
	styleUrls: ['./main-object-expert-filter.component.scss'],
})
export class MainObjectExpertFilterComponent {
	public constructor() {}

	protected get tools(): IMenuItemsList<IDialog> | undefined {
		return {
			cssClass: 'tools',
			items: [
				{
					type: ItemType.Item,
					caption: {
						text: 'Select all objects without any child objects.',
						key: 'model.viewer.selectionWz.treePartLeaves',
					},
					iconClass: 'control-icons tlb-icons ico-object-restrictions-1',
					id: 'treePartLeaves',
					fn: () => {
						//this.addNewRecord();
					},
				},
				{
					type: ItemType.Item,
					caption: {
						text: 'Select the minimum amount of parent objects.',
						key: 'model.viewer.selectionWz.treePartMinimal',
					},
					iconClass: 'control-icons tlb-icons ico-object-restrictions-3',
					id: 'treePartMinimal',
					fn: () => {
						//this.deleteResord();
					},
					disabled: () => {
						return false;
						//return !this.dataService.GetSelected();
					},
				},
				{
					type: ItemType.Item,
					caption: {
						key: 'model.viewer.selectionWz.treePartMode',
					},
					iconClass: 'control-icons tlb-icons ico-object-restrictions-5',
					id: 'treePartMode',
					fn: () => {
						//this.deleteResord();
					},
					disabled: () => {
						return false;
						//return !this.dataService.GetSelected();
					},
				},
				{
					type: ItemType.Item,
					caption: { text: 'Refresh', key: 'constructionsystem.common.caption.refresh' },
					iconClass: 'control-icons ico-refresh',
					id: 'Refresh',
					fn: () => {
						//this.deleteResord();
					},
					disabled: () => {
						return false;
						//return !this.dataService.GetSelected();
					},
				},
				{
					type: ItemType.Item,
					caption: { text: 'Delete', key: 'cloud.desktop.filterdefFooterBtnDelete' },
					iconClass: 'control-icons ico-input-delete2',
					id: 'Delete',
					fn: () => {
						//this.deleteResord();
					},
					disabled: () => {
						return false;
						//return !this.dataService.GetSelected();
					},
				},
				{
					type: ItemType.Item,
					caption: { text: 'Save', key: 'cloud.desktop.filterdefFooterBtnSave' },
					iconClass: 'control-icons tlb-icons ico-save',
					id: 'Save',
					fn: () => {
						//this.deleteResord();
					},
					disabled: () => {
						return false;
						//return !this.dataService.GetSelected();
					},
				},
				{
					type: ItemType.Item,
					caption: { text: 'Save As', key: 'cloud.desktop.filterdefFooterBtnSaveAs' },
					iconClass: 'control-icons tlb-icons ico-save-as',
					id: 'SaveAs',
					fn: () => {
						//this.deleteResord();
					},
					disabled: () => {
						return false;
						//return !this.dataService.GetSelected();
					},
				},
				{
					type: ItemType.Item,
					caption: { text: 'Revert', key: 'constructionsystem.common.caption.revert' },
					iconClass: 'tlb-icons ico-undo',
					id: 'Revert',
					fn: () => {
						//this.deleteResord();
					},
					disabled: () => {
						return false;
						//return !this.dataService.GetSelected();
					},
				},
			],
		};
	}

	protected get context(): IDialog {
		return {
			close: (closingButtonId) => {},
		};
	}

	protected searchText: string = '';
	protected doc: string = '';
	protected option: IFilterScriptEditorOption = {
		defProvider: new FilterScriptDefProvider(),
	};
}
