/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ItemType } from '@libs/ui/common';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ConstructionSystemCommonOutputDataService } from '../service/construction-system-common-output-data.service';
import { IConstructionSystemCommonScriptErrorEntity } from '../model/entities/construction-system-common-script-error-entity.interface';

@Injectable({
	providedIn: 'root',
})
export abstract class ConstructionSystemCommonOutputBehavior<T extends IConstructionSystemCommonScriptErrorEntity> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {
	protected constructor(private readonly dataService: ConstructionSystemCommonOutputDataService<T>) {}

	public onCreate(containerLink: IGridContainerLink<T>): void {
		this.dataService.outPutResultChanged.subscribe(async (value) => {
			await this.updateOutputResult(value);
		});

		containerLink.uiAddOns.toolbar.addItemsAtId(
			[
				{
					id: 't1',
					sort: 210,
					caption: 'constructionsystem.scriptToolBar.error',
					type: ItemType.Check,
					iconClass: 'tlb-icons ico-error',
					value: this.dataService.isShowError,
					fn: () => {
						this.dataService.isShowError = !this.dataService.isShowError;
						this.fireOutPutResultChanged();
					},
				},
				{
					id: 't2',
					sort: 211,
					caption: 'constructionsystem.scriptToolBar.warning',
					type: ItemType.Check,
					iconClass: 'tlb-icons ico-warning',
					value: this.dataService.isShowWarning,
					fn: () => {
						this.dataService.isShowWarning = !this.dataService.isShowWarning;
						this.fireOutPutResultChanged();
					},
				},
				{
					id: 't3',
					sort: 212,
					caption: 'constructionsystem.scriptToolBar.info',
					type: ItemType.Check,
					iconClass: 'tlb-icons ico-info',
					value: this.dataService.isShowInfo,
					fn: () => {
						this.dataService.isShowInfo = !this.dataService.isShowInfo;
						this.fireOutPutResultChanged();
					},
				},
				{
					id: 't4',
					sort: 213,
					caption: 'constructionsystem.scriptToolBar.filter',
					type: ItemType.Check,
					iconClass: 'tlb-icons ico-filter',
					value: this.dataService.isFilterByInstance,
					fn: () => {
						this.dataService.isFilterByInstance = !this.dataService.isFilterByInstance;
						this.fireOutPutResultChanged();
					},
				},
				{
					id: 't5',
					sort: 214,
					caption: 'constructionsystem.common.caption.showCalculationOutput',
					type: ItemType.Check,
					iconClass: 'tlb-icons ico-result-calculation-show',
					value: this.dataService.isFilterByCalculation,
					fn: () => {
						this.dataService.isFilterByCalculation = !this.dataService.isFilterByCalculation;

						console.warn(containerLink.uiAddOns.toolbar);
						if (this.dataService.isFilterByCalculation) {
							this.dataService.isFilterByInstance = true;
							// todo-allen: It seems that changing the value of 'isFilterByInstance' does not cause the value of the "t4 id" item to change accordingly.
							//  Need to manually modify the value of the current item?
							// toolBarItems[3].value = true;
						}

						this.fireOutPutResultChanged();
					},
				},
			],

			EntityContainerCommand.Settings,
		);
	}

	private fireOutPutResultChanged() {
		this.dataService.outPutResultChanged.next(null);
	}

	private async updateOutputResult(value: IConstructionSystemCommonScriptErrorEntity[] | null) {
		if (Array.isArray(value) && value.length === 0) {
			this.dataService.setList([]);
		} else {
			await this.dataService.load({ id: 0 });
		}
	}

	// todo-allen: platformGridAPI.events.register($scope.gridId,'onDblClick',navToScript);
	private navToScript() {
		// const selectedItem = this.dataService.getSelectedEntity();
		// const scriptId = 'construction.system.master.script';
		// todo-allen: wait for the basicsCommonScriptEditorService to finish.
		// const cm = basicsCommonScriptEditorService.getCm(scriptId);
		//
		// if (cm && selectedItem.Line > 0) {
		// 	cm.setCursor(CodeMirror.Pos(selectedItem.Line - 1, selectedItem.Column));
		// 	cm.focus();
		// }
	}
}
