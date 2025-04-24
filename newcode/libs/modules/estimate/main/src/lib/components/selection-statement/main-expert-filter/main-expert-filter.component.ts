/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { FilterScriptDefProvider, IDialog, IFilterScriptEditorOption, IMenuItemsList, ItemType } from '@libs/ui/common';

@Component({
	selector: 'estimate-main-expert-filter',
	templateUrl: './main-expert-filter.component.html',
	styleUrls: ['./main-expert-filter.component.scss'],
})
export class MainExpertFilterComponent {
	public constructor() {}

	protected get tools(): IMenuItemsList<IDialog> | undefined {
		return {
			cssClass: 'tools',
			items: [
				{
					type: ItemType.Item,
					caption: { text: 'Refresh' },
					iconClass: 'control-icons ico-refresh',
					id: 'Refresh',
					fn: () => {
						//this.addNewRecord();
					}
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
			],
		};
	}

	protected get context(): IDialog {
		return {
			close: (closingButtonId) => {}
		};
	}

	protected searchText: string = '';
	protected doc: string = '[Code] == "1001"';
	protected option: IFilterScriptEditorOption = {
		defProvider: new FilterScriptDefProvider()
	};
}
