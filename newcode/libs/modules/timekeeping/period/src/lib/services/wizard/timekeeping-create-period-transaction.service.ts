import { inject, Injectable } from '@angular/core';
import { TimekeepingPeriodDataService } from '../timekeeping-period-data.service';
import { PlatformTranslateService, PlatformConfigurationService } from '@libs/platform/common';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';

interface ITimekeepingTransactionData {
	ConsolidationLevel: number;
	PostingDate?: Date | string | null;
	FromDate?: Date | string | null;
	ToDate?: Date | string | null;
}

@Injectable({
	providedIn: 'root'
})

export class TimekeepingCreatePeriodTransaction {
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected readonly translateServiceService = inject(PlatformTranslateService);
	protected configurationService = inject(PlatformConfigurationService);
	private readonly http = inject(HttpClient);
	private readonly dataService = inject(TimekeepingPeriodDataService);
	public TimekeepingPeriod: ITimekeepingTransactionData = {
		ConsolidationLevel: 1,
		FromDate: this.dataService.getSelection()[0]?.StartDate ?? null,
		ToDate: this.dataService.getSelection()[0]?.EndDate ?? null,
		PostingDate: this.dataService.getSelection()[0]?.PostingDate ?? null,
	};
	private readonly translate = inject(PlatformTranslateService);
	private formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private periodFormConfig: IFormConfig<ITimekeepingTransactionData> = {
		formId: 'timekeeping.period.createTransaction',
		showGrouping: false,
		groups: [

			{
				groupId: 'baseGroup',
				header: {key: 'timekeeping.period.consolidation'},
				open: true
			},
			{
				groupId: 'baseGroup',
				header: {key: 'timekeeping.period.fromDate'},
				open: true
			},
			{
				groupId: 'baseGroup',
				header: {key: 'timekeeping.period.toDate'},
				open: true
			},
			{
				groupId: 'baseGroup',
				header: {key: 'timekeeping.common.postingDate'},
				open: true
			},

		],
		rows: [
			{
				groupId: 'baseGroup',
				id: 'consolidationLevel',
				label: {
					key: 'timekeeping.period.consolidation',
				},
				type: FieldType.Integer,
				model: 'ConsolidationLevel',
			},
			{
				groupId: 'baseGroup',
				id: 'fromDate',
				label: {
					key: 'timekeeping.period.fromDate',
				},
				type: FieldType.DateUtc,
				model: 'FromDate',
			},
			{
				groupId: 'baseGroup',
				id: 'toDate',
				label: {
					key: 'timekeeping.period.toDate',
				},
				type: FieldType.DateUtc,
				model: 'ToDate',
			},
			{
				groupId: 'baseGroup',
				id: 'postingDate',
				label: {
					key: 'timekeeping.common.postingDate',
				},
				type: FieldType.DateUtc,
				model: 'PostingDate',
			},
		],
	};

	public createPeriodTransactions() {
		const options = {
			'IsSettlementCreate': 'true'
		};
		const isSettlementCreate = options.IsSettlementCreate ? options.IsSettlementCreate.toLowerCase() === 'true' : false;
		const selected = this.dataService.getSelection();

		if (selected.length > 1) {
			this.messageBoxService.showInfoBox(this.translate.instant('timekeeping.period.selectOnlyOnePeriod').text, 'info', true);
		} else if (selected.length == 0) {
			const bodyText = this.translateServiceService.instant('timekeeping.period.selectrecord');
			this.messageBoxService.showInfoBox(bodyText.text, 'error', true);
			return;
		} else {
			this.formDialogService.showDialog<ITimekeepingTransactionData>({
					headerText: 'timekeeping period unlock record',
					formConfiguration: this.periodFormConfig,
					entity: this.TimekeepingPeriod,
					runtime: undefined,
					customButtons: [],
					topDescription: '',
					width: '1200px',
					maxHeight: 'max',
				})
				?.then((result: IEditorDialogResult<ITimekeepingTransactionData>) => {
					if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {

						const data = {
							PKeys: [selected[0].Id],
							ConsolidationLevel: 1,
							PostingDate: result.value.PostingDate,
							FromDate: result.value.FromDate,
							ToDate: result.value.ToDate,
							IsSettlementCreate: isSettlementCreate
						};
						this.http.post(this.configurationService.webApiBaseUrl + 'timekeeping/period/transaction/createforperiods', data)
							.subscribe({
								next: response => {
									if (response !== undefined && response !== null) {
										this.messageBoxService.showInfoBox(this.translate.instant('timekeeping.period.createTransactions').text, 'info', true);
									}
									this.messageBoxService.showInfoBox(this.translate.instant('timekeeping.period.createTransactions').text, 'info', true);
								},
								error: error => {
									console.error('Error occurred during HTTP request:', error);
								}
							});
					}
				});

		}
	}

}