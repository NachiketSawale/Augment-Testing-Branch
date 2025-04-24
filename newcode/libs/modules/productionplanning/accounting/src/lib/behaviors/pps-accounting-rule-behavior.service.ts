/*
 * Copyright(c) RIB Software GmbH
 */

import _, { clone, first } from 'lodash';
import { InsertPosition, ISimpleMenuItem, ItemType } from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { PlatformConfigurationService } from '@libs/platform/common';

import { IRuleEntity } from '../model/models';
import { PpsAccountingRuleDataService } from '../services/pps-accounting-rule-data.service';
import { PpsAccountingCheckingPatternDialogService } from '../services/pps-accounting-checking-pattern-dialog.service';

@Injectable({
	providedIn: 'root'
})
export class PpsAccountingRuleBehavior implements IEntityContainerBehavior<IGridContainerLink<IRuleEntity>, IRuleEntity> {

	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	private dataService = inject(PpsAccountingRuleDataService);
	private dialogService: PpsAccountingCheckingPatternDialogService;

	private checkBtn: ISimpleMenuItem = {
		id: 'checkRule',
		sort: 2,
		caption: 'productionplanning.accounting.rule.checkRule',
		type: ItemType.Item,
		iconClass: 'tlb-icons ico-question',
		fn: () => {
			if (this.dataService.getSelection().length === 1) {
				const selectedRule = { ...first(this.dataService.getSelection()) } as IRuleEntity;
				this.dialogService.openCheckingDialog(selectedRule).then(() => {});
			}
		},
		disabled: () => {
			return !this.dataService.hasSelection();
		}
	};

	private copyBtn: ISimpleMenuItem = {
		id: 'copyBtn',
		sort: 1,
		caption: 'cloud.common.toolbarCopy',
		type: ItemType.Item,
		iconClass: 'tlb-icons ico-copy',
		fn: () => {
			this.dataService.setSourceRule(clone(this.dataService.getSelection()));
		},
		disabled: () => {
			return !this.dataService.hasSelection();
		}
	};

	private pasteBtn: ISimpleMenuItem = {
		id: 'pasteBtn',
		sort: 1,
		caption: 'cloud.common.toolbarPaste',
		type: ItemType.Item,
		iconClass: 'tlb-icons ico-paste',
		fn: () => {
			this.http.post(this.configService.webApiBaseUrl + 'productionplanning/accounting/rule/deepcopy', this.dataService.getSourceRule())
				.subscribe((response) => {
						if (response !== null && response !== undefined) {
							const rules = response as IRuleEntity[];
							_.forEach(rules, (rule)=>{
								this.dataService.pasteRule(rule);
							});
						}
				});
		},
		disabled: () => {
			return !this.dataService.hasSelection();
		}
	};

	public constructor() {
		this.dataService = inject(PpsAccountingRuleDataService);
		this.dialogService = inject(PpsAccountingCheckingPatternDialogService);
	}

	public onCreate(containerLink: IGridContainerLink<IRuleEntity>): void {
		containerLink.uiAddOns.toolbar.addItemsAtId([this.checkBtn, this.copyBtn, this.pasteBtn], EntityContainerCommand.CreateRecord, InsertPosition.Before);
	}
}