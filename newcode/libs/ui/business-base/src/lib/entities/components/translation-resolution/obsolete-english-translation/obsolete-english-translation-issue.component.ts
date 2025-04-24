/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import { FieldType, IAdditionalSelectOptions, IControlContext, IGridConfiguration, ISelectItem } from '@libs/ui/common';
import { UiBusinessBaseEntityTranslationIssueService } from '../../../services/ui-business-base-entity-translation-issue.service';
import { ITranslationIssue } from '../../../model/translation-issue.interface';
import { ITranslationIssueResolveParam } from '../../../model/translation-issue-resolve-param.interface';
import { Translatable } from '@libs/platform/common';


export interface IEnglishTranslationIssueData {
	rowId: number;
	itemValue?: string;
	translationValue?: string;
}

@Component({
	templateUrl: './obsolete-english-translation-issue.component.html',
	styleUrl: './obsolete-english-translation-issue.component.css'
})
export class ObsoleteEnglishTranslationIssueComponent implements OnInit{
	/**
	 * Flag resolutionDone
	 */
	public resolutionDone = false;

	/**
	 * Title of the issue
	 */
	public issueTitle: Translatable = { key: 'ui.business-base.translationIssueDialog.obsoleteEnglishIssue.issueTitle' };

	/**
	 * Description for the issue
	 */
	public issueDescription: Translatable = { key: 'ui.business-base.translationIssueDialog.obsoleteEnglishIssue.issueDescription' };

	/**
	 * The main entity description which have an issue
	 */
	public itemValue: string = '';

	/**
	 * The obsolete english translation item
	 */
	public translationValue: string = '';

	/**
	 * Button text for resolve button
	 */
	public buttonTextResolveIssue: Translatable = { key: 'ui.business-base.translationIssueDialog.obsoleteEnglishIssue.buttonResolve' };

	/**
	 * Title for the available actions section
	 */
	public actionsTitle: Translatable = { key: 'ui.business-base.translationIssueDialog.obsoleteEnglishIssue.availableActions' };

	/**
	 * Feedback message after issue has been resolved
	 */
	public feedbackMessageIssueResolved: Translatable = { key: 'ui.business-base.translationIssueDialog.notifications.issueResolved' };

	/**
	 * The grid config for displaying the selected item description and obsolete translation
	 */
	public gridConfig! : IGridConfiguration<IEnglishTranslationIssueData>;

	/**
	 * Radio type reference to be used in domain controller host
	 */
	public readonly fieldType = FieldType.Radio;

	/**
	 * Item source for available actions radio group
	 */
	public radioItemSource: IAdditionalSelectOptions<string> = {
		itemsSource:{
			items: []
		}
	};

	/**
	 * Context for the radio button group domain control. The field id of the domain control will be updated once the component has been initialized to have unique field ids for different radio groups.
	 */
	public controlContext: IControlContext = {
		fieldId: 'action-options',
		readonly: false,
		validationResults: [],
		entityContext: { totalCount: 0 },
	};

	private loading = false;
	private translationIssueService = inject(UiBusinessBaseEntityTranslationIssueService);
	private currentIssue?: ITranslationIssue;

	/**
	 * On Init
	 */
	public ngOnInit(): void {
		this.currentIssue = this.translationIssueService.getCurrentTranslationIssue();
		if(this.currentIssue) {
			const items: ISelectItem<string>[] = this.currentIssue.Options.map((op) => {
				return {
					id: op.GUID,
					displayName: op.Description
				};
			});
			this.radioItemSource.itemsSource = {
				items: items
			};
			this.itemValue = this.currentIssue.ItemValue;
			this.translationValue = this.currentIssue.BasTranslationValue;
			this.setGridData();
		}
	}

	/**
	 * isPerformBtnDisabled. true when no action is selected or resole is ongoing
	 */
	public isPerformBtnDisabled() {
		return !this.controlContext.value || this.loading;
	}

	/**
	 * Click handler for resolve issue button
	 */
	public onResolveIssueClick() {
		const actionGuid = this.controlContext.value;
		if(actionGuid && this.currentIssue && this.currentIssue.IssueGuid) {
			this.loading = true;
			const issueResolveParam: ITranslationIssueResolveParam = {
				IssueGuid: this.currentIssue.IssueGuid,
				OptionGuid: actionGuid as string,
				BasTranslationFk: this.currentIssue.BasTranslationFk,
				ItemValue: this.currentIssue.ItemValue,
				ColumnName: this.currentIssue.ColumnName
			};
			this.translationIssueService.resolveIssue(issueResolveParam).subscribe(success => {
				this.loading = false;
				this.resolutionDone = success;
				if(success) {
					this.translationIssueService.setCurrentTranslationIssues(undefined);
				}
			});
		}
	}

	private setGridData() {
		this.gridConfig = {
			idProperty: 'rowId',
			columns: [
				{
					id: 'itemDescription',
					label: { key: 'ui.business-base.translationIssueDialog.obsoleteEnglishIssue.columns.itemValue' },
					type: FieldType.Description,
					model: 'itemValue',
					sortable: false,
					sortOrder: 1,
					width: 150,
					visible: true,
				},
				{
					id: 'translationValue',
					label: { key: 'ui.business-base.translationIssueDialog.obsoleteEnglishIssue.columns.translationValue' },
					type: FieldType.Description,
					model: 'translationValue',
					sortable: false,
					sortOrder: 2,
					width: 150,
					visible: true,
				}
			]
		};
		const gridData: IEnglishTranslationIssueData[] = [];
		gridData.push({
			rowId: 1,
			itemValue: this.currentIssue?.ItemValue,
			translationValue: this.currentIssue?.BasTranslationValue
		});
		this.gridConfig.items = gridData;
		this.gridConfig.uuid = '9a99f2869c17453a93960d4ba7d1e86c';
	}
}