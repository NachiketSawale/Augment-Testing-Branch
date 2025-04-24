/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IPeriodEntity } from '../../model/entities/period-entity.interface';
import { TimekeepingPeriodDataService } from '../timekeeping-period-data.service';
import { TimekeepingPeriodTransactionDataService } from '../timekeeping-period-transaction-data.service';
import { PlatformTranslateService, PlatformConfigurationService } from '@libs/platform/common';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { ITimekeepingTransactionEntity } from '../../model/entities/timekeeping-transaction-entity.interface';
import { TimekeepingPeriodComplete } from '../../model/timekeeping-period-complete.class';

@Injectable({
	providedIn: 'root'
})


export class TimekeepingPeriodWizardService extends BasicsSharedChangeStatusService<IPeriodEntity, IPeriodEntity, TimekeepingPeriodComplete> {

	protected readonly dataService = inject(TimekeepingPeriodDataService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly timekeepingPeriodTransactionDataService = inject(TimekeepingPeriodTransactionDataService);
	protected configurationService = inject(PlatformConfigurationService);
	private formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);

	protected statusConfiguration: IStatusChangeOptions<IPeriodEntity, TimekeepingPeriodComplete> = {
		title: 'basics.customize.timekeepingperiodstatus',
		guid: '7e9548a88f274be19fa6835155739ea8',
		isSimpleStatus: false,
		statusName: 'timekeepingperiodstatus',
		checkAccessRight: true,
		statusField: 'PeriodStatusFk',
		updateUrl: '',
		rootDataService: this.dataService
	};
	private selected = this.dataService.getSelection();
	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}

	public lockIsSuccess() {
		const listTransaction = this.timekeepingPeriodTransactionDataService.getSelectedEntity();

		if (!listTransaction) {
			this.messageBoxService.showInfoBox(this.translate.instant('timekeeping.period.selectrecord').text, 'info', true);

			//this.timekeepingPeriodTransactionDataService.load(identificationData);
			return;
		}
		this.http.post(this.configurationService.webApiBaseUrl + 'timekeeping/period/lockissuccess', [listTransaction])
			.subscribe({
				next: response => {
					if (response !== undefined && response !== null) {

						this.messageBoxService.showInfoBox(this.translate.instant('timekeeping.period.transactionlocksuccess').text, 'info', true);
						//this.timekeepingPeriodTransactionDataService.load(identificationData);
					}
					this.messageBoxService.showInfoBox(this.translate.instant('timekeeping.period.transactionlocksuccess').text, 'info', true);
				},
				error: error => {
					console.error('Error occurred during HTTP request:', error);
				}
			});

		//return this.timekeepingPeriodTransactionDataService.load(identificationData);
	}

	public unlockIsSuccess() {
		const listTransaction = this.timekeepingPeriodTransactionDataService.getSelection();
		if (listTransaction !== null) {
			let CreateNewRecord = false; // Default value
			this.formDialogService.showDialog<ITimekeepingTransactionEntity>({
					headerText: 'timekeeping period unlock record',
					formConfiguration: this.updateAssembliesFormConfig,
					entity: this.TimekeepingTransaction,
					runtime: undefined,
					customButtons: [],
					topDescription: '',
					width: '1200px',
					maxHeight: 'max',
				})
				?.then((result: IEditorDialogResult<ITimekeepingTransactionEntity>) => {
					if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
						// Ensure that result.value.CreateNewRecord is a boolean
						if (typeof result.value.CreateNewRecord === 'boolean') {
							CreateNewRecord = result.value.CreateNewRecord;
						}
						listTransaction.forEach(e => {
							e.CreateNewRecord = CreateNewRecord;
						});
	                  this.http.post(this.configurationService.webApiBaseUrl + 'timekeeping/period/unlockissuccess', listTransaction)
		                  .subscribe({
			                  next: response => {
				                  if (response !== undefined && response !== null) {
					                  this.messageBoxService.showInfoBox(this.translate.instant('timekeeping.period.transactionunlocksuccess').text, 'info', true);
					                  // Update with actual identification data
					                //  this.timekeepingPeriodTransactionDataService.load(identificationData);
				                  }
				                  this.messageBoxService.showInfoBox(this.translate.instant('timekeeping.period.transactionunlocksuccess').text, 'info', true);
			                  },
			                  error: error => {
				                  console.error('Error occurred during HTTP request:', error);
			                  }
		                  });
					}
				});
		} else {
			this.messageBoxService.showInfoBox(this.translate.instant('timekeeping.period.selectrecord').text, 'info', true);
		}
	}

	private updateAssembliesFormConfig: IFormConfig<ITimekeepingTransactionEntity> = {
		formId: 'timekeeping.period.timekeepingperiodunlockrecord',
		showGrouping: true,

		groups: [
			{
				groupId: 'baseGroup',
				header: 'CreateNewRecord',
				open: true,
				//TODO: 'attributes' are missing in the groups
			}
		],
		rows: [
			{
				groupId: 'baseGroup',
				id: 'CreateNewRecord',
				label: {
					key: 'timekeeping.period.createnewrecordalso',
				},
				type: FieldType.Boolean,
				model: 'CreateNewRecord',
				sortOrder: 1,
			},
		],
	};

	/**
	 * copyOptions dialog form controls data.
	 */
	public TimekeepingTransaction: ITimekeepingTransactionEntity = {
		Amount: 0, CompanyChargedFk: 0, CompanyFk: 0, Id: 0, IsControllingRelevant: false, IsDebit: false, IsSuccess: false, PeriodFk: 0, PostingDate: '', Quantity: 0, TransactionCase: 0, TransactionTypeFk: 0, VoucherDate: '', VoucherNumber: ''
	};


}

