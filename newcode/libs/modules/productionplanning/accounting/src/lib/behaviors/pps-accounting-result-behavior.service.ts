/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { first } from 'lodash';
import { InsertPosition, ISimpleMenuItem, ItemType } from '@libs/ui/common';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { IResultEntity } from '../model/models';
import { PpsAccountingResultDataService } from '../services/pps-accounting-result-data.service';
import { PpsAccountingCheckingFormulaDialogService } from '../services/pps-accounting-checking-formula-dialog.service';

@Injectable({
	providedIn: 'root'
})
export class PpsAccountingResultBehavior implements IEntityContainerBehavior<IGridContainerLink<IResultEntity>, IResultEntity> {

	private dataService: PpsAccountingResultDataService;
	private dialogService: PpsAccountingCheckingFormulaDialogService;

	private checkBtn: ISimpleMenuItem = {
		id: 'checkResultFormula',
		sort: 2,
		caption: 'productionplanning.accounting.result.checkFormula',
		type: ItemType.Item,
		iconClass: 'tlb-icons ico-question',
		fn: () => {
			if (this.dataService.getSelection().length === 1) {
				const formula = first(this.dataService.getSelection())?.QuantityFormula ?? '';
				this.dialogService.openDialog(formula).then(() => {});
			}
		},
		disabled: () => {
			return !this.dataService.hasSelection();
		}
	};

	public constructor() {
		this.dataService = inject(PpsAccountingResultDataService);
		this.dialogService = inject(PpsAccountingCheckingFormulaDialogService);
	}

	public onCreate(containerLink: IGridContainerLink<IResultEntity>): void {
		containerLink.uiAddOns.toolbar.addItemsAtId([this.checkBtn], EntityContainerCommand.CreateRecord, InsertPosition.Before);
	}
}