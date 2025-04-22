/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import { createLookup, FieldType, IGridConfiguration, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { ITranslationIssueHistory } from '../../../model/translation-issue-history.interface';
import { UiBusinessBaseEntityTranslationIssueService } from '../../../services/ui-business-base-entity-translation-issue.service';

@Component({
	templateUrl: './resolution-history.component.html',
	styleUrl: './resolution-history.component.scss'
})
export class ResolutionHistoryComponent implements OnInit {
	public gridConfig!: IGridConfiguration<ITranslationIssueHistory>;
	private translationIssueService = inject(UiBusinessBaseEntityTranslationIssueService);
	private readonly lookupServiceFactory = inject(UiCommonLookupDataFactoryService);

	/**
	 * On Init
	 */
	public ngOnInit(): void {
		this.setGridData();
	}

	private setGridData() {
		this.gridConfig = {
			idProperty: 'Id',
			columns: [
				{
					id: 'actionTaken',
					label: { key: 'ui.business-base.translationIssueDialog.issueHistory.columns.actionTaken' },
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: this.lookupServiceFactory.fromSimpleItemClass([
							{id: 0, desc: { key: 'ui.business-base.translationIssueDialog.issueHistory.options.translationKept' }},
							{id: 1, desc: { key: 'ui.business-base.translationIssueDialog.issueHistory.options.directRemove' }}
						])
					}),
					model: 'ActionTaken',
					sortable: false,
					sortOrder: 1,
					width: 150,
					visible: true,
				},
				{
					id: 'columnName',
					label: { key: 'ui.business-base.translationIssueDialog.issueHistory.columns.columnName' },
					type: FieldType.Description,
					model: 'ColumnName',
					sortable: false,
					sortOrder: 1,
					width: 150,
					visible: true,
				},
				{
					id: 'columnValue',
					label: { key: 'ui.business-base.translationIssueDialog.issueHistory.columns.columnValue' },
					type: FieldType.Description,
					model: 'ColumnValue',
					sortable: false,
					sortOrder: 2,
					width: 150,
					visible: true,
				},
				{
					id: 'translationValue',
					label: { key: 'ui.business-base.translationIssueDialog.issueHistory.columns.translationValue' },
					type: FieldType.Description,
					model: 'BasTranslationValue',
					sortable: false,
					sortOrder: 2,
					width: 150,
					visible: true,
				},
				{
					id: 'inserted',
					label: { key: 'ui.business-base.translationIssueDialog.issueHistory.columns.inserted' },
					type: FieldType.Date,
					model: 'InsertedAt',
					sortable: false,
					sortOrder: 2,
					width: 150,
					visible: true,
				}
			]
		};
		this.gridConfig.items = this.translationIssueService.getCurrentTranslationIssueHistory();
		this.gridConfig.uuid = '8f431a5eabb443a08bd92ff036d4978b';
	}

}